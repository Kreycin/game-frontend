// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path' // <-- 1. Import 'path' เข้ามา

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      // ... (ส่วน PWA ของคุณเหมือนเดิม) ...
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      workbox: {
        importScripts: ['firebase-messaging-sw.js']
      },
      manifest: {
        name: 'DS Game Hub',
        short_name: 'DS Game Hub',
        description: 'Your one-stop platform for the latest game character info, tier lists, and guides.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        screenshots: [
          {
            src: 'screenshot-desktop.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Desktop View'
          },
          {
            src: 'screenshot-mobile.png',
            sizes: '720x1280',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Mobile View'
          }
        ],
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
  // --- 2. เพิ่มส่วนนี้เข้าไป ---
  resolve: {
    alias: {
      // โค้ดส่วนนี้จะบอก Vite ว่า @ คือ src
      '@': path.resolve(__dirname, './src'),
    },
  },
  // --------------------------
})