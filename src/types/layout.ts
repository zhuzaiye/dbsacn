// Layout related types

export interface LayoutState {
  sidebarWidth: number
  isSidebarCollapsed: boolean
  activeTopNav: 'sources' | 'queries' | 'history'
  activeResultTab: 'data' | 'chart' | 'logs'
  theme: 'light' | 'dark'
}
