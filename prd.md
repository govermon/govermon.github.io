Product Requirements Document: govermon.github.io
==================================================

1. Problem
----------
The `govermon` identity needs a stable public homepage and a place to showcase
projects whose source repositories may remain private.

A single user-site repository should provide:
- a simple top-level homepage with bio and contact links
- a reusable structure for public project microsites
- a contract that allows private repositories to contribute public-safe bundles
- an automated Pages build that rebuilds catalog metadata whenever bundles change

2. Goals
--------
- Publish a polished top-level site at `https://govermon.github.io/`.
- Support many project microsites at `https://govermon.github.io/projects/<slug>/`.
- Make project onboarding deterministic through a documented bundle contract.
- Keep the public repo free of private build, cloud, and credential details.
- Allow private repos to sync updates by direct push.

3. Non-goals
------------
- Hosting private source code.
- Replacing GitHub profile behavior.
- Acting as a reverse proxy for live applications.
- Managing secrets for contributing private repos.

4. Users
--------
- Primary: `govermon`, maintaining a public identity and project showcase.
- Secondary: visitors looking for project summaries and live links.
- Secondary: coding agents updating the site or reviewing contributed bundles.

5. Information Architecture
---------------------------
- Home page: short bio, links, featured projects.
- Project microsites: one folder per project under `projects/`.
- Docs: bundle contract, build workflow, profile-repo guidance.
- Generated catalog: `projects/projects.json`.

6. Project bundle contract
--------------------------
Each project bundle should provide:
- `index.html`
- `site.css`
- `project.json`
- `site-status.json`
- `live-app.html`

Optional additional assets may live alongside those files.

7. Build workflow
-----------------
- On pull requests: validate and rebuild the catalog.
- On push to `main`: rebuild the catalog and deploy the site through GitHub Pages.
- Private repos push only their own public-safe `projects/<slug>/` subtree into this repo.
- Root homepage reads the generated project catalog and renders project cards client-side.

8. Initial content
------------------
- A short placeholder bio.
- Links to `https://github.com/govermon` and a placeholder contact link.
- A starter Amsler Tracker project microsite under `projects/amsler-tracker/`.

9. Future enhancements
----------------------
- Featured writing or changelog section.
- Better project filtering and tagging.
- Profile README companion repository (`govermon`).
- Optional custom domain later.
