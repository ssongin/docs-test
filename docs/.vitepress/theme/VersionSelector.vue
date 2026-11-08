<script setup lang="ts">
import { onMounted, ref } from 'vue'

declare const __DOCS_VERSION_MANIFEST_URL__: string

interface DocumentationVersion {
  label: string
  path: string
}

function isDocumentationVersion(value: unknown): value is DocumentationVersion {
  return value !== null &&
    typeof value === 'object' &&
    'label' in value &&
    typeof value.label === 'string' &&
    'path' in value &&
    typeof value.path === 'string'
}

const versions = ref<DocumentationVersion[]>([])
const selectedPath = ref('')
const currentDocumentPath = ref('')
const error = ref('')

onMounted(async () => {
  if (!__DOCS_VERSION_MANIFEST_URL__) return

  try {
    const response = await fetch(__DOCS_VERSION_MANIFEST_URL__, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error(`Version manifest request failed with status ${response.status}`)
    }

    const payload: unknown = await response.json()
    if (!Array.isArray(payload) || !payload.every(isDocumentationVersion)) {
      throw new Error('Version manifest has an invalid format')
    }

    versions.value = payload
    const pagesUrl = new URL(__DOCS_VERSION_MANIFEST_URL__)
    const currentPath = window.location.pathname
    const currentVersion = versions.value
      .filter(version => {
        const versionUrl = new URL(version.path || './', pagesUrl)
        return currentPath.startsWith(versionUrl.pathname)
      })
      .sort((left, right) => right.path.length - left.path.length)[0]
    if (currentVersion) {
      const currentVersionUrl = new URL(currentVersion.path || './', pagesUrl)
      currentDocumentPath.value = currentPath.slice(currentVersionUrl.pathname.length)
      selectedPath.value = currentVersion.path || '.'
    } else {
      selectedPath.value = '.'
    }
  } catch (cause) {
    error.value = 'Versions unavailable'
    console.error('Unable to load documentation versions', cause)
  }
})

function navigateToVersion() {
  if (!selectedPath.value || !__DOCS_VERSION_MANIFEST_URL__) return
  const destination = new URL(selectedPath.value, __DOCS_VERSION_MANIFEST_URL__)
  if (currentDocumentPath.value) {
    destination.pathname = `${destination.pathname.replace(/\/?$/, '/')}${currentDocumentPath.value}`
  }
  destination.search = window.location.search
  destination.hash = window.location.hash
  window.location.assign(destination.toString())
}
</script>

<template>
  <label v-if="__DOCS_VERSION_MANIFEST_URL__" class="version-selector">
    <span class="sr-only">Documentation version</span>
    <select
      v-model="selectedPath"
      aria-label="Select documentation version"
      :disabled="versions.length === 0"
      @change="navigateToVersion"
    >
      <option v-if="error" disabled value="">{{ error }}</option>
      <option v-for="version in versions" :key="version.path || 'latest'" :value="version.path || '.'">
        {{ version.label }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.version-selector {
  display: inline-flex;
  align-items: center;
  margin-left: 12px;
}

select {
  max-width: 180px;
  padding: 6px 26px 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}
</style>
