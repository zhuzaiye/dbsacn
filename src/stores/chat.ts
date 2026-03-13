import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChatSession, ChatMessage } from '@/types/chat'

export const useChatStore = defineStore('chat', () => {
  // State
  const sessions = ref<ChatSession[]>([])
  const activeSessionId = ref<string | null>(null)
  const isAuthenticated = ref(false)

  // Getters
  const activeSession = computed(() => {
    return sessions.value.find(session => session.id === activeSessionId.value) || null
  })

  const activeMessages = computed(() => {
    return activeSession.value?.messages || []
  })

  // Actions
  function createSession(name?: string): string {
    const id = `session-${Date.now()}`
    const newSession: ChatSession = {
      id,
      name: name || 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    sessions.value.push(newSession)
    activeSessionId.value = id
    return id
  }

  function deleteSession(sessionId: string) {
    const index = sessions.value.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      sessions.value.splice(index, 1)
      if (activeSessionId.value === sessionId) {
        const first = sessions.value[0]
        activeSessionId.value = first ? first.id : null
      }
    }
  }

  function setActiveSession(sessionId: string | null) {
    activeSessionId.value = sessionId
  }

  function addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      const newMessage: ChatMessage = {
        ...message,
        id: `msg-${Date.now()}-${Math.random()}`,
        timestamp: new Date()
      }
      session.messages.push(newMessage)
      session.updatedAt = new Date()
    }
  }

  function updateSessionName(sessionId: string, name: string) {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      session.name = name
      session.updatedAt = new Date()
    }
  }

  function setAuthenticated(authenticated: boolean) {
    isAuthenticated.value = authenticated
  }

  return {
    sessions,
    activeSessionId,
    isAuthenticated,
    activeSession,
    activeMessages,
    createSession,
    deleteSession,
    setActiveSession,
    addMessage,
    updateSessionName,
    setAuthenticated
  }
})
