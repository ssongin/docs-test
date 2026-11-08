# Description

**gh-docs** is a reusable setup for writing and publishing repository documentation. It combines:

- [VitePress](https://vitepress.dev/) to turn Markdown files into static HTML.
- GitHub Actions to build and publish the site to GitHub Pages.
- Per-pull-request previews, with a link posted to each supported PR.
- Automatic cleanup of a preview when its PR is merged or closed.
- Tagged documentation versions alongside the latest `master` docs.

The documentation app and its npm manifest are kept under `docs/`. Repositories written in Java, Go, or other languages do not need a root `package.json`.

## Publishing model

The main branch site is published at the root of the Pages site. Each active same-repository PR gets a subdirectory such as `/pr-42/`. Closing a PR removes only its preview directory. Semantic version tags are published under `/versions/<tag>/`.

The version selector in the site navigation reads `versions.json`, which the publishing workflow regenerates from the directories currently published on the Pages branch. It lists the latest `master` docs, existing tagged versions, and active same-repository PR previews without maintaining a hard-coded list.

The pages are static output, so GitHub Pages does not run a Node.js server. Fork PR previews are skipped by default because their workflows do not have permission to publish or comment.

## Repository contents

| Path | Purpose |
| --- | --- |
| `docs/` | Documentation source and VitePress project |
| `docs/.vitepress/config.mts` | Site title, sidebar, navigation, and base path |
| `.github/workflows/deploy-docs.yml` | This repository's deployment trigger and settings |
| `.github/workflows/publish-docs.yml` | Reusable build, publish, PR-comment, and cleanup workflow |

Continue to [Consumers](consumers/) for setup instructions.
