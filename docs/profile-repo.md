User Site Repo Versus Profile Repo
==================================

Two different GitHub features are easy to confuse.

1. User-site repository
-----------------------
This is the special repository named exactly:

    govermon.github.io

It publishes the GitHub Pages site at:

    https://govermon.github.io/

Use it for:
- a public homepage
- project listings
- static project microsites
- public documentation or notes

2. Profile README repository
----------------------------
This is the special repository named exactly:

    govermon

If that repository contains `README.md`, GitHub renders that README on the
profile page at `https://github.com/govermon`.

Use it for:
- a short profile introduction
- pinned links
- a short link to the public user site

Recommended split
-----------------
- Keep `govermon.github.io` as the public website.
- Optionally create `govermon` later as the profile README repo.
- Link from the profile README to the public user site.

That keeps the GitHub profile customization and the actual website separate.
