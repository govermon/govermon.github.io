Build Workflow
==============

Overview
--------
This repository is a static GitHub Pages site.

The build process does one important generated step before deployment:
- rebuild `projects/projects.json` from `projects/*/project.json`

That generated catalog powers the top-level homepage.

GitHub Actions behavior
-----------------------
The workflow in `.github/workflows/pages.yml` runs on:
- pull requests to `main`
- pushes to `main`
- manual dispatch

On pull requests:
- the workflow checks out the repo
- rebuilds the catalog
- fails if project metadata is malformed
- does not deploy Pages

On pushes to `main`:
- the workflow rebuilds the catalog
- uploads the repository as the Pages artifact
- deploys the static site through GitHub Pages

Why the public repo rebuilds the catalog itself
-----------------------------------------------
Private source repositories should only own their own project bundles.

They should not try to update the global project catalog directly.

This repo is the source of truth for:
- top-level site structure
- catalog generation
- Pages deployment

That keeps the cross-repo contract small and reduces merge conflicts when many
private repos contribute project updates.

Local maintenance
-----------------
From the repo root run:

    node scripts/rebuild-project-catalog.mjs

Commit the updated `projects/projects.json` when project metadata changes.

Cross-repo sync flow
--------------------
A private repo such as `amsler-tracker` should:
- export its public-safe bundle
- push updates directly into `govermon/govermon.github.io`
- touch only `projects/<slug>/` unless it intentionally updates shared docs or shared site assets

Recommended token model for the private repo workflow:
- use a fine-grained personal access token or GitHub App token
- scope it only to the `govermon/govermon.github.io` repository
- grant contents write and metadata read access

Required configuration in the private repo:
- variable `GOVERMON_SITE_SYNC_ENABLED=true`
- variable `GOVERMON_SITE_REPO=govermon/govermon.github.io`
- secret `GOVERMON_SITE_REPO_TOKEN`

Secrets in this public repo
---------------------------
No repository secrets are required for normal GitHub Pages publishing here.

The cross-repo authentication lives in the contributing private repositories,
not in this public site repository.
