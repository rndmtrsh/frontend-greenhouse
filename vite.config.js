// vite.config.js - Simple working proxy configuration
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://kedairekagreenhouse.my.id',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path // Tidak mengubah path
      }
    }
  }
})