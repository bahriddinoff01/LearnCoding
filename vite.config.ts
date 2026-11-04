import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// The site is served from https://<user>.github.io/LearnCoding/
export default defineConfig({
  base: '/LearnCoding/',
  plugins: [react(), tailwindcss()],
})
