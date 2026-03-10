<template>
  <div class="result-panel">
    <div class="result-tabs">
      <nav class="result-nav">
        <button
          :class="['result-nav-button', { active: layoutStore.activeResultTab === 'data' }]"
          @click="handleTabChange('data')"
        >
          Data
        </button>
        <button
          :class="['result-nav-button', { active: layoutStore.activeResultTab === 'chart' }]"
          @click="handleTabChange('chart')"
        >
          Chart
        </button>
        <button
          :class="['result-nav-button', { active: layoutStore.activeResultTab === 'logs' }]"
          @click="handleTabChange('logs')"
        >
          Logs
        </button>
      </nav>
    </div>
    <div class="result-content">
      <ResultData v-if="layoutStore.activeResultTab === 'data'" />
      <ResultChart v-else-if="layoutStore.activeResultTab === 'chart'" />
      <ResultLogs v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import ResultData from './ResultData.vue'
import ResultChart from './ResultChart.vue'
import ResultLogs from './ResultLogs.vue'

const layoutStore = useLayoutStore()

function handleTabChange(value: 'data' | 'chart' | 'logs') {
  layoutStore.setActiveResultTab(value)
}
</script>

<style scoped>
.result-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--panel-bg);
  border-top: 1px solid var(--divider-color);
}

.result-tabs {
  border-bottom: 1px solid var(--divider-color);
  background-color: var(--panel-bg);
  padding: 0;
}

.result-nav {
  display: flex;
  align-items: center;
  background-color: var(--hover-color);
  border-radius: 6px;
  padding: 2px;
  gap: 2px;
  margin: 8px;
}

.result-nav-button {
  background: transparent;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  color: var(--text-color-secondary);
  font-size: 13px;
  border-radius: 4px;
  transition: all 0.2s;
  font-weight: 500;
}

.result-nav-button:hover {
  color: var(--text-color);
  background-color: var(--hover-color-strong);
}

.result-nav-button.active {
  background-color: var(--primary-color);
  color: #fff;
}

.result-content {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--content-bg);
}

.result-content > * {
  height: 100%;
  width: 100%;
  min-height: 0;
}
</style>
