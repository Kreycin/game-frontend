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
  
  // ***** วางทับส่วน manifest เดิมทั้งหมดด้วยโค้ดด้านล่างนี้ *****
  manifest: {
    name: 'Demon Slayer Character Sheet',
    short_name: 'DS CharSheet',
    description: 'A web application for displaying character sheets from the game.',
    theme_color: '#242424',
    background_color: '#1a1a1a',

    // [แก้ไข] กำหนด Start URL ให้ชัดเจน
    start_url: '/',

    // [แก้ไข] เพิ่ม ID ของแอปพลิเคชัน
    id: '/', 

    // [แก้ไข] แก้ไข purpose ของไอคอนให้ถูกต้อง
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
        purpose: 'maskable' // <--- แก้จาก 'any maskable' เป็น 'maskable'
      }
    ],

    // [เพิ่มใหม่] เพิ่ม Screenshots เพื่อ Richer Install UI (แนะนำ)
    screenshots: [
      {
        "src": "/screenshots/mobile-screenshot-1.jpg",
        "type": "image/jpeg",
        "sizes": "1080x1920",
        "form_factor": "narrow"
      },
      {
        "src": "/screenshots/desktop-screenshot-1.jpg",
        "type": "image/jpeg",
        "sizes": "1920x1080",
        "form_factor": "wide"
      }
    ]
  },
  
  // ส่วนของ workbox ของคุณ (ถ้ามี)
  workbox: { 
    /* ... */ 
  }
})
  ],
})