import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import VersionSelector from './VersionSelector.vue'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'nav-bar-content-after': () => h(VersionSelector),
    'nav-screen-content-after': () => h(VersionSelector)
  })
}
