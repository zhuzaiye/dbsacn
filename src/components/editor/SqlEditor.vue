<template>
  <div ref="editorContainer" class="sql-editor"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import * as monaco from 'monaco-editor'
import { useEditorStore } from '@/stores/editor'
import { useLayoutStore } from '@/stores/layout'

const editorStore = useEditorStore()
const layoutStore = useLayoutStore()
const editorContainer = ref<HTMLDivElement>()
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null

// 根据全局主题计算 Monaco 主题
const monacoTheme = computed(() => {
  return layoutStore.theme === 'dark' ? 'vs-dark' : 'vs'
})

onMounted(() => {
  if (editorContainer.value) {
    editorInstance = monaco.editor.create(editorContainer.value, {
      value: editorStore.activeTab?.content || '',
      language: 'sql',
      theme: monacoTheme.value,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      wordWrap: 'on',
      formatOnPaste: true,
      formatOnType: true
    })

    // Update store when content changes
    editorInstance.onDidChangeModelContent(() => {
      if (editorInstance && editorStore.activeTab) {
        const content = editorInstance.getValue()
        editorStore.updateTabContent(editorStore.activeTab.id, content)
      }
    })
  }
})

onUnmounted(() => {
  if (editorInstance) {
    editorInstance.dispose()
  }
})

// 监听 tab 切换
watch(
  () => editorStore.activeTab,
  (newTab) => {
    if (editorInstance && newTab) {
      editorInstance.setValue(newTab.content)
    }
  },
  { immediate: true }
)

// 监听主题切换，更新 Monaco Editor 主题
watch(
  () => layoutStore.theme,
  (newTheme) => {
    if (editorInstance) {
      monaco.editor.setTheme(newTheme === 'dark' ? 'vs-dark' : 'vs')
    }
  }
)
</script>

<style scoped>
.sql-editor {
  flex: 1;
  width: 100%;
  min-height: 0;
  background-color: var(--content-bg);
  position: relative;
  overflow: hidden;
}
</style>
