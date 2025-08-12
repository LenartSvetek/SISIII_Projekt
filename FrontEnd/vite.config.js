import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: "~89231394",
  plugins: [react()],
  server: {
    port: 4200
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src")
    }
  }
})
