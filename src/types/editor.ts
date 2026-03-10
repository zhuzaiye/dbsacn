// SQL Editor related types

export interface EditorTab {
  id: string
  name: string
  content: string
  isModified: boolean
  cursorPosition?: { line: number; column: number }
}

export interface QueryHistory {
  id: string
  sql: string
  executedAt: Date
  executionTime?: number
  success: boolean
  error?: string
}
