import React, { useState, useEffect } from 'react';
import CharacterSheetPage from './pages/CharacterSheetPage';
import './App.css';

const backgroundGifs = [
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757866921/Demon_Slayer_GIF_hp1phc.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757866922/Demonslayer_Kimetsunoyaiba_GIF_by_KonnichiwaFestival_d3pltd.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757866922/gif-2_zm1eyw.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757866922/gif_q6kglz.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757866923/Kimetsu_No_Yaiba_Fight_GIF_by_iQiyi_gbctmk.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757866923/Demonslayer_Zenitsu_GIF_a7tutn.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757869588/200_d9sx3t.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757869588/giphy_3_mhjuaj.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757869589/giphy_4_klcnem.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757869589/giphy_2_kmaoj1.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757869589/giphy_dbsf7d.gif',
];
const loadingMessages = [
  "Connecting to database...",
  "Polishing character sheets...",
  "Almost there, hang tight!",
  "Waking the server up",
  "Tip: iOS — Add this website with Add to Home Screen to receive notifications from us",
  "Tip: Android — Install this website to receive notifications from us",
  "New characters will always be updated — please stay tuned every month",
  "Since the server is limited, we have to shut it down whenever there are no users",
  "We still have many features not yet added—stay tuned for our notifications.",
  "Kreycin is the developer of the website",
  "Lefty is the one who provides the tier lists and character builds",
  "We’re always open to new ideas — contact Kreycin",




];

function App() {
  const [isServerWaking, setIsServerWaking] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  const [countdown, setCountdown] = useState(30);
  const [backgroundGif, setBackgroundGif] = useState('');

  useEffect(() => {
    const randomGif = backgroundGifs[Math.floor(Math.random() * backgroundGifs.length)];
    setBackgroundGif(randomGif);

    const wakeUpServer = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl) {
        console.error("VITE_BACKEND_URL is not set! Starting cold start sequence as a fallback.");
        startCountdown();
        return;
      }
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      try {
        const response = await fetch(`${backendUrl}/api/health-check`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (response.ok) {
          console.log("Server is warm. Skipping splash screen.");
          setIsServerWaking(false);
        } else {
          // ถ้าเซิร์ฟเวอร์ตอบกลับแต่ไม่สำเร็จ (เช่น 503) ให้เริ่มนับถอยหลัง
          console.log("Server responded with an error. Starting countdown.");
          startCountdown();
        }
        // ถ้า response ไม่ ok แต่ตอบกลับ ก็ยังถือว่า cold start
        startCountdown();
      } catch (e) {
        console.log("Server is cold or unreachable. Starting countdown.");
        startCountdown();
      }
    };
    
    const startCountdown = () => {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsServerWaking(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const messageInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * loadingMessages.length);
        setCurrentMessage(loadingMessages[randomIndex]);
      }, 3000);

      return () => {
        clearInterval(countdownInterval);
        clearInterval(messageInterval);
      };
    };

    wakeUpServer();

  }, []);

  // ถ้าเซิร์ฟเวอร์กำลังตื่น => แสดง Splash Screen
  if (isServerWaking) {
    return (
      <div className="splash-screen">
        <div 
          className="splash-background" 
          style={{ backgroundImage: `url(${backgroundGif})` }}
        ></div>
        <div className="splash-content">
          <img src="/pwa-512x512.png" alt="App Logo" className="splash-logo" />
          <div className="spinner"></div>
          <p className="splash-message">{currentMessage}</p>
          <p className="splash-countdown">{countdown}</p>
        </div>
      </div>
    );
  }

  // ถ้าเซิร์ฟเวอร์ตื่นแล้ว => แสดงหน้า CharacterSheetPage
  // ไม่ต้องมี <Router> หรือ <Routes> ที่นี่ เพราะ main.jsx จัดการให้แล้ว
  return <CharacterSheetPage />;
}

export default App;