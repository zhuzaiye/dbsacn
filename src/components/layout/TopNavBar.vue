<template>
  <div class="top-nav-bar" data-tauri-drag-region>
    <div class="top-nav-left">
      <h2 class="app-title">DBScan</h2>
      <!-- 菜单栏 -->
      <div class="menu-bar">
        <n-dropdown 
          v-for="menu in menus" 
          :key="menu.key"
          trigger="click" 
          :options="menu.items" 
          @select="handleMenuSelect"
          placement="bottom-start"
          :show-arrow="false"
        >
          <button class="menu-item">
            {{ menu.label }}
          </button>
        </n-dropdown>
      </div>
    </div>
    <!-- 可拖拽区域 -->
    <div class="drag-region" data-tauri-drag-region></div>
    <div class="top-nav-right">
      <n-dropdown 
        trigger="click" 
        :options="settingsOptions" 
        @select="handleMenuSelect"
        placement="bottom-end"
      >
        <button class="icon-button">
          <n-icon><SettingsOutline /></n-icon>
        </button>
      </n-dropdown>
      <!-- 窗口控制按钮 -->
      <div class="window-controls">
        <button class="window-btn" @click="minimizeWindow" title="Minimize">
          <n-icon><RemoveOutline /></n-icon>
        </button>
        <button class="window-btn" @click="toggleMaximize" title="Maximize">
          <n-icon><SquareOutline /></n-icon>
        </button>
        <button class="window-btn close-btn" @click="closeWindow" title="Close">
          <n-icon><CloseOutline /></n-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { NIcon, NDropdown } from 'naive-ui'
import { 
  SettingsOutline, 
  SunnyOutline, 
  MoonOutline,
  RemoveOutline,
  SquareOutline,
  CloseOutline,
  DocumentOutline,
  DocumentTextOutline,
  FolderOutline,
  CodeOutline,
  HelpCircleOutline,
  SaveOutline,
  ArrowUndoOutline,
  ArrowRedoOutline,
  CutOutline,
  CopyOutline,
  ClipboardOutline
} from '@vicons/ionicons5'
import { useLayoutStore } from '@/stores/layout'
import { getCurrentWindow } from '@tauri-apps/api/window'

const layoutStore = useLayoutStore()

// 窗口控制函数
async function minimizeWindow() {
  const appWindow = getCurrentWindow()
  await appWindow.minimize()
}

async function toggleMaximize() {
  const appWindow = getCurrentWindow()
  const isMaximized = await appWindow.isMaximized()
  if (isMaximized) {
    await appWindow.unmaximize()
  } else {
    await appWindow.maximize()
  }
}

async function closeWindow() {
  const appWindow = getCurrentWindow()
  await appWindow.close()
}

// 渲染图标的辅助函数
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 菜单项类型定义
interface MenuItem {
  label?: string
  key: string
  icon?: any
  type?: 'divider'
}

interface MenuGroup {
  label: string
  key: string
  items: (MenuItem | any)[]
}

// 构建菜单结构
const menus = computed<MenuGroup[]>(() => [
  {
    label: 'File',
    key: 'file',
    items: [
      {
        label: 'New Connection',
        key: 'file-new',
        icon: renderIcon(DocumentOutline)
      },
      {
        label: 'Open Connection',
        key: 'file-open',
        icon: renderIcon(FolderOutline)
      },
      {
        type: 'divider',
        key: 'file-divider-1'
      },
      {
        label: 'Save',
        key: 'file-save',
        icon: renderIcon(SaveOutline)
      },
      {
        label: 'Save As...',
        key: 'file-save-as'
      },
      {
        type: 'divider',
        key: 'file-divider-2'
      },
      {
        label: 'Exit',
        key: 'file-close',
        icon: renderIcon(CloseOutline)
      }
    ]
  },
  {
    label: 'Edit',
    key: 'edit',
    items: [
      {
        label: 'Undo',
        key: 'edit-undo',
        icon: renderIcon(ArrowUndoOutline)
      },
      {
        label: 'Redo',
        key: 'edit-redo',
        icon: renderIcon(ArrowRedoOutline)
      },
      {
        type: 'divider',
        key: 'edit-divider-1'
      },
      {
        label: 'Cut',
        key: 'edit-cut',
        icon: renderIcon(CutOutline)
      },
      {
        label: 'Copy',
        key: 'edit-copy',
        icon: renderIcon(CopyOutline)
      },
      {
        label: 'Paste',
        key: 'edit-paste',
        icon: renderIcon(ClipboardOutline)
      },
      {
        type: 'divider',
        key: 'edit-divider-2'
      },
      {
        label: 'Select All',
        key: 'edit-select-all'
      }
    ]
  },
  {
    label: 'View',
    key: 'view',
    items: [
      {
        label: 'Toggle Sidebar',
        key: 'view-toggle-sidebar'
      },
      {
        label: 'Toggle Result Panel',
        key: 'view-toggle-result'
      },
      {
        label: 'Toggle Chat Panel',
        key: 'view-toggle-chat'
      },
      {
        type: 'divider',
        key: 'view-divider-1'
      },
      {
        label: 'Zoom In',
        key: 'view-zoom-in'
      },
      {
        label: 'Zoom Out',
        key: 'view-zoom-out'
      },
      {
        label: 'Reset Zoom',
        key: 'view-zoom-reset'
      }
    ]
  },
  {
    label: 'Tools',
    key: 'tools',
    items: [
      {
        label: 'Execute Query',
        key: 'tools-execute',
        icon: renderIcon(CodeOutline)
      },
      {
        type: 'divider',
        key: 'tools-divider-1'
      },
      {
        label: 'Preferences',
        key: 'tools-settings',
        icon: renderIcon(SettingsOutline)
      }
    ]
  },
  {
    label: 'Help',
    key: 'help',
    items: [
      {
        label: 'Docs',
        key: 'help-docs',
        icon: renderIcon(DocumentTextOutline)
      },
      {
        type: 'divider',
        key: 'help-divider-1'
      },
      {
        label: 'About',
        key: 'help-about',
        icon: renderIcon(HelpCircleOutline)
      }
    ]
  }
])

