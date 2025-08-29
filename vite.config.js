import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
    server: {
        port: 5173,
        proxy: {
            // 只要請求以 /api 開頭，就代理到後端
            '/api': {
                target: 'http://localhost:8081', // 修改端口为8081
                changeOrigin: true
            }
        }
    }
})
