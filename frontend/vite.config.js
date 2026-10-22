import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Normalize cwd to canonical path to avoid Windows junction path mismatches
process.chdir(__dirname)

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  server: {
    port: 3001,
    fs: {
      strict: false
    }
  }
})

