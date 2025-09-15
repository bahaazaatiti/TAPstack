import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"

import { Toggle } from "@/components/ui/toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ThemeToggleProps {
  translations?: {
    [key: string]: string;
  };
}

export default function ThemeToggle({ translations = {} }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Get initial theme
    const storedTheme = localStorage.getItem('vite-ui-theme') || 'system'
    const root = document.documentElement
    
    // Check if dark mode is currently active
    const isCurrentlyDark = root.classList.contains('dark') || 
      (storedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    setIsDark(isCurrentlyDark)

    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent) => {
      const newTheme = event.detail.theme
      const willBeDark = newTheme === 'dark' || 
        (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      setIsDark(willBeDark)
    }

    window.addEventListener('theme-change', handleThemeChange as EventListener)
    
    return () => {
      window.removeEventListener('theme-change', handleThemeChange as EventListener)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    
    // Use global theme manager if available
    if (window.themeManager) {
      window.themeManager.setTheme(newTheme)
    } else {
      // Fallback: direct implementation
      localStorage.setItem('vite-ui-theme', newTheme)
      const root = document.documentElement
      
      root.classList.remove('light', 'dark')
      root.classList.add(newTheme)
      
      setIsDark(newTheme === 'dark')
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle 
          pressed={isDark}
          onPressedChange={toggleTheme}
          variant="outline" 
          size="sm"
          className="size-8 rounded-full border-none shadow-none"
          aria-label="Toggle theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>
        <p>{translations.toggle_theme || "Toggle theme"}</p>
      </TooltipContent>
    </Tooltip>
  )
}
