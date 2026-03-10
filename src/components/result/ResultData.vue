<template>
  <div class="result-data">
    <n-data-table
      v-if="resultStore.queryResult"
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :bordered="false"
      virtual-scroll
      flex-height
      style="height: 100%"
    />
    <n-empty v-else description="No query results yet">
      <template #extra>
        <n-text depth="3">Run a query to see results here</n-text>
      </template>
    </n-empty>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NDataTable, NEmpty, NText } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { useResultStore } from '@/stores/result'

const resultStore = useResultStore()

const columns = computed<DataTableColumns<any>>(() => {
  if (!resultStore.queryResult) return []
  return resultStore.queryResult.columns.map((col: string) => ({
    title: col,
    key: col
  }))
})

const tableData = computed(() => {
  if (!resultStore.queryResult) return []
  return resultStore.queryResult.rows.map((row: any[], index: number) => {
    const obj: any = { key: index }
    resultStore.queryResult!.columns.forEach((col: string, i: number) => {
      obj[col] = row[i]
    })
    return obj
  })
})

const pagination = {
  pageSize: 50,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100]
}
</script>

<style scoped>
.result-data {
  padding: 16px;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: var(--content-bg);
  display: flex;
  flex-direction: column;
}

.result-data :deep(.n-data-table) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.result-data :deep(.n-data-table-base) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.result-data :deep(.n-data-table-base-table) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.result-data :deep(.n-data-table-base-table-body) {
  flex: 1;
  overflow: auto;
}
</style>
