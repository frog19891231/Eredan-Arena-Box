import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/Eredan-Arena-Box/' // 👈 設定 GitHub Pages 路徑
})
