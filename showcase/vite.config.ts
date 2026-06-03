import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Resolve `@aud/brand` (and its CSS subpaths) to the package source one level up,
// so the showcase consumes the package exactly as a real app would. Most specific
// aliases first.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@aud/brand/fonts.css',
        replacement: fileURLToPath(new URL('../fonts/fonts.css', import.meta.url)),
      },
      {
        find: '@aud/brand/tokens.css',
        replacement: fileURLToPath(new URL('../tokens/tokens.css', import.meta.url)),
      },
      {
        find: '@aud/brand',
        replacement: fileURLToPath(new URL('../src/index.ts', import.meta.url)),
      },
    ],
  },
  // Allow importing the package source from the parent directory.
  server: { fs: { allow: ['..'] } },
})
