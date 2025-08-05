import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Zville-playbook-game3/',
  plugins: [react()],
  build: {
    outDir: 'docs' // <--- Add this line
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
