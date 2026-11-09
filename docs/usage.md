# Usage

This guide covers adding an initial documentation site to a repository and
configuring GitHub Actions to publish it.

## Add the initial docs files

Create a `docs/` directory in the application repository. A minimal VitePress
site needs a package manifest, a config file, and an index page:

```text
your-repository/
├── .github/
│   └── workflows/
│       ├── docs-pr.yml
│       └── docs-master.yml
└── docs/
    ├── .vitepress/
    │   └── config.mts
    ├── index.md
    ├── package.json
    └── package-lock.json
```

Copy the `docs/` project and workflow examples from this repository, then edit
the title, description, sidebar, and navigation in
`docs/.vitepress/config.mts`. Add Markdown files under `docs/` and link to them
from the sidebar. For example, `docs/guides/install.md` is linked as
`/guides/install`.

The package files belong inside `docs/`. Installing the docs tooling with
`npm ci --prefix docs` does not add Node.js files or dependencies to the
application root.

## Configure repository permissions

In the consuming repository, open **Settings → Actions → General → Workflow
permissions** and allow the `GITHUB_TOKEN` to have read and write permissions.
The caller workflows still declare the permissions each job needs:

| Permission | Access | Used for |
| --- | --- | --- |
| `contents` | `write` | Push the generated site to the Pages branch. |
| `pull-requests` | `write` | Comment on PRs with preview links. |
| `contents` | `read` | Check out source or validate a commit without publishing. |

The PR example skips fork previews. Keep that guard; do not run untrusted fork
code with a token that can write to the repository.

## Set up GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the publishing branch, normally `gh-pages`, and the `/(root)` folder.
4. Save the settings.

The first successful workflow publish creates the publishing branch. Set the
`pages_url` input to the canonical site URL. For a project site, include the
repository path, for example `https://OWNER.github.io/REPOSITORY/`. For a user
or organization site, use its root Pages URL.

## Call the reusable workflow

The caller workflow chooses when to build and provides project-specific values.
These examples call the reusable workflow from this repository. Replace
`OWNER` and `REPOSITORY` with the Pages owner and repository name. Pin reusable
workflows to a reviewed commit SHA instead of `@master` when you need a
controlled version.

### Pull request validation and preview

Create `.github/workflows/docs-pr.yml`:

```yaml
name: Validate and deploy pull request documentation

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read

jobs:
  validate-commit-message:
    permissions:
      contents: read
    uses: ssongin/gha-commit/.github/workflows/validate-commit-message.yml@master

  publish-docs:
    needs: validate-commit-message
    if: github.event.pull_request.head.repo.full_name == github.repository
    permissions:
      contents: write
      pull-requests: write
    uses: ssongin/gha-docs/.github/workflows/publish-docs.yml@master
    with:
      pages_url: https://OWNER.github.io/REPOSITORY/
```

Same-repository PR previews are published to `/pr-N/`. The workflow comments
with the preview link. Closing the PR removes its preview; other closed PR
previews are also reconciled during publishing.

### Publish the main site and remove closed previews

Create `.github/workflows/docs-master.yml`:

```yaml
name: Deploy documentation

on:
  push:
    branches: [master]
  pull_request:
    types: [closed]

permissions:
  contents: write
  pull-requests: write

jobs:
  publish-docs:
    if: github.event_name != 'pull_request' || github.event.pull_request.head.repo.full_name == github.repository
    permissions:
      contents: write
      pull-requests: write
    uses: ssongin/gha-docs/.github/workflows/publish-docs.yml@master
    with:
      pages_url: https://OWNER.github.io/REPOSITORY/
```

A push to `master` updates the site root. The closed-PR event removes a preview.
See [Versioning](versioning.md) to configure tagged releases and the version
selector.

## Reusable publishing workflow inputs and outputs

The `publish-docs.yml` workflow accepts these `workflow_call` inputs:

| Input | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `pages_url` | string | Yes | — | Canonical GitHub Pages URL, including any project-site path. |
| `docs_dir` | string | No | `docs` | Documentation source directory. |
| `dist_dir` | string | No | `docs/.vitepress/dist` | Directory containing the built static site. |
| `install_command` | string | No | `npm ci --prefix "$DOCS_DIR"` | Dependency install command. Set to an empty string to skip. |
| `build_command` | string | No | `npm --prefix "$DOCS_DIR" run docs:build` | Static-site build command. |
| `node_version` | string | No | `22` | Node.js version used by the build. |
| `pages_branch` | string | No | `gh-pages` | Branch where the combined site and previews are published. |
| `deployment_path` | string | No | Empty | Optional destination such as `versions/v1.2.3`. |

`publish-docs.yml` does not declare reusable-workflow outputs. It publishes the
files and PR comments as side effects. The separate `bump-version-tag.yml`
workflow provides a `tag` output when it creates a tag; see
[Versioning](versioning.md).

For local development and builds, see [Local run](local-run.md).
