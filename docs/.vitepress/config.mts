import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'gh-docs',
  description: 'Reusable static documentation and GitHub Pages publishing for any repository.',
  lang: 'en-US',
  base: process.env.DOCS_BASE || '/',
  srcExclude: ['README.md', '_sidebar.md'],
  themeConfig: {
    siteTitle: 'gh-docs',
    nav: [{ text: 'Consumers', link: '/consumers/' }],
    sidebar: [
      {
        text: 'gh-docs',
        items: [
          { text: 'Description', link: '/description' },
          {
            text: 'Consumers',
            link: '/consumers/',
            items: [
              { text: 'Add docs to your project', link: '/consumers/add-docs' },
              { text: 'GitHub Actions', link: '/consumers/github-actions' },
              { text: 'Run docs locally', link: '/consumers/run-locally' }
            ]
          }
        ]
      }
    ]
  }
})
