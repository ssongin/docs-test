---
layout: home

hero:
  name: gh-docs
  text: Documentation for any repository
  tagline: Build static docs, preview pull requests, and publish to GitHub Pages—without adding Node.js files to your project root.
  actions:
    - theme: brand
      text: Description
      link: /description
    - theme: alt
      text: Consumers
      link: /consumers/

features:
  - title: Keep project roots clean
    details: VitePress and its lockfile live under docs/, so Java, Go, and other projects do not need a root package.json.
  - title: Preview every active PR
    details: Same-repository pull requests publish to their own /pr-N/ URL and receive a preview comment.
  - title: Reuse the publishing workflow
    details: One workflow builds the site, updates GitHub Pages, and removes closed PR previews.
---

**gh-docs** is a reusable documentation site and GitHub Actions workflow for publishing static documentation to GitHub Pages. The docs project is isolated in `docs/`, making it suitable for Java, Go, and other non-Node repositories.

## Documentation

See the [description](description.md) for an overview, or go to [Consumers](consumers/) for instructions on adding gh-docs to a project, setting up publishing, and running the docs locally.
