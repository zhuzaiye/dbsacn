import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { DatabaseConnection, DatabaseNode } from '@/types/database'
import { connectionStorage } from '@/services/storage/connection'

export const useDatabaseStore = defineStore('database', () => {
  // State
  const connections = ref<DatabaseConnection[]>([])
  const activeConnectionId = ref<string | null>(null)
  const databaseTree = ref<DatabaseNode[]>([])
  const searchQuery = ref('')
  const isInitialized = ref(false)

  // Getters
  const activeConnection = computed(() => {
    return connections.value.find(conn => conn.id === activeConnectionId.value) || null
  })

  const filteredConnections = computed(() => {
    if (!searchQuery.value) return connections.value
    const query = searchQuery.value.toLowerCase()
    return connections.value.filter(
      conn => conn.name.toLowerCase().includes(query) || 
              conn.database.toLowerCase().includes(query)
    )
  })

  // Initialize from storage
  async function init() {
    if (isInitialized.value) return
    
    try {
      connections.value = await connectionStorage.load()
      if (connections.value.length > 0) {
        const first = connections.value[0]
        if (first) {
          activeConnectionId.value = first.id
        }
      }
      isInitialized.value = true
    } catch (error) {
      console.error('Failed to initialize database store:', error)
    }
  }

  // Save to storage when connections change
  watch(connections, async () => {
    if (isInitialized.value) {
      await connectionStorage.save(connections.value)
    }
  }, { deep: true })

  // Actions
  function addConnection(connection: Omit<DatabaseConnection, 'id' | 'connected'>) {
    const newConnection: DatabaseConnection = {
      ...connection,
      id: `conn-${Date.now()}`,
      connected: false
    }
    connections.value.push(newConnection)
    ensureActiveConnectionSelected()
    return newConnection.id
  }

  async function updateConnection(id: string, updates: Partial<Omit<DatabaseConnection, 'id'>>) {
    const index = connections.value.findIndex(conn => conn.id === id)
    if (index !== -1) {
      const existing = connections.value[index]
      if (existing) {
        connections.value[index] = { ...existing, ...updates }
      }
    }
  }

  async function deleteConnection(id: string) {
    const index = connections.value.findIndex(conn => conn.id === id)
    if (index !== -1) {
      connections.value.splice(index, 1)
      if (activeConnectionId.value === id) {
        activeConnectionId.value = connections.value.length > 0 ? connections.value[0]?.id || null : null
      }
    }
  }

  function setActiveConnection(id: string | null) {
    if (id === null || connections.value.some(conn => conn.id === id)) {
      activeConnectionId.value = id
    }
  }

  function ensureActiveConnectionSelected() {
    if (!activeConnectionId.value && connections.value.length > 0) {
      const first = connections.value[0]
      if (first) {
        activeConnectionId.value = first.id
      }
    }
  }

  function setConnectionStatus(id: string, connected: boolean) {
    const connection = connections.value.find(conn => conn.id === id)
    if (connection) {
      connection.connected = connected
      if (connected) {
        connection.lastConnected = new Date()
      }
    }
  }

  function setDatabaseTree(tree: DatabaseNode[]) {
    databaseTree.value = tree
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  return {
    connections,
    activeConnectionId,
    databaseTree,
    searchQuery,
    isInitialized,
    activeConnection,
    filteredConnections,
    init,
    addConnection,
    updateConnection,
    deleteConnection,
    setActiveConnection,
    setConnectionStatus,
    setDatabaseTree,
    setSearchQuery
  }
})
