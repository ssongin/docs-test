# How to add docs to your project

The docs site is a small, independent VitePress project. It can sit alongside a Java, Go, or other non-Node application without changing the project's build system.

## Copy the docs project

Copy the `docs/` directory from gh-docs into your repository. It includes the VitePress config and theme, Markdown pages, and its own npm manifest and lockfile:

```text
your-project/
  src/                         # Your application, unchanged
  docs/
    package.json
    package-lock.json
    index.md
    .vitepress/
      config.mts
      theme/
```

Replace the example pages with your project documentation. Keep `package.json` and `package-lock.json` in `docs/`; commands such as `npm ci --prefix docs` install the documentation tools without adding a manifest to the repository root.

Edit `docs/.vitepress/config.mts` to set the site title, description, sidebar, and navigation. The sidebar links to each page using its path under `docs/` without the `.md` extension.

## Write a page

Create a Markdown file, for example `docs/guides/deployment.md`:

````md
# Deploy the application

Describe the goal and assumptions.

## Prerequisites

- Access to the deployment environment
- The application has passed its tests

## Deploy to staging

```bash
./deploy.sh --environment staging
```

> **Warning**
>
> Call out steps that can overwrite data or affect production.

For local docs development, see [Run docs locally](./run-locally.md).
````

Use one `#` title per page and `##` headings for sections. Add a language after the opening code fence (such as `bash`, `java`, `go`, `yaml`, or `json`) for syntax highlighting. Use relative Markdown links for other pages.

## Add the page to navigation

Add a sidebar entry in `docs/.vitepress/config.mts`:

```ts
{
  text: 'Guides',
  items: [
    { text: 'Deployment', link: '/guides/deployment' }
  ]
}
```

The link `/guides/deployment` corresponds to `docs/guides/deployment.md`. For grouped pages, nest more entries under an item. Put images or other static files in `docs/public/` and reference an image as `/diagram.png`.

## Install docs dependencies

Run this from the repository root:

```bash
npm ci --prefix docs
```

The docs-only lockfile keeps the documentation tool versions reproducible. It does not install or modify your application's dependencies.

## Choose a workflow reuse approach

- **Copy the reusable workflow** into your repository if you want it to work independently.
- **Call the reusable workflow** from the gh-docs repository if you want centralized fixes and updates. GitHub must be able to access the workflow repository; pin the call to a reviewed commit SHA for stronger supply-chain control.

The next guide shows both the caller workflow setup and how publishing and cleanup work.
