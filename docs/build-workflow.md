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
A private repo such as `amsler-tracker` should export a public-safe bundle and
then publish only its own `projects/<slug>/` subtree using one of these
contracts:

- direct push to `main`
- branch push plus pull request into `main`

Current authentication model:

- the live deployment currently uses one GitHub App named `govermon-pages-publisher`
- that app is installed on `govermon/govermon.github.io` and on the source repo that stores its private key
- the current `amsler-tracker` direct-push workflow uses `GOVERMON_SITE_PUSH_APP_ID=3679364`
- the app private key is stored in `GOVERMON_SITE_PUSH_APP_PRIVATE_KEY`

If you later decide to split trust boundaries more strictly, you can move to one
GitHub App per contract class without changing the public bundle contract.

Contract guidance:

- direct push is appropriate for trusted publishers where direct writes to `main` are acceptable
- pull request mode is appropriate when every public bundle update should be reviewable before merge
- both modes must no-op when the exported subtree is unchanged
- neither mode should edit `projects/projects.json` directly

Repository permissions for the current single-app setup:

- `Contents: Read and write` is required
- `Pull requests: Read and write` is needed only if the app will also be used for the PR contract

Source-repo configuration for the current direct-push workflow:

- variable `GOVERMON_SITE_SYNC_ENABLED=true`
- variable `GOVERMON_SITE_REPO=govermon/govermon.github.io`
- variable `GOVERMON_SITE_PUSH_APP_ID=3679364`
- secret `GOVERMON_SITE_PUSH_APP_PRIVATE_KEY`

Temporary migration fallback:

- repo secret `GOVERMON_SITE_REPO_TOKEN` may exist briefly while moving away from a broader token
- once the app-backed workflow is proven, delete that secret and revoke the broader credential

Reference material for contributors and coding agents:

- `docs/source-repo-sync.md`
- `docs/examples/export-project-site.sh`
- `docs/examples/sync-source-repo-direct-push.yml`
- `docs/examples/sync-source-repo-pull-request.yml`

Secrets in this public repo
---------------------------
No repository secrets are required for normal GitHub Pages publishing here.

The cross-repo authentication lives in the contributing private repositories,
not in this public site repository.
