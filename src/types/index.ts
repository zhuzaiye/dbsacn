// Common types and interfaces

export interface Tab {
  id: string
  name: string
  content: string
  isModified: boolean
}

export interface QueryResult {
  columns: string[]
  rows: any[][]
  rowCount: number
  executionTime?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface DatabaseConnection {
  id: string
  name: string
  type: 'mysql' | 'postgresql' | 'sqlite' | 'sqlserver'
  host: string
  port: number
  database: string
  username: string
  password?: string
  connected: boolean
}
