import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://books.cden.app',
        changeOrigin: true,
        rewrite: (path) => '/next/' + path
      },
      '/web': {
        target: 'https://books.cden.app',
        changeOrigin: true,
        rewrite: (path) => '/next/' + path
      },
      '/flibusta-is': {
        target: 'https://flibusta.is',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/flibusta-is/, '')
      }
    }
  }
})
