<template>
  <div class="status-bar">
    <div class="status-bar-left">
      <span class="build-info">{{ connectionInfo }}</span>
    </div>
    <div class="status-bar-right">
      <span v-if="queryInfo" class="query-info">{{ queryInfo }}</span>
      <button 
        class="status-icon-button" 
        :class="{ active: layoutStore.showResultPanel }"
        @click="layoutStore.toggleResultPanel"
        title="Toggle Result Panel"
      >
        <n-icon><GridOutline /></n-icon>
      </button>
      <button 
        class="status-icon-button" 
        :class="{ active: layoutStore.showChatPanel }"
        @click="layoutStore.toggleChatPanel"
        title="Toggle Chat Panel"
      >
        <n-icon><ChatboxOutline /></n-icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NIcon } from 'naive-ui'
import {
  GridOutline,
  ChatboxOutline
} from '@vicons/ionicons5'
import { useLayoutStore } from '@/stores/layout'
import { useResultStore } from '@/stores/result'

const layoutStore = useLayoutStore()
const resultStore = useResultStore()
const connectionInfo = ''   // 用于展示当前链接数据库及其版本信息

// 格式化执行时间
function formatExecutionTime(ms?: number): string {
  if (!ms) return ''
  const seconds = Math.floor(ms / 1000)
  const milliseconds = ms % 1000
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes > 0) {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
  }
  return `${remainingSeconds}.${milliseconds.toString().padStart(3, '0')}`
}

// 查询结果信息
const queryInfo = computed(() => {
  if (!resultStore.queryResult) return null
  const { rowCount, executionTime } = resultStore.queryResult
  const timeStr = executionTime ? formatExecutionTime(executionTime) : ''
  if (timeStr) {
    return `${rowCount} rows in ${timeStr}`
  }
  return `${rowCount} rows`
})
</script>

<style scoped>
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 16px;
  background-color: var(--status-bar-bg);
  height: 28px;
  font-size: 12px;
  flex-shrink: 0;
  /* 明确的顶部分隔线 */
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -1px 4px var(--shadow-color);
  position: relative;
  z-index: 10;
}

.status-bar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.query-info {
  color: var(--text-color);
  font-family: monospace;
  font-size: 12px;
}

.status-bar-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-icon-button {
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--text-color-secondary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.status-icon-button:hover {
  background-color: var(--hover-color);
  color: var(--text-color);
}

.status-icon-button.active {
  color: var(--primary-color);
}

.build-info {
  color: var(--text-color-secondary);
  font-family: monospace;
  font-size: 12px;
}
</style>