// 原来的设置菜单 - 保留在右侧
const settingsOptions = computed(() => [
  {
    label: layoutStore.theme === 'dark' ? 'light' : 'dark',
    key: 'toggle-theme',
    icon: renderIcon(layoutStore.theme === 'dark' ? SunnyOutline : MoonOutline)
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: 'About',
    key: 'about',
    icon: renderIcon(HelpCircleOutline)
  }
])

// 处理菜单选择 - 企业级菜单事件处理
function handleMenuSelect(key: string) {
  switch (key) {
    // 文件菜单
    case 'file-new':
      console.log('New Connection')
      break
    case 'file-open':
      console.log('Open Connection')
      break
    case 'file-save':
      console.log('Save Connection')
      break
    case 'file-save-as':
      console.log('Save Connection As')
      break
    case 'file-close':
      console.log('Close Connection')
      break

    // 编辑菜单
    case 'edit-undo':
      console.log('Undo')
      break
    case 'edit-redo':
      console.log('Redo')
      break
    case 'edit-cut':
      console.log('Cut')
      break
    case 'edit-copy':
      console.log('Copy')
      break
    case 'edit-paste':
      console.log('Paste')
      break
    case 'edit-select-all':
      console.log('Select All')
      break

    // 视图菜单
    case 'view-toggle-sidebar':
      layoutStore.toggleShowSourcesPanel()
      break
    case 'view-toggle-result':
      layoutStore.toggleShowResultPanel()
      break
    case 'view-toggle-chat':
      layoutStore.toggleShowChatPanel()
      break
    case 'view-zoom-in':
      console.log('Zoom In')
      break
    case 'view-zoom-out':
      console.log('Zoom Out')
      break
    case 'view-zoom-reset':
      console.log('Reset Zoom')
      break
    case 'view-toggle-theme':
      layoutStore.toggleTheme()
      break

    // 工具菜单
    case 'tools-execute':
      console.log('Execute Query')
      break
    case 'tools-settings':
      console.log('Open Settings')
      break

    // 帮助菜单
    case 'help-docs':
      console.log('Open Documentation')
      break
    case 'help-about':
      console.log('About')
      break

    // 设置菜单（原来的）
    case 'toggle-theme':
      layoutStore.toggleTheme()
      break
    case 'about':
      console.log('About clicked')
      break
  }
}
</script>

<style scoped>
.top-nav-bar {
  display: flex;
  align-items: center;
  padding: 0 0 0 16px;
  background-color: var(--top-nav-bg);
  flex-shrink: 0;
  height: 36px;
  /* 明确的底部分隔线 */
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 1px 4px var(--shadow-color);
  position: relative;
  z-index: 10;
  user-select: none;
}

.top-nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
}

.app-title {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
}

.menu-bar {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 0;
}

.menu-item {
  background: transparent;
  border: none;
  padding: 4px 12px;
  cursor: pointer;
  color: var(--text-color-secondary);
  font-size: 13px;
  font-weight: 500;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease-out;
  height: 100%;
  white-space: nowrap;
  position: relative;
}

/* 菜单项悬停效果 */
.menu-item:hover {
  background-color: var(--hover-color-strong);
  color: var(--text-color);
}

/* 菜单项激活状态 */
.menu-item:active {
  background-color: var(--hover-color);
}

/* 深色主题优化 */
:root.dark .menu-item {
  color: rgba(204, 204, 204, 0.9);
}

:root.dark .menu-item:hover {
  background-color: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

/* 浅色主题优化 */
:root.light .menu-item {
  color: rgba(51, 51, 51, 0.8);
}

:root.light .menu-item:hover {
  background-color: rgba(0, 0, 0, 0.08);
  color: #333333;
}

/* ============ 可拖拽区域 ============ */
.drag-region {
  flex: 1;
  height: 100%;
  -webkit-app-region: drag;
}

/* ============ 右侧按钮区域 ============ */
.top-nav-right {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 100%;
}

.icon-button {
  background: transparent;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: var(--text-color-secondary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-button:hover {
  background-color: var(--hover-color);
  color: var(--text-color);
}

/* 窗口控制按钮 */
.window-controls {
  display: flex;
  align-items: center;
  height: 100%;
  margin-left: 8px;
}

.window-btn {
  background: transparent;
  border: none;
  width: 46px;
  height: 100%;
  cursor: pointer;
  color: var(--text-color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s;
}

.window-btn:hover {
  background-color: var(--hover-color);
  color: var(--text-color);
}

.window-btn.close-btn:hover {
  background-color: #e81123;
  color: #fff;
}

/* ============ 深色/浅色主题适配 - NaiveUI 下拉菜单 ============ */
/* 这些样式会覆盖 NaiveUI 默认的下拉菜单样式 */
:deep(.n-dropdown-menu) {
  background-color: var(--panel-bg) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: 4px;
  box-shadow: 0 3px 12px var(--shadow-color) !important;
}

:deep(.n-dropdown-option) {
  color: var(--text-color) !important;
}

:deep(.n-dropdown-option:hover) {
  background-color: var(--hover-color-strong) !important;
  color: var(--text-color) !important;
}

:deep(.n-dropdown-option-content) {
  font-size: 13px;
}

:deep(.n-dropdown-divider) {
  background-color: var(--divider-color) !important;
}
</style>
