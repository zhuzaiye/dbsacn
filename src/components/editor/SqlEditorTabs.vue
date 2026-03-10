<template>
  <div class="sql-editor-tabs">
    <div class="tabs-container">
      <n-tabs v-model:value="activeTabId" type="card" closable @close="handleTabClose" @add="handleTabAdd"
        @update:value="handleTabChange">
        <n-tab-pane v-for="tab in editorStore.tabs" :key="tab.id" :name="tab.id"
          :tab="tab.name + (tab.isModified ? ' *' : '')">
        </n-tab-pane>
        <template #prefix>
          <n-button quaternary size="small" @click="handleNewTab">
            <template #icon>
              <n-icon>
                <AddOutline />
              </n-icon>
            </template>
          </n-button>
        </template>
        <template #suffix>
          <div class="toolbar">
            <n-button quaternary size="small" @click="handleCopy" title="Copy">
              <template #icon>
                <n-icon>
                  <CopyOutline />
                </n-icon>
              </template>
            </n-button>
            <n-button quaternary size="small" @click="handleFormat" title="Format">
              <template #icon>
                <n-icon>
                  <CodeWorkingOutline />
                </n-icon>
              </template>
            </n-button>
            <n-button quaternary size="small" :disabled="!canSave" @click="handleSave" title="Save">
              <template #icon>
                <n-icon>
                  <SaveOutline />
                </n-icon>
              </template>
            </n-button>
            <n-button type="primary" size="small" @click="handleRun" title="Run">
              <template #icon>
                <n-icon>
                  <PlayOutline />
                </n-icon>
              </template>
            </n-button>
            <n-button size="small" @click="handleForceRun" title="Force run">
              <template #icon>
                <n-icon>
                  <FlashOutline />
                </n-icon>
              </template>
            </n-button>
          </div>
        </template>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NTabs, NTabPane, NButton, NIcon } from 'naive-ui'
import {
  AddOutline,
  CopyOutline,
  CodeWorkingOutline,
  SaveOutline,
  PlayOutline,
  FlashOutline
} from '@vicons/ionicons5'
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()

const activeTabId = computed({
  get: () => editorStore.activeTabId || '',
  set: (value: string) => {
    editorStore.setActiveTab(value || null)
  }
})

const canSave = computed(() => {
  return editorStore.activeTab?.isModified || false
})

function handleTabClose(name: string) {
  editorStore.closeTab(name)
}

function handleTabAdd() {
  editorStore.createTab()
}

function handleTabChange(name: string) {
  editorStore.setActiveTab(name || '')
}

function handleNewTab() {
  editorStore.createTab()
}

function handleCopy() {
  // TODO: Copy SQL to clipboard
  console.log('Copy clicked')
}

function handleFormat() {
  // TODO: Format SQL
  console.log('Format clicked')
}

function handleSave() {
  if (editorStore.activeTab) {
    editorStore.saveTab(editorStore.activeTab.id)
  }
}

function handleRun() {
  // TODO: Execute SQL query
  console.log('Run clicked')
}

function handleForceRun() {
  // TODO: Force execute SQL query
  console.log('Force run clicked')
}
</script>

<style scoped>
.sql-editor-tabs {
  border-bottom: 1px solid var(--divider-color);
  background-color: var(--panel-bg);
  flex-shrink: 0;
}

.tabs-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.tabs-container :deep(.n-tabs-nav) {
  flex: 1;
  display: flex;
  align-items: center;
}

.tabs-container :deep(.n-tabs-tab) {
  padding: 8px 12px;
}

.toolbar {
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 4px;
  margin-left: auto;
}

.toolbar .n-button {
  height: 28px;
  padding: 0 8px;
  font-size: 12px;
}
</style>
