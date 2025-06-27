import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('@heroui') || id.includes('framer-motion')) return 'ui';
          if (id.includes('swiper')) return 'swiper';
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'react';
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  }
})
