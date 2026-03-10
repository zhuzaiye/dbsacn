// Database related types

export interface DatabaseConnection {
  id: string
  name: string
  type: 'mysql' | 'postgresql' | 'sqlite' | 'sqlserver' | 'clickhouse'
  host: string
  port: number
  database: string
  username: string
  password?: string
  connected: boolean
  lastConnected?: Date
}

export interface DatabaseNode {
  id: string
  name: string
  type: 'database' | 'table' | 'column' | 'schema'
  children?: DatabaseNode[]
  metadata?: Record<string, any>
}
