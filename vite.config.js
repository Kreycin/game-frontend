import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 1. บอกให้ปลั๊กอิน "สร้าง" sw.js ให้เรา ไม่ใช่ไปหาไฟล์มาใช้
      // นี่คือการตั้งค่าเริ่มต้น แต่การระบุให้ชัดเจนจะปลอดภัยที่สุด
      strategy: 'generateSW',

      // 2. บอกให้ลงทะเบียน service worker อัตโนมัติ
      registerType: 'autoUpdate',
      
      // 3. ตั้งค่า Workbox (เครื่องมือเบื้องหลังที่ใช้สร้าง sw.js)
      workbox: {
        // บอกให้มัน Cache ไฟล์พื้นฐานทั้งหมดสำหรับใช้งานออฟไลน์
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
        // เพิ่ม runtimeCaching เพื่อให้มี Fetch handler (สำคัญสำหรับ Android)
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 วัน
              },
            },
          },
        ]
      },

      // 4. Manifest ที่สมบูรณ์แล้ว (ไม่มี screenshots)
      manifest: {
        name: 'Demon Slayer Character Sheet',
        short_name: 'DS CharSheet',
        description: 'A web application for displaying character sheets from the game.',
        theme_color: '#242424',
        background_color: '#1a1a1a',
        start_url: '/',
        id: '/',
        display: 'standalone',
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
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})