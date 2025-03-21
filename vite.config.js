import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://23.21.173.183:8080', // Your API URL
        changeOrigin: true,
        secure: false, // Ignore HTTPS issues if necessary
      },
    },
  },
})
