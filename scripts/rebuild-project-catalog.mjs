#!/usr/bin/env node
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const projectsDir = path.join(rootDir, 'projects');
const outputPath = path.join(projectsDir, 'projects.json');
const generatedEntryPageName = 'start.html';

function requiredString(value, fieldName, filePath) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${filePath}: expected non-empty string for ${fieldName}`);
  }
  return value;
}

function optionalNumber(value, fallback = 1000) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function extractRefreshUrl(html, filePath) {
  const refreshMatch = html.match(/<meta\b(?=[^>]*http-equiv=["']refresh["'])(?=[^>]*content=["']([^"']+)["'])[^>]*>/i);
  if (!refreshMatch) {
    return '';
  }

  const contentValue = refreshMatch[1];
  const urlMatch = contentValue.match(/url\s*=\s*(.+)$/i);
  if (!urlMatch) {
    throw new Error(`${filePath}: refresh meta tag is missing a url target`);
  }

  return urlMatch[1].trim();
}

function extractAnchorUrl(html) {
  const anchorMatch = html.match(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/i);
  return anchorMatch ? anchorMatch[1].trim() : '';
}

function getStartPagePath(slug) {
  return `/projects/${slug}/${generatedEntryPageName}`;
}

async function resolveLiveTargetUrl(project) {
  if (!project.live_page_path) {
    throw new Error(`projects/${project.slug}/project.json: live_page_path is required to generate ${generatedEntryPageName}`);
  }

  const livePagePath = path.join(rootDir, project.live_page_path.replace(/^\//, ''));
  const livePage = await readFile(livePagePath, 'utf8');
  const refreshUrl = extractRefreshUrl(livePage, livePagePath);
  if (refreshUrl) {
    return refreshUrl;
  }

  const anchorUrl = extractAnchorUrl(livePage);
  if (anchorUrl) {
    return anchorUrl;
  }

  throw new Error(`${livePagePath}: could not find a live target URL to use for ${generatedEntryPageName}`);
}

function renderStartPage(project, liveTargetUrl) {
  const projectName = escapeHtml(project.name);
  const liveUrl = escapeHtml(liveTargetUrl);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${projectName} start</title>
    <meta name="description" content="Entry page for ${projectName}.">
    <style>
      :root {
        color-scheme: light;
        --ink: #13242b;
        --accent: #0b5f7a;
        --accent-strong: #08485d;
        --paper: rgba(255, 255, 255, 0.86);
        --line: rgba(19, 36, 43, 0.12);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 1.5rem;
        background:
          radial-gradient(circle at top, rgba(215, 225, 230, 0.95), transparent 45%),
          linear-gradient(180deg, #f5efe3 0%, #d7e1e6 100%);
        color: var(--ink);
        font-family: "Avenir Next", "Gill Sans", "Trebuchet MS", sans-serif;
      }

      main {
        width: min(28rem, 100%);
        padding: 2.75rem 2rem;
        border: 1px solid var(--line);
        border-radius: 1.5rem;
        background: var(--paper);
        box-shadow: 0 20px 60px rgba(19, 36, 43, 0.16);
        text-align: center;
      }

      h1 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 2.8rem);
        line-height: 1.05;
      }

      .actions {
        display: flex;
        justify-content: center;
        margin-top: 1.75rem;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 10rem;
        padding: 0.85rem 1.3rem;
        border-radius: 999px;
        background: var(--accent);
        color: #ffffff;
        font-weight: 700;
        text-decoration: none;
      }

      .button:hover,
      .button:focus-visible {
        background: var(--accent-strong);
      }
    </style>
  </head>
  <body>
    <main>
      <h1>${projectName}</h1>
      <div class="actions">
        <a class="button" href="${liveUrl}">Enter</a>
      </div>
    </main>
  </body>
</html>
`;
}

async function writeStartPage(project) {
  const liveTargetUrl = await resolveLiveTargetUrl(project);
  const outputFile = path.join(projectsDir, project.slug, generatedEntryPageName);
  const page = renderStartPage(project, liveTargetUrl);
  await writeFile(outputFile, page, 'utf8');
  return getStartPagePath(project.slug);
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

  for (const project of projects) {
    project.entry_page_path = await writeStartPage(project);
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
