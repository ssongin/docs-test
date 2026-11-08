# GitHub Actions: setup and behavior

The deployment uses two workflows:

1. A small **caller workflow** listens for repository events and passes project-specific settings.
2. The reusable `.github/workflows/publish-docs.yml` builds the static site, updates the Pages branch, comments on PRs, and removes closed PR previews.

## Add the caller workflow

Create `.github/workflows/deploy-docs.yml`:

```yaml
name: Deploy documentation

on:
  push:
    branches: [master]
  pull_request:
    types: [opened, synchronize, reopened, closed]

permissions:
  contents: write
  pull-requests: write

jobs:
  deploy:
    if: github.event_name != 'pull_request' || github.event.pull_request.head.repo.full_name == github.repository
    uses: OWNER/gh-docs/.github/workflows/publish-docs.yml@master
    with:
      pages_url: https://OWNER.github.io/REPOSITORY/
      docs_dir: docs
      dist_dir: docs/.vitepress/dist
      install_command: npm ci --prefix docs
      build_command: npm --prefix docs run docs:build
      node_version: '22'
      pages_branch: gh-pages
```

Replace `OWNER` with the account that owns gh-docs, and `REPOSITORY` with the application repository name. To use a copied workflow instead, change `uses` to:

```yaml
uses: ./.github/workflows/publish-docs.yml
```

Using `@master` tracks changes to the reusable workflow. For controlled upgrades, use a full commit SHA instead.

## Set up GitHub Pages

In the consuming repository, go to **Settings → Pages** and choose **Deploy from a branch**, branch `gh-pages`, folder `/ (root)`. Allow GitHub Actions to write to the repository. The caller permissions are needed to push generated files (`contents: write`) and post/update PR comments (`pull-requests: write`).

## What happens on each event

| Event | Workflow action |
| --- | --- |
| Push to `master` | Build and publish the main site at the Pages root; this repository also invokes the `gha-commit` version-bump workflow and publishes a new tag under `/versions/<tag>/` |
| Push a `v*` tag | Publish that tagged documentation under `/versions/<tag>/` |
| PR opened or reopened | Build `/pr-N/`, publish it, and comment with the URL |
| New PR commit | Rebuild that PR's preview and update the existing comment |
| PR merged or closed | Remove `/pr-N/` and mark the preview comment as removed |

The reusable workflow serializes publishing per repository to avoid simultaneous jobs overwriting each other's changes. A main-site publish preserves existing `pr-*` and `versions/` folders; each PR or tagged-version publish changes only its own folder. Every publish also removes `pr-*` folders for PRs that are no longer open, so a canceled close-event run cannot leave a stale preview published. It then regenerates `versions.json` from the folders still present on the Pages branch. The version selector uses this manifest to offer the latest docs, published tags, and active same-repository PR previews.

The version-bump workflow uses the commit message to select a semantic version increment. It does not create a tag for `docs` or `test` commits, and requires a supported Conventional Commit header for other commit types. The tag is deployed in the same workflow run because a tag push made with `GITHUB_TOKEN` does not trigger a separate `push` workflow.

## Preview URL and base path

For PR 42, the workflow builds with the base path for the Pages site plus `/pr-42/` and copies the generated static files into `gh-pages/pr-42/`. VitePress uses `DOCS_BASE` from the workflow, so asset URLs continue to work under the preview subdirectory.

The `pages_url` input must be the canonical Pages URL, including the repository name for project sites, for example `https://OWNER.github.io/REPOSITORY/`.

## Fork pull requests

Fork PR previews are skipped by default. GitHub does not provide the write token required to publish pages or comment on a PR from a fork. Keep the condition in the example; do not run untrusted fork code with a privileged publishing token.

## Git commit reports an unknown author

The publishing workflow sets the Git author and committer identity explicitly in the commit step. If you maintain a copy of the workflow, keep `GIT_AUTHOR_NAME`, `GIT_AUTHOR_EMAIL`, `GIT_COMMITTER_NAME`, and `GIT_COMMITTER_EMAIL` set for the step that runs `git commit`.

## Publishing reports that it is not a Git repository

The production build is synced into the root of the Pages checkout. The `rsync` command must exclude `/.git/`; otherwise `--delete` removes the repository metadata before Git can stage the published files.

## Use another static site generator

The reusable workflow accepts custom `install_command`, `build_command`, `dist_dir`, and `node_version` values. Point them to your generator's install/build commands and the complete generated static site. Configure that generator to honor the `DOCS_BASE` environment variable for project and PR paths.

For local previews, see [Run docs locally](run-locally.md).
