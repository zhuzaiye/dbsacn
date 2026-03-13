import { load, Store } from '@tauri-apps/plugin-store'

const STORE_FILE = 'settings.json'

interface AppSettings {
  theme: 'light' | 'dark'
  sidebarWidth: number
  leftSplitSize: number
  rightSplitSize: number
  editorVerticalSplitSize: number
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  sidebarWidth: 300,
  leftSplitSize: 0.2,
  rightSplitSize: 0.75,
  editorVerticalSplitSize: 0.55
}

let storeInstance: Store | null = null

const defaults = {
  settings: {
    theme: 'dark',
    sidebarWidth: 300,
    leftSplitSize: 0.2,
    rightSplitSize: 0.75,
    editorVerticalSplitSize: 0.55
  }
}

async function getStore(): Promise<Store> {
  if (!storeInstance) {
    storeInstance = await load(STORE_FILE, { 
      autoSave: true, 
      defaults 
    })
  }
  return storeInstance
}

export const settingsStorage = {
  async load(): Promise<AppSettings> {
    try {
      const store = await getStore()
      const data = await store.get<AppSettings>('settings')
      return { ...defaultSettings, ...data }
    } catch (error) {
      console.error('Failed to load settings:', error)
      return defaultSettings
    }
  },

  async save(settings: Partial<AppSettings>): Promise<void> {
    try {
      const store = await getStore()
      const current = await this.load()
      await store.set('settings', { ...current, ...settings })
      await store.save()
    } catch (error) {
      console.error('Failed to save settings:', error)
    }
  },

  async reset(): Promise<void> {
    await this.save(defaultSettings)
  }
}
