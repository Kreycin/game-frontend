module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{js,css,html,ico,png,svg,jpg}'
  ],
  swDest: 'dist/sw.js',
  
  // [เพิ่มกลับเข้ามา] ส่วนสำคัญที่ขาดไปคือส่วนนี้ครับ
  // ส่วนนี้จะบอกให้ Service Worker จัดการกับไฟล์รูปภาพระหว่างใช้งาน
  runtimeCaching: [{
    urlPattern: ({ request }) => request.destination === 'image',
    handler: 'CacheFirst',
    options: {
      cacheName: 'images-cache',
      expiration: {
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      },
    },
  }],

  ignoreURLParametersMatching: [
    /^utm_/,
    /^fbclid$/
  ]
};