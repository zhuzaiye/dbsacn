<template>
  <div class="result-logs">
    <div class="logs-header">
      <n-button quaternary size="small" @click="handleClear">
        Clear
      </n-button>
    </div>
    <div class="logs-content">
      <pre v-for="(log, index) in resultStore.logs" :key="index" class="log-line">
{{ log }}
      </pre>
      <div v-if="resultStore.logs.length === 0" class="empty-logs">
        <n-text depth="3">No logs yet</n-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NText } from 'naive-ui'
import { useResultStore } from '@/stores/result'

const resultStore = useResultStore()

function handleClear() {
  resultStore.clearLogs()
}
</script>

<style scoped>
.result-logs {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--content-bg);
}

.logs-header {
  padding: 8px 16px;
  border-bottom: 1px solid var(--divider-color);
  background-color: var(--panel-bg);
}

.logs-content {
  flex: 1;
  overflow: auto;
  padding: 8px 16px;
  font-family: monospace;
  font-size: 12px;
}

.log-line {
  margin: 2px 0;
  color: var(--text-color);
}

.empty-logs {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
