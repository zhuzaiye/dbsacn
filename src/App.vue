<template>
  <n-config-provider :theme="naiveTheme">
    <n-global-style v-if="showGlobalStyle" />
    <div class="app-container">
      <TopNavBar />
      <div class="main-content">
        <!-- 三列布局：Sources | Editor+Results | Chat -->
        <n-split v-model:size="leftSplitSize" :min="0.1" :max="0.3" direction="horizontal" class="main-split">
          <!-- 左侧：Sources面板 -->
          <template #1>
            <SourcesPanel />
          </template>
          <!-- 中间和右侧 -->
          <template #2>
            <!-- 有 Chat Panel 时使用水平分割 -->
            <n-split v-if="layoutStore.showChatPanel" v-model:size="rightSplitSize" :min="0.2" :max="0.9"
              direction="horizontal" class="middle-split">
              <!-- 中间：SQL Editor + Results -->
              <template #1>
                <!-- 有 Result Panel 时使用垂直分割 -->
                <n-split v-if="layoutStore.showResultPanel" v-model:size="editorVerticalSplitSize" :min="0.2" :max="0.8"
                  direction="vertical" class="editor-split">
                  <template #1>
                    <div class="editor-section">
                      <SqlEditorTabs />
                      <SqlEditor />
                    </div>
                  </template>
                  <template #2>
                    <ResultPanel />
                  </template>
                </n-split>
                <!-- 没有 Result Panel 时只显示编辑器 -->
                <div v-else class="editor-section">
                  <SqlEditorTabs />
                  <SqlEditor />
                </div>
              </template>
              <!-- 右侧：Chat面板 -->
              <template #2>
                <ChatPanel />
              </template>
            </n-split>
            <!-- 没有 Chat Panel 时 -->
            <template v-else>
              <!-- 有 Result Panel 时使用垂直分割 -->
              <n-split v-if="layoutStore.showResultPanel" v-model:size="editorVerticalSplitSize" :min="0.2" :max="0.8"
                direction="vertical" class="editor-split">
                <template #1>
                  <div class="editor-section">
                    <SqlEditorTabs />
                    <SqlEditor />
                  </div>
                </template>
                <template #2>
                  <ResultPanel />
                </template>
              </n-split>
              <!-- 没有 Result Panel 时只显示编辑器 -->
              <div v-else class="editor-section">
                <SqlEditorTabs />
                <SqlEditor />
              </div>
            </template>
          </template>
        </n-split>
      </div>
      <StatusBar />
    </div>
    <!-- Connection dialog -->
    <ConnectionDialog
      :show="layoutStore.showConnectionDialog"
      :edit-id="layoutStore.editConnectionId"
      @update:show="layoutStore.showConnectionDialog = $event"
      @saved="layoutStore.closeConnectionDialog()"
    />
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { darkTheme, NConfigProvider, NSplit } from 'naive-ui'
import { useLayoutStore } from '@/stores/layout'
import { useEditorStore } from '@/stores/editor'
import TopNavBar from '@/components/layout/TopNavBar.vue'
import StatusBar from '@/components/layout/StatusBar.vue'
import SourcesPanel from '@/components/sidebar/SourcesPanel.vue'
import SqlEditorTabs from '@/components/editor/SqlEditorTabs.vue'
import SqlEditor from '@/components/editor/SqlEditor.vue'
import ResultPanel from '@/components/result/ResultPanel.vue'
import ChatPanel from '@/components/chat/ChatPanel.vue'
import ConnectionDialog from '@/components/dialog/ConnectionDialog.vue'

const layoutStore = useLayoutStore()
const editorStore = useEditorStore()

const leftSplitSize = ref(0.2) // 左侧Sources面板占比（0-1）
const rightSplitSize = ref(0.75) // Editor+Results vs Chat（0-1）
const editorVerticalSplitSize = ref(0.55) // Editor vs Results（0-1）

// 确保 n-global-style 只挂载一次，避免警告
// 使用 window 对象来跟踪是否已经挂载
const showGlobalStyle = ref(!(window as any).__naive_global_style_mounted)
if (showGlobalStyle.value) {
  (window as any).__naive_global_style_mounted = true
}

const naiveTheme = computed(() => {
  return layoutStore.theme === 'dark' ? darkTheme : null
})

// 同步主题到 HTML 根元素的 class
function updateThemeClass(theme: 'light' | 'dark') {
  const root = document.documentElement
  if (theme === 'light') {
    root.classList.add('light')
    root.classList.remove('dark')
  } else {
    root.classList.add('dark')
    root.classList.remove('light')
  }
}

// 监听主题变化
watch(() => layoutStore.theme, (newTheme) => {
  updateThemeClass(newTheme)
}, { immediate: true })

onMounted(async () => {
  // 初始化主题 class
  updateThemeClass(layoutStore.theme)

  // Create initial tab
  if (editorStore.tabs.length === 0) {
    editorStore.createTab('Untitled')
  }

  // 确保 DOM 更新后再强制重新计算布局
  await nextTick()
  // 触发窗口 resize 事件，让 n-split 重新计算尺寸
  window.dispatchEvent(new Event('resize'))
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--app-bg);
  color: var(--text-color);
  transition: background-color 0.2s, color 0.2s;
}

#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: var(--app-bg);
}

.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: var(--app-bg);
}

/* TopNavBar 固定在顶部 */
.app-container> :first-child {
  flex-shrink: 0;
}

/* StatusBar 固定在底部 */
.app-container> :last-child {
  flex-shrink: 0;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
  width: 100%;
  background-color: var(--content-bg);
}

/* 所有分割容器通用样式 */
.main-split,
.middle-split,
.editor-split {
  height: 100%;
  width: 100%;
}

.editor-section {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 0;
  overflow: hidden;
  background-color: var(--content-bg);
}

/* SqlEditorTabs 固定在顶部，不收缩 */
.editor-section> :first-child {
  flex-shrink: 0;
}

/* SqlEditor 占据剩余空间 */
.editor-section> :last-child {
  flex: 1;
  min-height: 0;
}
</style>
