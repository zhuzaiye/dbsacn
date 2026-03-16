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
import { useDatabaseStore } from '@/stores/database'
import { useResultStore } from '@/stores/result'
import { useLayoutStore } from '@/stores/layout'
import { databaseService } from '@/services/database'

const editorStore = useEditorStore()
const databaseStore = useDatabaseStore()
const resultStore = useResultStore()
const layoutStore = useLayoutStore()

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

async function handleCopy() {
  const content = editorStore.activeTab?.content || ''
  if (!content) return
  try {
    await navigator.clipboard.writeText(content)
    resultStore.addLog('Copied SQL to clipboard')
  } catch {
    resultStore.addLog('Failed to copy SQL to clipboard')
  }
}

function handleFormat() {
  const tab = editorStore.activeTab
  if (!tab) return
  const formatted = tab.content
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim()
  editorStore.updateTabContent(tab.id, formatted)
  resultStore.addLog('Formatted SQL in editor')
}

function handleSave() {
  if (editorStore.activeTab) {
    editorStore.saveTab(editorStore.activeTab.id)
  }
}

async function handleRun() {
  await runQuery(false)
}

async function handleForceRun() {
  await runQuery(true)
}

async function runQuery(force: boolean) {
  const connection = databaseStore.activeConnection
  const sql = editorStore.activeTab?.content?.trim() || ''
  if (!connection) {
    resultStore.addLog('No active connection. Please create and select a connection first.')
    layoutStore.showResultPanel = true
    layoutStore.setActiveResultTab('logs')
    return
  }
  if (!sql) {
    resultStore.addLog('No SQL to execute.')
    return
  }

  try {
    if (!connection.connected || force) {
      await databaseService.connect(connection)
      databaseStore.setConnectionStatus(connection.id, true)
      resultStore.addLog(`Connected: ${connection.name}`)
    }

    const result = await databaseService.executeQuery(connection.id, sql)
    resultStore.setQueryResult({
      columns: result.columns,
      rows: result.rows,
      rowCount: result.rowCount,
      executionTime: result.executionTime
    })
    editorStore.addToHistory(sql, true, result.executionTime)
    layoutStore.showResultPanel = true
    layoutStore.setActiveResultTab('data')
    resultStore.addLog(`Query ok: ${result.rowCount} rows, ${result.executionTime ?? 0} ms`)

    const schema = await databaseService.fetchSchema(connection.id)
    databaseStore.setDatabaseTree(schema)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    editorStore.addToHistory(sql, false, undefined, message)
    resultStore.addLog(`Query failed: ${message}`)
    layoutStore.showResultPanel = true
    layoutStore.setActiveResultTab('logs')
    databaseStore.setConnectionStatus(connection.id, false)
  }
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
