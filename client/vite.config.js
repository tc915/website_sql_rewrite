import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // base: 'https://ideasthatfloat.test.ideasthatfloat.com/',
  plugins: [react()],
  server: {
    host: '0.0.0.0'
  },
  build: { chunkSizeWarningLimit: 1000 }
})
