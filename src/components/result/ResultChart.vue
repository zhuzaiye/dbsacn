<template>
  <div class="result-chart">
    <n-empty description="Chart visualization coming soon">
      <template #extra>
        <n-text depth="3">Chart feature will be available here</n-text>
      </template>
    </n-empty>
  </div>
</template>

<script setup lang="ts">
import { NEmpty, NText } from 'naive-ui'
</script>

<style scoped>
.result-chart {
  padding: 16px;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--n-color);
}
</style>
