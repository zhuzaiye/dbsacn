import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { QueryResult } from '@/types'

export const useResultStore = defineStore('result', () => {
  // State
  const queryResult = ref<QueryResult | null>(null)
  const chartData = ref<any>(null)
  const logs = ref<string[]>([])

  // Actions
  function setQueryResult(result: QueryResult) {
    queryResult.value = result
  }

  function setChartData(data: any) {
    chartData.value = data
  }

  function addLog(message: string) {
    const timestamp = new Date().toISOString()
    logs.value.push(`[${timestamp}] ${message}`)
    // Keep only last 1000 log entries
    if (logs.value.length > 1000) {
      logs.value = logs.value.slice(-1000)
    }
  }

  function clearLogs() {
    logs.value = []
  }

  function clearResult() {
    queryResult.value = null
    chartData.value = null
  }

  return {
    queryResult,
    chartData,
    logs,
    setQueryResult,
    setChartData,
    addLog,
    clearLogs,
    clearResult
  }
})
