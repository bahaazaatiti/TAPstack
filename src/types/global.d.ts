// Global type declarations
declare global {
  interface Window {
    blockData?: Record<string, any>
    themeManager?: {
      setTheme: (theme: string) => void
      getCurrentTheme: () => string
      theme: string
    }
  }
}

export {}
