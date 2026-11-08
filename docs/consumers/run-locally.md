# How to run docs locally

The docs site uses Node.js for development and static-site generation. You do not need to use Node.js to build or run the application itself.

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

This uses `docs/package.json` and `docs/package-lock.json` and installs the tools under `docs/node_modules/`. It does not create a `package.json` in the project root.

## Start the live preview

```bash
npm --prefix docs run docs:dev
```

Open the local URL printed by VitePress, usually `http://localhost:5173/`. The dev server reloads when you change Markdown or VitePress configuration.

## Build and preview the static output

Build the site as GitHub Actions does:

```bash
npm --prefix docs run docs:build
```

The generated site is written to `docs/.vitepress/dist/`. Preview the generated files locally with:

```bash
npm --prefix docs run docs:preview
```

The build output and VitePress cache are ignored by Git.
