govermon.github.io
===================

Purpose
-------
This repository is the public user-site for `govermon.github.io`.

It serves two related jobs:
- act as the top-level public homepage for the `govermon` identity
- publish per-project static microsites under `projects/<slug>/`

The repository is intentionally designed so private source repositories can
contribute public-safe project bundles by direct sync without exposing their
full build, deploy, or issue-tracking history.

Repository shape
----------------
- `index.html` is the top-level homepage
- `site.css` styles the top-level homepage
- `projects/` contains one subdirectory per published project microsite
- `projects/projects.json` is the generated project catalog used by the homepage
- `scripts/rebuild-project-catalog.mjs` rebuilds the catalog from project bundle metadata
- `docs/project-bundle-contract.md` defines what a private repo must export
- `docs/build-workflow.md` documents validation, rebuild, and publish behavior
- `docs/source-repo-sync.md` documents the supported source-repo publishing contracts
- `docs/examples/` contains example export scripts and workflow definitions for source repos
- `.github/workflows/pages.yml` validates the repo, rebuilds the catalog, and deploys Pages

Quick start
-----------
1. Create the GitHub repository named `govermon.github.io`.
2. Copy this template into the fresh checkout.
3. Commit and push to `main`.
4. In GitHub Pages settings, use `GitHub Actions` as the source.
5. Confirm the site publishes at `https://govermon.github.io/`.

Local rebuild
-------------
Run:

    node scripts/rebuild-project-catalog.mjs

That regenerates `projects/projects.json` from `projects/*/project.json`.

Cross-repo sync model
---------------------
Private repositories should not publish Pages directly.

Instead they should publish a public-safe bundle through one of two supported
contracts:

- direct push: trusted publishers commit their own `projects/<slug>/` subtree straight to `main`
- pull request: review-gated publishers push a branch and open a pull request against `main`

In both cases, the source repo should:

- generate a public-safe project bundle
- update only its own `projects/<slug>/` subtree unless intentionally changing shared site assets
- leave `projects/projects.json` to this repo's build workflow

The current live publisher app is a single GitHub App named
`govermon-pages-publisher`.

For the current Amsler Tracker design, the private repo uses that app for the
direct-push contract through its own GitHub Actions workflow with:
- repository variable `GOVERMON_SITE_SYNC_ENABLED=true`
- repository variable `GOVERMON_SITE_REPO=govermon/govermon.github.io`
- repository variable `GOVERMON_SITE_PUSH_APP_ID=3679364`
- repository secret `GOVERMON_SITE_PUSH_APP_PRIVATE_KEY`

Preferred auth for that direct-push contract is a dedicated GitHub App
installation limited to this repository. A PAT fallback may exist during
migration, but should be treated as temporary and revoked after the app-based
flow is confirmed working.

For both supported source-repo contracts, see:

- `docs/source-repo-sync.md`
- `docs/examples/export-project-site.sh`
- `docs/examples/sync-source-repo-direct-push.yml`
- `docs/examples/sync-source-repo-pull-request.yml`

What belongs here
-----------------
Good uses for this user-site repository include:
- a short bio
- links to GitHub and other contact points
- featured project cards
- public-safe project status pages
- blog or notes later, if you choose to add them

What does not belong here:
- private deployment scripts
- cloud credentials or secret-bearing `.env` files
- internal-only docs that do not support the public site contract
