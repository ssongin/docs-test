import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'gh-docs',
  description: 'Reusable static documentation and GitHub Pages publishing for any repository.',
  lang: 'en-US',
  base: process.env.DOCS_BASE || '/',
  vite: {
    define: {
      __DOCS_VERSION_MANIFEST_URL__: JSON.stringify(
        process.env.DOCS_PAGES_URL
          ? new URL(
            'versions.json',
            `${process.env.DOCS_PAGES_URL.replace(/\/+$/, '')}/`
          ).toString()
          : ''
      )
    }
  },
  srcExclude: ['README.md', '_sidebar.md'],
  themeConfig: {
    siteTitle: 'gh-docs',
    nav: [
      { text: 'Usage', link: '/usage' },
      { text: 'Versioning', link: '/versioning' }
    ],
    sidebar: [
      {
        text: 'gh-docs',
        items: [
          { text: 'Description', link: '/description' },
          { text: 'Usage', link: '/usage' },
          { text: 'Versioning', link: '/versioning' },
          { text: 'Local run', link: '/local-run' }
        ]
      }
    ]
  }
})
