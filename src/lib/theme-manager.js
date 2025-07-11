// Global theme management that works independently of React
class ThemeManager {
  constructor() {
    this.storageKey = 'vite-ui-theme'
    this.theme = this.getStoredTheme()
    this.init()
  }

  getStoredTheme() {
    if (typeof localStorage === 'undefined') return 'system'
    return localStorage.getItem(this.storageKey) || 'system'
  }

  getSystemTheme() {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  applyTheme(theme) {
    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    
    // Apply new theme
    if (theme === 'system') {
      const systemTheme = this.getSystemTheme()
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }

  setTheme(theme) {
    this.theme = theme
    localStorage.setItem(this.storageKey, theme)
    this.applyTheme(theme)
    
    // Dispatch custom event for React components to listen to
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }))
  }

  init() {
    // Apply initial theme
    this.applyTheme(this.theme)
    
    // Listen for system theme changes
    if (typeof window !== 'undefined') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.theme === 'system') {
          this.applyTheme('system')
        }
      })
    }
  }
}

// Create global instance
window.themeManager = new ThemeManager()

// Export for module use
export default window.themeManager
