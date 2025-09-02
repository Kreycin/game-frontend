// public/firebase-messaging-sw.js

// Import scripts for Firebase
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// Your correct Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzvdcPmv3KAySs1SwbHC7AtesAw7HFbKM",
  authDomain: "characterchat-1501e.firebaseapp.com",
  projectId: "characterchat-1501e",
  storageBucket: "characterchat-1501e.appspot.com", // Corrected from .firebasestorage.app
  messagingSenderId: "269692914059",
  appId: "1:269692914059:web:210dec6c8899ca22b9c78e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

/**
 * This is the standard, more reliable way to handle push notifications.
 * It listens for the 'push' event directly.
 */
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received.');

  let payload;
  try {
    // The data sent from Firebase is a JSON string.
    payload = event.data.json();
    console.log('[Service Worker] Push data payload: ', payload);
  } catch (e) {
    console.error('[Service Worker] Push event data could not be parsed as JSON.', e);
    // If the data is not JSON, we can't process it.
    return;
  }

  // Extract notification data from the payload.
  // Firebase Console sends data in a 'notification' object.
  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new message.',
    icon: payload.notification.icon || '/pwa-192x192.png',
    // You can add more options here like badge, actions, etc.
  };

  // This tells the browser to wait until the notification is shown.
  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});
