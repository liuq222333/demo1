import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  base: './',
  plugins: [vue(), UnoCSS()],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
