import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LayoutState } from '@/types/layout'

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

  // Getters
  const layoutState = computed<LayoutState>(() => ({
    sidebarWidth: sidebarWidth.value,
    isSidebarCollapsed: isSidebarCollapsed.value,
    activeTopNav: activeTopNav.value,
    activeResultTab: activeResultTab.value,
    theme: theme.value
  }))

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

  return {
    sidebarWidth,
    isSidebarCollapsed,
    activeTopNav,
    activeResultTab,
    theme,
    showResultPanel,
    showChatPanel,
    showSourcesPanel,
    layoutState,
    setSidebarWidth,
    toggleSidebar,
    setActiveTopNav,
    setActiveResultTab,
    toggleTheme,
    toggleResultPanel,
    toggleChatPanel,
    toggleShowSourcesPanel,
    toggleShowResultPanel,
    toggleShowChatPanel
  }
})
