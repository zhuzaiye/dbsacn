import { load, Store } from '@tauri-apps/plugin-store'
import type { DatabaseConnection } from '@/types/database'

const STORE_FILE = 'connections.json'

let storeInstance: Store | null = null

async function getStore(): Promise<Store> {
  if (!storeInstance) {
    storeInstance = await load(STORE_FILE, { autoSave: true, defaults: { connections: [] } })
  }
  return storeInstance
}

export const connectionStorage = {
  async load(): Promise<DatabaseConnection[]> {
    try {
      const store = await getStore()
      const data = await store.get<DatabaseConnection[]>('connections')
      return data || []
    } catch (error) {
      console.error('Failed to load connections:', error)
      return []
    }
  },

  async save(connections: DatabaseConnection[]): Promise<void> {
    try {
      const store = await getStore()
      await store.set('connections', connections)
      await store.save()
    } catch (error) {
      console.error('Failed to save connections:', error)
    }
  },

  async add(connection: DatabaseConnection): Promise<void> {
    const connections = await this.load()
    connections.push(connection)
    await this.save(connections)
  },

  async update(id: string, updates: Partial<DatabaseConnection>): Promise<void> {
    const connections = await this.load()
    const index = connections.findIndex(c => c.id === id)
    if (index !== -1) {
      const existing = connections[index]
      if (existing) {
        const updated: DatabaseConnection = { ...existing, ...updates }
        connections[index] = updated
        await this.save(connections)
      }
    }
  },

  async delete(id: string): Promise<void> {
    const connections = await this.load()
    const filtered = connections.filter(c => c.id !== id)
    await this.save(filtered)
  },

  async clear(): Promise<void> {
    await this.save([])
  }
}
