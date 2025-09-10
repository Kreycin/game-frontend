// src/firebase.ts

import { initializeApp, getApp, getApps } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { getFirestore } from "firebase/firestore"; // <-- 1. Import Firestore เข้ามา

// Config สำหรับเชื่อมต่อ Firebase Project
// (ใช้ config เดียวกันได้เลยถ้าเป็น Project เดียวกัน)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_NOTI_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_NOTI_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_NOTI_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_NOTI_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_NOTI_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_NOTI_FIREBASE_APP_ID,
};

// Initialize App โดยป้องกันการสร้างซ้ำ
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// สร้าง instance ของ Messaging และ Firestore
const messaging = getMessaging(app);
const db = getFirestore(app); // <-- 2. สร้างตัวแปร db ขึ้นมา

/**
 * ฟังก์ชันสำหรับขอ FCM Token
 */
const getFcmToken = async (): Promise<string | null> => {
  const vapidKey = import.meta.env.VITE_NOTI_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    console.error("VITE_NOTI_FIREBASE_VAPID_KEY is not set in .env file!");
    return null;
  }
  
  try {
    const token = await getToken(messaging, { vapidKey });
    if (token) {
      console.log('FCM Token received:', token);
      return token;
    } else {
      console.warn('Notification permission not granted.');
      return null;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token:', err);
    return null;
  }
};

// --- 3. Export ทั้ง db และ getFcmToken ออกไป ---
export { db, getFcmToken };
