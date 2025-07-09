import { resolve } from 'path'
import kirby from 'vite-plugin-kirby'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

export default ({ mode }) => ({
  root: 'src',
  base: mode === 'development' ? '/' : '/dist/',

  build: {
    outDir: resolve(process.cwd(), 'public/dist'),
    emptyOutDir: true,
    rollupOptions: { input: resolve(process.cwd(), 'src/index.tsx') }
  },

  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src')
    }
  },

  plugins: [
    react(),
    kirby(),
    tailwindcss()
  ]
})