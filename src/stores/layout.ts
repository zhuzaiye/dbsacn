import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { LayoutState } from '@/types/layout'
import { settingsStorage } from '@/services/storage/settings'

export const useLayoutStore = defineStore('layout', () => {
  // State
  const sidebarWidth = ref(300)
  const isSidebarCollapsed = ref(false)
  const activeTopNav = ref<'sources' | 'queries' | 'history'>('sources')
  const activeResultTab = ref<'data' | 'chart' | 'logs'>('data')
  const theme = ref<'light' | 'dark'>('dark')
  const showResultPanel = ref(false)
  const showChatPanel = ref(false)
  const showSourcesPanel = ref(true)
  const isInitialized = ref(false)
  
  // Connection dialog state
  const showConnectionDialog = ref(false)
  const editConnectionId = ref<string | undefined>()

  // Getters
  const layoutState = computed<LayoutState>(() => ({
    sidebarWidth: sidebarWidth.value,
    isSidebarCollapsed: isSidebarCollapsed.value,
    activeTopNav: activeTopNav.value,
    activeResultTab: activeResultTab.value,
    theme: theme.value
  }))

  // Initialize from storage
  async function init() {
    if (isInitialized.value) return
    
    try {
      const settings = await settingsStorage.load()
      theme.value = settings.theme
      sidebarWidth.value = settings.sidebarWidth
      isInitialized.value = true
    } catch (error) {
      console.error('Failed to initialize layout store:', error)
    }
  }

  // Save to storage when settings change
  watch([theme, sidebarWidth], async () => {
    if (isInitialized.value) {
      await settingsStorage.save({
        theme: theme.value,
        sidebarWidth: sidebarWidth.value
      })
    }
  })

  // Actions
  function setSidebarWidth(width: number) {
    sidebarWidth.value = Math.max(200, Math.min(600, width))
  }

  function toggleSidebar() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }

  function setActiveTopNav(nav: 'sources' | 'queries' | 'history') {
    activeTopNav.value = nav
  }

  function setActiveResultTab(tab: 'data' | 'chart' | 'logs') {
    activeResultTab.value = tab
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function toggleResultPanel() {
    showResultPanel.value = !showResultPanel.value
  }

  function toggleChatPanel() {
    showChatPanel.value = !showChatPanel.value
  }

  function toggleShowSourcesPanel() {
    showSourcesPanel.value = !showSourcesPanel.value
  }

  function toggleShowResultPanel() {
    showResultPanel.value = !showResultPanel.value
  }

  function toggleShowChatPanel() {
    showChatPanel.value = !showChatPanel.value
  }

  function openConnectionDialog(editId?: string) {
    editConnectionId.value = editId
    showConnectionDialog.value = true
  }

  function closeConnectionDialog() {
    showConnectionDialog.value = false
    editConnectionId.value = undefined
  }

  return {
    sidebarWidth,
    isSidebarCollapsed,
    activeTopNav,
    activeResultTab,
    theme,
    showResultPanel,
    showChatPanel,
    showSourcesPanel,
    isInitialized,
    showConnectionDialog,
    editConnectionId,
    layoutState,
    init,
    setSidebarWidth,
    toggleSidebar,
    setActiveTopNav,
    setActiveResultTab,
    toggleTheme,
    toggleResultPanel,
    toggleChatPanel,
    toggleShowSourcesPanel,
    toggleShowResultPanel,
    toggleShowChatPanel,
    openConnectionDialog,
    closeConnectionDialog
  }
})
