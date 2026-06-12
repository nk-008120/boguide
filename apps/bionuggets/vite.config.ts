import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/bionuggets/',               // ← critical for subpath deployment
  build: {
    outDir: 'dist/bionuggets',        // optional – keeps output organised
  },
})