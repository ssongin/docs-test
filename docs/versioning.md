# Versioning

The site can publish current documentation, tagged releases, and active
same-repository pull request previews. A version selector in the navigation
lets readers switch between them.

## How the selector works

The VitePress theme includes a selector component in
`docs/.vitepress/theme/VersionSelector.vue`, registered in
`docs/.vitepress/theme/index.ts`. It fetches `versions.json` from the published
site and uses its entries to populate the menu.

The reusable publishing workflow regenerates `versions.json` from the
directories on the Pages branch after each publish:

| Published directory | Selector entry |
| --- | --- |
| Site root | Latest (master) |
| `versions/<tag>/` | The tag, for example `v1.2.3` |
| `pr-<number>/` | Active PR, for example `PR #42` |

The list is generated dynamically, not hard-coded. Closing a PR removes its
preview; later publishes also remove stale preview directories for PRs that are
no longer open.

## Add a tagged documentation version

To publish a version, build the docs from the commit or tag you want to retain
and call `publish-docs.yml` with a `deployment_path` under `versions/`:

```yaml
with:
  pages_url: https://OWNER.github.io/REPOSITORY/
  deployment_path: versions/v1.2.3
```

Use the same `docs_dir`, `dist_dir`, `install_command`, and `build_command`
settings as the main-site publish if your project does not use the defaults.
The path must use the `versions/vMAJOR.MINOR.PATCH` format for the selector to
recognize it.

The publishing workflow replaces files under that version's directory, but
main-site publishing preserves the `versions/` directory. Thus, deploying a
new version does not replace previous tagged sites.

## Automate semantic version tags

The `gha-commit` reusable tagger can create a semantic version tag from a
Conventional Commit on `master`. It provides `contents: write` and publishes
the resulting documentation under the new version path:

```yaml
on:
  push:
    branches: [master]

permissions:
  contents: write
  pull-requests: write

jobs:
  bump-version-tag:
    if: github.event_name == 'push' && github.ref == 'refs/heads/master'
    permissions:
      contents: write
    uses: ssongin/gha-commit/.github/workflows/bump-version-tag.yml@master

  publish-tagged-docs:
    needs: bump-version-tag
    if: needs.bump-version-tag.outputs.tag != ''
    permissions:
      contents: write
      pull-requests: write
    uses: ssongin/gha-docs/.github/workflows/publish-docs.yml@master
    with:
      pages_url: https://OWNER.github.io/REPOSITORY/
      deployment_path: versions/${{ needs.bump-version-tag.outputs.tag }}
```

The tagger's inputs and output are:

| Name | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `commit_message` | string | No | Automatically extracted | Commit message used to select the version increment. |
| `tag_prefix` | string | No | `v` | Prefix applied to created tags. |
| `initial_version` | string | No | `0.0.0` | Starting version when no matching tag exists. |
| `tag` output | string | — | Empty when no tag is created | The new tag, used to publish the matching docs. |

The tagger selects a version increment from the commit message. `feat` creates
a minor version, `fix` and other patch-level types create a patch, and breaking
changes create a major version. `docs` and `test` commits do not create tags
unless marked as breaking. See the
[`gha-commit` tagging guide](https://github.com/ssongin/gha-commit/blob/master/docs/tagging.md)
for supported prefixes, settings, and examples.

If publishing versions from pushed tags instead, add the `v*` tag trigger and
pass the tag name as `deployment_path`:

```yaml
on:
  push:
    tags: ['v*']

jobs:
  publish-tagged-docs:
    uses: ssongin/gha-docs/.github/workflows/publish-docs.yml@master
    with:
      pages_url: https://OWNER.github.io/REPOSITORY/
      deployment_path: versions/${{ github.ref_name }}
```

## Use the selector in another site

When copying the theme to a separate VitePress site, include
`VersionSelector.vue` and register it in the theme layout. Define the manifest
URL at build time using the canonical Pages URL (the publisher supplies
`DOCS_PAGES_URL`):

```ts
const pagesUrl = process.env.DOCS_PAGES_URL

export default defineConfig({
  vite: {
    define: {
      __DOCS_VERSION_MANIFEST_URL__: JSON.stringify(
        pagesUrl
          ? new URL(
            'versions.json',
            `${pagesUrl.replace(/\/+$/, '')}/`
          ).toString()
          : ''
      )
    }
  }
})
```

The selector needs the manifest URL to be set. The reusable publisher sets
`DOCS_PAGES_URL` automatically; for a manual build, set it to the published
site's canonical URL. See [Local run](local-run.md) for examples.
