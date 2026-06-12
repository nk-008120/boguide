import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',                    // ← root path (after change)
  build: {
    outDir: 'dist/bionuggets',  // ← keep as before
  },
})
