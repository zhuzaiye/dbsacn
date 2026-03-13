import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/main.css'
import { useDatabaseStore } from '@/stores/database'
import { useLayoutStore } from '@/stores/layout'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const databaseStore = useDatabaseStore()
const layoutStore = useLayoutStore()

async function initApp() {
  await Promise.all([
    databaseStore.init(),
    layoutStore.init()
  ])
  
  app.mount('#app')
}

initApp()
