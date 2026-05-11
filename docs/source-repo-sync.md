Source Repo Sync Contracts
==========================

Purpose
-------
This document explains how a source repository publishes a public-safe microsite
bundle into `govermon.github.io`.

Supported contracts
-------------------
The public site supports two publishing contracts for `projects/<slug>/`:

- direct push: a trusted source repo commits its exported subtree straight to `main`
- pull request: a review-gated source repo pushes a branch and opens a pull request against `main`

In both contracts, the source repo must:

- export only public-safe files
- update only its own `projects/<slug>/` subtree unless intentionally changing shared assets
- leave `projects/projects.json` to the public repo build workflow

Current live auth model
-----------------------
The current live setup uses one GitHub App named `govermon-pages-publisher`.

For `amsler-tracker`, the source repo configuration is:

- `GOVERMON_SITE_SYNC_ENABLED=true`
- `GOVERMON_SITE_REPO=govermon/govermon.github.io`
- `GOVERMON_SITE_PUSH_APP_ID=367364`
- `GOVERMON_SITE_PUSH_APP_PRIVATE_KEY` stored as a repo secret

That same app can support either contract if it has the needed repository
permissions. If trust boundaries diverge later, split into one app per contract
class without changing the bundle layout.

Required permissions
--------------------
For the current single-app model:

- `Contents: Read and write` is required
- `Pull requests: Read and write` is required only if you will use the pull-request contract

Source-repo building blocks
---------------------------
Every source repo should have:

- an export script that writes the public-safe bundle into a target directory
- a workflow that generates a GitHub App installation token
- logic that no-ops when the exported subtree is unchanged

Examples in this repository:

- `docs/examples/export-project-site.sh`
- `docs/examples/sync-source-repo-direct-push.yml`
- `docs/examples/sync-source-repo-pull-request.yml`

Migration away from broader credentials
---------------------------------------
If a source repo previously used a broad PAT or a GitHub CLI-derived token:

- switch the workflow to the GitHub App-backed contract first
- confirm at least one successful publish run
- delete the old fallback secret such as `GOVERMON_SITE_REPO_TOKEN`
- revoke the broader underlying credential after the app-based flow is verified