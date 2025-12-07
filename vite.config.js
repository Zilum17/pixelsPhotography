import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  base: '/',
  build: {
    assetsDir: '', 
    
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]',
      }
    }
  },
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': { 
        target: 'http://192.168.1.13:8080/pixelsPhoto/', 
        changeOrigin: true,
      }
    }
  }
})
