#!/usr/bin/env node
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const projectsDir = path.join(rootDir, 'projects');
const outputPath = path.join(projectsDir, 'projects.json');

function requiredString(value, fieldName, filePath) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${filePath}: expected non-empty string for ${fieldName}`);
  }
  return value;
}

function optionalNumber(value, fallback = 1000) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

async function loadProjectMetadata(entryName) {
  const metadataPath = path.join(projectsDir, entryName, 'project.json');
  const raw = await readFile(metadataPath, 'utf8');
  const parsed = JSON.parse(raw);

  return {
    slug: requiredString(parsed.slug, 'slug', metadataPath),
    name: requiredString(parsed.name, 'name', metadataPath),
    summary: requiredString(parsed.summary, 'summary', metadataPath),
    order: optionalNumber(parsed.order),
    status: typeof parsed.status === 'string' ? parsed.status : 'active',
    visibility: typeof parsed.visibility === 'string' ? parsed.visibility : 'public',
    homepage_path: requiredString(parsed.homepage_path, 'homepage_path', metadataPath),
    live_page_path: typeof parsed.live_page_path === 'string' ? parsed.live_page_path : '',
    status_path: typeof parsed.status_path === 'string' ? parsed.status_path : '',
    tags: Array.isArray(parsed.tags) ? parsed.tags.filter((tag) => typeof tag === 'string') : [],
    notes: Array.isArray(parsed.notes) ? parsed.notes.filter((note) => typeof note === 'string') : []
  };
}

async function main() {
  const entries = await readdir(projectsDir, { withFileTypes: true });
  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const projects = [];
  for (const directory of directories) {
    try {
      const metadata = await loadProjectMetadata(directory);
      projects.push(metadata);
    } catch (error) {
      if (error.code === 'ENOENT') {
        continue;
      }
      throw error;
    }
  }

  projects.sort((left, right) => {
    if (left.order !== right.order) {
      return left.order - right.order;
    }
    return left.name.localeCompare(right.name);
  });

  const payload = {
    generated_at: new Date().toISOString(),
    project_count: projects.length,
    projects
  };

  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  process.stdout.write(`Wrote ${outputPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
