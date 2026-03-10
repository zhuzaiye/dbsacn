import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EditorTab, QueryHistory } from '@/types/editor'

export const useEditorStore = defineStore('editor', () => {
  // State
  const tabs = ref<EditorTab[]>([])
  const activeTabId = ref<string | null>(null)
  const queryHistory = ref<QueryHistory[]>([])
  const searchQuery = ref('')

  // Getters
  const activeTab = computed(() => {
    return tabs.value.find(tab => tab.id === activeTabId.value) || null
  })

  const filteredHistory = computed(() => {
    if (!searchQuery.value) return queryHistory.value
    const query = searchQuery.value.toLowerCase()
    return queryHistory.value.filter(
      item => item.sql.toLowerCase().includes(query)
    )
  })

  // Actions
  function createTab(name?: string): string {
    const id = `tab-${Date.now()}`
    const newTab: EditorTab = {
      id,
      name: name || 'Untitled',
      content: '',
      isModified: false
    }
    tabs.value.push(newTab)
    activeTabId.value = id
    return id
  }

  function closeTab(tabId: string) {
    const index = tabs.value.findIndex(tab => tab.id === tabId)
    if (index !== -1) {
      tabs.value.splice(index, 1)
      if (activeTabId.value === tabId) {
        activeTabId.value = tabs.value.length > 0 ? (tabs.value[0]?.id || null) : null
      }
    }
  }

  function setActiveTab(tabId: string | null) {
    if (tabId === null || tabs.value.some(tab => tab.id === tabId)) {
      activeTabId.value = tabId
    }
  }

  function updateTabContent(tabId: string, content: string) {
    const tab = tabs.value.find(t => t.id === tabId)
    if (tab) {
      tab.content = content
      tab.isModified = true
    }
  }

  function saveTab(tabId: string, name?: string) {
    const tab = tabs.value.find(t => t.id === tabId)
    if (tab) {
      if (name) tab.name = name
      tab.isModified = false
    }
  }

  function addToHistory(sql: string, success: boolean, executionTime?: number, error?: string) {
    const historyItem: QueryHistory = {
      id: `history-${Date.now()}`,
      sql,
      executedAt: new Date(),
      executionTime,
      success,
      error
    }
    queryHistory.value.unshift(historyItem)
    // Keep only last 100 items
    if (queryHistory.value.length > 100) {
      queryHistory.value = queryHistory.value.slice(0, 100)
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  return {
    tabs,
    activeTabId,
    queryHistory,
    searchQuery,
    activeTab,
    filteredHistory,
    createTab,
    closeTab,
    setActiveTab,
    updateTabContent,
    saveTab,
    addToHistory,
    setSearchQuery
  }
})
