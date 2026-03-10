// Utility functions

export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString()
}

export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString()
}

export function formatDateTime(date: Date): string {
  return new Date(date).toLocaleString()
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength) + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
