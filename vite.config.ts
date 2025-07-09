import kirby from "vite-plugin-kirby"
import path from "path"
import tailwindcss from '@tailwindcss/vite'
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"


export default defineConfig(({ mode }) => ({
  root: 'src',
  base: mode === 'development' ? '/' : '/dist/',

  build: {
    outDir: path.resolve(process.cwd(), 'public/dist'),
    emptyOutDir: true,
    rollupOptions: { input: path.resolve(process.cwd(), 'src/index.tsx') }
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  plugins: [
    react(),
    tailwindcss(),
    kirby()
  ]
}))
