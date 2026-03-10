<template>
  <div class="sidebar-content">
    <!-- Sources View -->
    <div v-if="layoutStore.activeTopNav === 'sources'" class="sources-view">
      <div class="sources-header">
        <n-button type="primary" block @click="handleAddConnection">
          <template #icon>
            <n-icon><AddOutline /></n-icon>
          </template>
          Add Connection
        </n-button>
      </div>
      <n-list>
        <n-list-item
          v-for="conn in databaseStore.filteredConnections"
          :key="conn.id"
          :class="{ active: databaseStore.activeConnectionId === conn.id }"
          @click="handleSelectConnection(conn.id)"
        >
          <div class="connection-item">
            <div class="connection-info">
              <n-text strong>{{ conn.name }}</n-text>
              <n-text depth="3" style="font-size: 12px">
                {{ conn.type }} - {{ conn.database }}
              </n-text>
            </div>
            <n-tag
              :type="conn.connected ? 'success' : 'default'"
              size="small"
            >
              {{ conn.connected ? 'Connected' : 'Disconnected' }}
            </n-tag>
          </div>
        </n-list-item>
        <n-empty
          v-if="databaseStore.filteredConnections.length === 0"
          description="No connections"
        />
      </n-list>
    </div>

    <!-- Queries View -->
    <div v-else-if="layoutStore.activeTopNav === 'queries'" class="queries-view">
      <n-list>
        <n-list-item
          v-for="tab in editorStore.tabs"
          :key="tab.id"
          :class="{ active: editorStore.activeTabId === tab.id }"
          @click="editorStore.setActiveTab(tab.id)"
        >
          <div class="query-item">
            <n-text>{{ tab.name }}</n-text>
            <n-text v-if="tab.isModified" depth="3" style="font-size: 12px">
              Modified
            </n-text>
          </div>
        </n-list-item>
        <n-empty v-if="editorStore.tabs.length === 0" description="No queries" />
      </n-list>
    </div>

    <!-- History View -->
    <div v-else class="history-view">
      <n-list>
        <n-list-item
          v-for="item in editorStore.filteredHistory"
          :key="item.id"
          @click="handleSelectHistory(item)"
        >
          <div class="history-item">
            <n-text style="font-family: monospace; font-size: 12px">
              {{ truncateSql(item.sql) }}
            </n-text>
            <div class="history-meta">
              <n-text depth="3" style="font-size: 11px">
                {{ formatTime(item.executedAt) }}
              </n-text>
              <n-tag
                :type="item.success ? 'success' : 'error'"
                size="small"
              >
                {{ item.success ? 'Success' : 'Error' }}
              </n-tag>
            </div>
          </div>
        </n-list-item>
        <n-empty
          v-if="editorStore.filteredHistory.length === 0"
          description="No history"
        />
      </n-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  NButton,
  NIcon,
  NList,
  NListItem,
  NText,
  NTag,
  NEmpty
} from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import { useLayoutStore } from '@/stores/layout'
import { useDatabaseStore } from '@/stores/database'
import { useEditorStore } from '@/stores/editor'

const layoutStore = useLayoutStore()
const databaseStore = useDatabaseStore()
const editorStore = useEditorStore()

function handleAddConnection() {
  // TODO: Open connection dialog
  console.log('Add connection clicked')
}

function handleSelectConnection(id: string) {
  databaseStore.setActiveConnection(id)
}

function handleSelectHistory(item: any) {
  // Create a new tab with the SQL from history
  const tabId = editorStore.createTab(`Query ${new Date(item.executedAt).toLocaleTimeString()}`)
  editorStore.updateTabContent(tabId, item.sql)
}

function truncateSql(sql: string, maxLength = 50): string {
  if (sql.length <= maxLength) return sql
  return sql.substring(0, maxLength) + '...'
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleString()
}
</script>

<style scoped>
.sidebar-content {
  height: 100%;
  overflow: auto;
  padding: 16px;
}

.sources-header {
  margin-bottom: 16px;
}

.connection-item,
.query-item,
.history-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.connection-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.n-list-item {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 4px;
}

.n-list-item:hover {
  background-color: var(--n-colorHover);
}

.n-list-item.active {
  background-color: var(--n-colorPressed);
}
</style>
