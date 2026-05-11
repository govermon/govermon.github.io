Copilot Instructions For govermon.github.io
===========================================

This repository is the public GitHub Pages site for the `govermon` identity.

Key rules:
- Treat `projects/<slug>/` as imported public-safe bundles from source repos.
- Keep the site static and easy to inspect.
- Do not add SaaS tooling, analytics, or secret-dependent build steps by default.
- Rebuild `projects/projects.json` with `node scripts/rebuild-project-catalog.mjs` rather than editing it by hand.
- Preserve the separation between the user site (`govermon.github.io`) and the optional profile README repo (`govermon`).

Documentation split:
- `docs/` is for repository and publishing workflow docs.
- `projects/` is for public microsite bundles only.
- `issues/` is optional planning collateral for future work.
