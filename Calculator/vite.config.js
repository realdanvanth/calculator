import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/23CSE461/calculator/',   // ⚠️ repo name + subfolder
})

