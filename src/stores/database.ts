import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DatabaseConnection, DatabaseNode } from '@/types/database'

export const useDatabaseStore = defineStore('database', () => {
  // State
  const connections = ref<DatabaseConnection[]>([])
  const activeConnectionId = ref<string | null>(null)
  const databaseTree = ref<DatabaseNode[]>([])
  const searchQuery = ref('')

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

  function updateConnection(id: string, updates: Partial<Omit<DatabaseConnection, 'id'>>) {
    const index = connections.value.findIndex(conn => conn.id === id)
    if (index !== -1) {
      connections.value[index] = {
        ...connections.value[index],
        ...updates
      } as DatabaseConnection
    }
  }

  function deleteConnection(id: string) {
    const index = connections.value.findIndex(conn => conn.id === id)
    if (index !== -1) {
      connections.value.splice(index, 1)
      if (activeConnectionId.value === id) {
        activeConnectionId.value = connections.value.length > 0 ? connections.value[0]!.id : null
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
      activeConnectionId.value = connections.value[0]!.id
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
    activeConnection,
    filteredConnections,
    addConnection,
    updateConnection,
    deleteConnection,
    setActiveConnection,
    setConnectionStatus,
    setDatabaseTree,
    setSearchQuery
  }
})
