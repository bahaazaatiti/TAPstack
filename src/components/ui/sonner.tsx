import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps, toast } from "sonner"
import { createRoot } from 'react-dom/client'
import { useEffect } from 'react'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

// Auto-mount toaster when toast is used
const initializeToaster = () => {
  if (typeof window === 'undefined') return
  
  let toasterContainer = document.getElementById('react-toaster-container')
  if (!toasterContainer) {
    toasterContainer = document.createElement('div')
    toasterContainer.id = 'react-toaster-container'
    toasterContainer.className = 'fixed top-5 start-5 z-[9999] pointer-events-none'
    document.body.appendChild(toasterContainer)
    
    // Render Toaster in the visible container
    const toasterRoot = createRoot(toasterContainer)
    toasterRoot.render(<Toaster position="top-center" />)
  }
}

// Enhanced toast object that auto-initializes
const enhancedToast = {
  success: (message: string, options?: any) => {
    initializeToaster()
    return toast.success(message, options)
  },
  error: (message: string, options?: any) => {
    initializeToaster()
    return toast.error(message, options)
  },
  info: (message: string, options?: any) => {
    initializeToaster()
    return toast.info(message, options)
  },
  warning: (message: string, options?: any) => {
    initializeToaster()
    return toast.warning(message, options)
  },
  loading: (message: string, options?: any) => {
    initializeToaster()
    return toast.loading(message, options)
  },
  custom: (jsx: any, options?: any) => {
    initializeToaster()
    return toast.custom(jsx, options)
  },
  promise: toast.promise,
  dismiss: toast.dismiss,
}

export { Toaster, enhancedToast as toast }
