Project Bundle Contract
=======================

Purpose
-------
Each published project microsite lives under:

    projects/<slug>/

Private source repositories should export public-safe files into that folder and
push only that subtree into this repository.

Supported publication contracts
-------------------------------
The public repo supports two ways for a source repository to publish that
subtree:

- direct push into `main`
- branch push plus pull request into `main`

The publication contract does not change bundle ownership rules. In both modes,
the source repository owns only its own `projects/<slug>/` subtree.

Required files
--------------
Each project bundle must contain these files:
- `index.html`
- `site.css`
- `project.json`
- `site-status.json`
- `live-app.html`

Optional files
--------------
A project bundle may also include:
- images
- additional static JSON files
- project-specific JavaScript
- project-specific asset folders

The top-level site only depends directly on `project.json`.

`project.json` contract
-----------------------
Required fields:
- `slug`: short folder-safe project identifier
- `name`: display name
- `summary`: one-paragraph project summary
- `homepage_path`: path under this site, usually `/projects/<slug>/`

Recommended fields:
- `order`: lower numbers appear earlier on the homepage
- `status`: such as `active`, `prototype`, or `archived`
- `visibility`: such as `public`, `private-source`, or `mixed`
- `live_page_path`: path to the redirect or live link page
- `status_path`: path to the status payload
- `tags`: array of short tags
- `notes`: array of short explanatory notes

Example
-------
    {
      "slug": "amsler-tracker",
      "name": "Amsler Tracker",
      "summary": "Touchscreen-first Amsler grid capture and review with a public deployment pointer.",
      "order": 20,
      "status": "active",
      "visibility": "private-source",
      "homepage_path": "/projects/amsler-tracker/",
      "live_page_path": "/projects/amsler-tracker/live-app.html",
      "status_path": "/projects/amsler-tracker/site-status.json",
      "tags": ["Flask", "Playwright", "GCE"]
    }

Public-safety rules
-------------------
Project bundles in this repository must not expose:
- secrets
- private SSH material
- service-account credentials
- internal-only hostnames or environment files
- private issue tracker details unless intentionally sanitized for public view

Allowed examples:
- a public live URL
- a sanitized deployment state
- a public project summary
- links to a public repository, if one exists

Ownership model
---------------
The private source repository is responsible for its own project bundle.

This public repo is responsible for:
- validating bundle metadata
- rebuilding the global project catalog
- publishing the final static site

For source-repo workflow examples, see `docs/source-repo-sync.md` and the
example files under `docs/examples/`.
