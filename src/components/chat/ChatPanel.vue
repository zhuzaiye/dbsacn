<template>
  <div class="chat-panel">
    <!-- 头部: New Chat 标题 + 添加按钮 -->
    <div class="chat-header">
      <span class="chat-title">{{ activeSessionName }}</span>
      <button class="header-add-btn" @click="handleNewSession">
        <n-icon>
          <AddOutline />
        </n-icon>
      </button>
    </div>

    <!-- 聊天内容区域 -->
    <div class="chat-content">
      <div v-if="!chatStore.isAuthenticated" class="auth-prompt">
        <n-icon size="48" :depth="3">
          <ChatbubblesOutline />
        </n-icon>
        <p>Log in to start generating SQL with Agnostic AI.</p>
        <p>Ask questions, get queries, and explore your data faster than ever.</p>
        <n-button type="primary" @click="handleLogin">Login</n-button>
      </div>
      <div v-else class="messages-container" ref="messagesContainer">
        <div v-for="message in chatStore.activeMessages" :key="message.id" class="message" :class="message.role">
          <div class="message-role">{{ message.role === 'user' ? 'You' : 'Assistant' }}</div>
          <div class="message-content">{{ message.content }}</div>
        </div>
        <div v-if="chatStore.activeMessages.length === 0" class="empty-messages">
          <n-text depth="3">Start a conversation...</n-text>
        </div>
      </div>
    </div>

    <!-- 底部输入区域 -->
    <div class="chat-input-area">
      <div class="input-row">
        <button class="icon-button" @click="handleAddContext" :disabled="!chatStore.isAuthenticated">
          <n-icon>
            <AddCircleOutline />
          </n-icon>
        </button>
        <n-select v-model:value="selectedModel" :options="modelOptions" :disabled="!chatStore.isAuthenticated"
          size="small" style="width: 160px" />
        <n-button type="primary" size="small" :disabled="!chatStore.isAuthenticated || !canSend" @click="handleSend">
          Send ⌘⏎
        </n-button>
      </div>
      <n-input v-model:value="inputMessage" type="textarea" placeholder="Ask a question about your data..."
        :disabled="!chatStore.isAuthenticated" :autosize="{ minRows: 2, maxRows: 6 }" @keydown="handleKeyDown" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  NButton,
  NIcon,
  NSelect,
  NText,
  NInput
} from 'naive-ui'
import {
  AddOutline,
  AddCircleOutline,
  ChatbubblesOutline
} from '@vicons/ionicons5'
import { useChatStore } from '@/stores/chat'

const chatStore = useChatStore()
const messagesContainer = ref<HTMLElement | null>(null)
const inputMessage = ref('')

const selectedModel = ref('agnostic-ai-v0')
const modelOptions = [
  { label: 'Agnostic AI (v0)', value: 'agnostic-ai-v0' }
]

// 获取当前会话名称
const activeSessionName = computed(() => {
  const session = chatStore.sessions.find(s => s.id === chatStore.activeSessionId)
  return session?.name || 'New Chat'
})

const canSend = computed(() => {
  return inputMessage.value.trim().length > 0
})

function handleNewSession() {
  chatStore.createSession()
}

function handleLogin() {
  // TODO: Implement login
  chatStore.setAuthenticated(true)
  if (chatStore.sessions.length === 0) {
    chatStore.createSession()
  }
}

function handleAddContext() {
  // TODO: Add context dialog
  console.log('Add context clicked')
}

async function handleSend() {
  if (!chatStore.activeSessionId || !inputMessage.value.trim()) return

  const message = inputMessage.value.trim()
  inputMessage.value = ''

  chatStore.addMessage(chatStore.activeSessionId, {
    role: 'user',
    content: message
  })

  // 滚动到底部
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }

  // TODO: 发送到 AI 后端并获取回复
  // 模拟 AI 回复
  setTimeout(() => {
    if (chatStore.activeSessionId) {
      chatStore.addMessage(chatStore.activeSessionId, {
        role: 'assistant',
        content: 'This is a sample AI response. The actual implementation will connect to the Agnostic AI backend.'
      })
    }
  }, 1000)
}

function handleKeyDown(e: KeyboardEvent) {
  // Cmd/Ctrl + Enter 发送
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    handleSend()
  }
}
</script>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  border-left: 1px solid var(--divider-color);
  background-color: var(--panel-bg);
}

/* 头部样式 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--divider-color);
  background-color: var(--panel-bg);
}

.chat-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
}

.header-add-btn {
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

.header-add-btn:hover {
  background-color: var(--hover-color);
  color: var(--text-color);
}

/* 聊天内容区域 */
.chat-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background-color: var(--content-bg);
}

.auth-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  gap: 16px;
}

.auth-prompt p {
  color: var(--text-color-secondary);
  margin: 0;
  font-size: 13px;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-role {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-color-secondary);
}

.message.user .message-role {
  text-align: right;
}

.message-content {
  padding: 12px 16px;
  border-radius: 8px;
  background-color: var(--hover-color-strong);
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-color);
  white-space: pre-wrap;
  word-break: break-word;
}

.message.user .message-content {
  background-color: var(--primary-color);
  color: #fff;
}

.empty-messages {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* 底部输入区域 */
.chat-input-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid var(--divider-color);
  background-color: var(--panel-bg);
}

.input-row {
  display: flex;
  align-items: center;
  gap: 8px;
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

.icon-button:hover:not(:disabled) {
  background-color: var(--hover-color);
  color: var(--text-color);
}

.icon-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
