import { computed } from 'vue'
import { darkTheme } from 'naive-ui'
import { useLayoutStore } from '@/stores/layout'

export function useTheme() {
  const layoutStore = useLayoutStore()

  const theme = computed(() => {
    return layoutStore.theme === 'dark' ? darkTheme : null
  })

  const toggleTheme = () => {
    layoutStore.toggleTheme()
  }

  return {
    theme,
    toggleTheme,
    isDark: computed(() => layoutStore.theme === 'dark')
  }
}
