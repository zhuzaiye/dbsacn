import { invoke } from '@tauri-apps/api/core'
import type { DatabaseConnection, DatabaseNode } from '@/types/database'

export interface TestConnectionParams {
  name: string
  type: DatabaseConnection['type']
  host: string
  port: number
  database: string
  username: string
  password: string
}

export interface TestResult {
  success: boolean
  message: string
  server_version?: string
}

export interface QueryResult {
  columns: string[]
  rows: unknown[][]
  rowCount: number
  executionTime?: number
}

export const databaseService = {
  async testConnection(config: TestConnectionParams): Promise<TestResult> {
    return await invoke<TestResult>('test_connection', {
      config: {
        name: config.name,
        db_type: config.type,
        host: config.host,
        port: config.port,
        database: config.database,
        username: config.username,
        password: config.password
      }
    })
  },

  async executeQuery(connectionId: string, sql: string): Promise<QueryResult> {
    return await invoke<QueryResult>('execute_query', {
      connectionId,
      sql
    })
  },

  async fetchSchema(connectionId: string): Promise<DatabaseNode[]> {
    return await invoke<DatabaseNode[]>('fetch_schema', {
      connectionId
    })
  },

  async connect(connection: DatabaseConnection): Promise<boolean> {
    return await invoke<boolean>('connect', {
      connectionId: connection.id,
      config: {
        name: connection.name,
        db_type: connection.type,
        host: connection.host,
        port: connection.port,
        database: connection.database,
        username: connection.username,
        password: connection.password || ''
      }
    })
  },

  async disconnect(connectionId: string): Promise<void> {
    return await invoke('disconnect', {
      connectionId
    })
  }
}
