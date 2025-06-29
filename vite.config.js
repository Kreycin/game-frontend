import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// 1. Import ปลั๊กอินที่เราติดตั้งเข้ามา
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // 2. เพิ่ม VitePWA() เข้าไปในอาร์เรย์ของ plugins
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Demon Slayer Character Sheet',
        short_name: 'DS CharSheet',
        description: 'A web application for displaying character sheets from the game.',
        theme_color: '#242424',
        background_color: '#1a1a1a',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}']
      }
    })
  ],
})