import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/stream': 'http://localhost:8000',
      '/control': 'http://localhost:8000',
      '/status': 'http://localhost:8000',
    }
  }
})
