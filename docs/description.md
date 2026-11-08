# Description

**gh-docs** is a reusable setup for writing and publishing repository documentation. It combines:

- [VitePress](https://vitepress.dev/) to turn Markdown files into static HTML.
- GitHub Actions to build and publish the site to GitHub Pages.
- Per-pull-request previews, with a link posted to each supported PR.
- Automatic cleanup of a preview when its PR is merged or closed.

The documentation app and its npm manifest are kept under `docs/`. Repositories written in Java, Go, or other languages do not need a root `package.json`.

## Publishing model

The main branch site is published at the root of the Pages site. Each active same-repository PR gets a subdirectory such as `/pr-42/`. Closing a PR removes only its preview directory.

The pages are static output, so GitHub Pages does not run a Node.js server. Fork PR previews are skipped by default because their workflows do not have permission to publish or comment.

## Repository contents

| Path | Purpose |
| --- | --- |
| `docs/` | Documentation source and VitePress project |
| `docs/.vitepress/config.mts` | Site title, sidebar, navigation, and base path |
| `.github/workflows/deploy-docs.yml` | This repository's deployment trigger and settings |
| `.github/workflows/reusable-docs-pages.yml` | Reusable build, publish, PR-comment, and cleanup workflow |

Continue to [Consumers](consumers/) for setup instructions.
