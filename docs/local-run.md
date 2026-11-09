# Local run

Use the local VitePress server to preview Markdown and theme changes. A
production build generates static files for GitHub Pages.

## Requirements

- Node.js 22 or later
- npm, included with Node.js

Check the installed versions:

```bash
node --version
npm --version
```

## Install documentation dependencies

From the repository root:

```bash
npm ci --prefix docs
```

This installs VitePress under `docs/`; it does not add a package manifest or
dependencies to the application root.

## Run the development server

```bash
npm --prefix docs run docs:dev
```

Open the local URL printed by VitePress, usually `http://localhost:5173/`. The
server reloads when you change Markdown or VitePress configuration.

To display the version selector locally, set `DOCS_PAGES_URL` to the canonical
URL of a published site before starting VitePress. The selector loads
`versions.json` from that site, and choosing a version navigates to its
published URL:

```powershell
$env:DOCS_PAGES_URL = 'https://OWNER.github.io/REPOSITORY/'
npm --prefix docs run docs:dev
```

```bash
DOCS_PAGES_URL=https://OWNER.github.io/REPOSITORY/ npm --prefix docs run docs:dev
```

Replace `OWNER` and `REPOSITORY` with the GitHub Pages owner and repository.

## Build and preview the static site

Build the docs:

```bash
npm --prefix docs run docs:build
```

The generated site is written to `docs/.vitepress/dist/`. Set `DOCS_PAGES_URL`
as above if the build should include the version selector. To preview the
generated files:

```bash
npm --prefix docs run docs:preview
```

Build output and VitePress cache files are ignored by Git.
