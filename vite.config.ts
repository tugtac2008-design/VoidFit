import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'framer': ['framer-motion'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'zustand': ['zustand'],
        },
      },
    },
  },
})
