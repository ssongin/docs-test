# Description and purpose

**gh-docs** is a way to publish a repository's Markdown documentation as a website. It combines:

- [VitePress](https://vitepress.dev/) to turn Markdown into a static website.
- GitHub Actions to build and publish that website to GitHub Pages.
- Pull request previews and tagged documentation versions.

Keep the docs and the application in one repository, so documentation changes can be reviewed with code changes. The VitePress project and its npm dependencies stay under `docs/`; Java, Go, and other applications do not need a `package.json` in their root.

The publishing workflow updates a `gh-pages` branch. The current docs are served from the site root, release versions from paths such as `/versions/v1.2.3/`, and active pull request previews from paths such as `/pr-42/`. A navigation selector lets readers switch between the versions that are currently published.

GitHub Pages serves static files, so the published site does not need a running application server. See [Usage](usage.md) to add docs and configure publishing, [Versioning](versioning.md) for the selector and release paths, or [Local run](local-run.md) to preview and build the site on your machine.
