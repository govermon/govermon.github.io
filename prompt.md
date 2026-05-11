Prompt for Future Work on govermon.github.io
===========================================

Read these first:
- `README.md`
- `prd.md`
- `docs/project-bundle-contract.md`
- `docs/build-workflow.md`

What this repo is
-----------------
This is the public user-site repository for `govermon.github.io`.
It is the publishing target for the public homepage and for project microsites
exported from private source repositories.

Important constraints
---------------------
- Keep private source details out of this repo.
- Treat `projects/<slug>/` as imported public bundles owned primarily by the
  corresponding source repo.
- Do not hand-edit `projects/projects.json`; rebuild it with the script.
- Prefer small, explicit HTML/CSS/JS over heavy frameworks.
- Preserve the repository's role as a simple static host.

When adding a new project
-------------------------
1. Create `projects/<slug>/`.
2. Add the required bundle files.
3. Run `node scripts/rebuild-project-catalog.mjs`.
4. Verify the homepage card renders correctly.
5. Update docs only if the contract changed.

When changing the contract
--------------------------
If you change required project bundle files or metadata fields, update:
- `docs/project-bundle-contract.md`
- `scripts/rebuild-project-catalog.mjs`
- any affected project bundles
- the top-level README if onboarding changed
