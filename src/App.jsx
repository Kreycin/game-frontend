import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import CharacterSheetPage from './pages/CharacterSheetPage';
import './App.css';

// --- [เพิ่ม] รายชื่อ URL ของ GIF พื้นหลังที่คุณอัปโหลดไว้ ---
const backgroundGifs = [
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757866921/Demon_Slayer_GIF_hp1phc.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757866922/Demonslayer_Kimetsunoyaiba_GIF_by_KonnichiwaFestival_d3pltd.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757866922/gif-2_zm1eyw.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757866922/gif_q6kglz.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757866923/Kimetsu_No_Yaiba_Fight_GIF_by_iQiyi_gbctmk.gif',
  'https://res.cloudinary.com/di8bf7ufw/image/upload/v1757866923/Demonslayer_Zenitsu_GIF_a7tutn.gif',
  // เพิ่ม URL ของ GIF อื่นๆ ได้ที่นี่
];

// --- [แก้ไข] ปรับปรุงข้อความให้ดูดีขึ้น ---
const loadingMessages = [
  "Connecting to database...",
  "Summoning the latest data...",
  "Polishing character sheets...",
  "Almost there, hang tight!",
];

function App() {
  const [isServerWaking, setIsServerWaking] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);
  
  // --- [เพิ่ม] State สำหรับนับเวลาถอยหลังและเก็บ URL ของ GIF ---
  const [countdown, setCountdown] = useState(20);
  const [backgroundGif, setBackgroundGif] = useState('');

  useEffect(() => {
    // สุ่มเลือก GIF ตอนเริ่ม
    const randomGif = backgroundGifs[Math.floor(Math.random() * backgroundGifs.length)];
    setBackgroundGif(randomGif);

    // --- [อัปเกรด] ตรรกะการปลุกเซิร์ฟเวอร์แบบอัจฉริยะ ---
    const wakeUpServer = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:1337';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // รอแค่ 3 วินาที

      try {
        // ลองยิง health-check แบบมี timeout
        const response = await fetch(`${backendUrl}/api/health-check`, { signal: controller.signal });
        clearTimeout(timeoutId); // ยกเลิก timeout เพราะตอบกลับทัน

        if (response.ok) {
          // ถ้าเซิร์ฟเวอร์ตอบกลับทันที (Warm) => ข้ามหน้าโหลดไปเลย
          console.log("Server is warm. Skipping splash screen.");
          setIsServerWaking(false);
          return; // จบการทำงาน
        }
      } catch (e) {
        // ถ้า timeout หรือ error (Cold) => เริ่มนับถอยหลัง
        console.log("Server is cold. Starting countdown.");
        startCountdown();
      }
    };
    
    wakeUpServer();

    // ฟังก์ชันสำหรับเริ่มนับถอยหลังและเปลี่ยนข้อความ
    const startCountdown = () => {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsServerWaking(false); // เมื่อนับเสร็จ ให้ปิดหน้าโหลด
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // ทำงานทุก 1 วินาที

      const messageInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * loadingMessages.length);
        setCurrentMessage(loadingMessages[randomIndex]);
      }, 3000); // เปลี่ยนข้อความทุก 3 วินาที

      // Cleanup function
      return () => {
        clearInterval(countdownInterval);
        clearInterval(messageInterval);
      };
    };

  }, []); // ทำงานแค่ครั้งเดียว

  // --- [อัปเกรด] หน้า Splash Screen ใหม่ทั้งหมด ---
  if (isServerWaking) {
    return (
      <div className="splash-screen">
        {/* พื้นหลัง GIF แบบเต็มจอ */}
        <div 
          className="splash-background" 
          style={{ backgroundImage: `url(${backgroundGif})` }}
        ></div>
        {/* เนื้อหาที่ซ้อนทับ */}
        <div className="splash-content">
          <img src="/pwa-512x512.png" alt="App Logo" className="splash-logo" />
          <div className="spinner"></div>
          <p className="splash-message">{currentMessage}</p>
          {/* ตัวนับเวลาถอยหลัง */}
          <p className="splash-countdown">{countdown}</p>
        </div>
      </div>
    );
  }

  // เซิร์ฟเวอร์ตื่นแล้ว, แสดงหน้าเว็บจริง
  return (
    <Routes>
      <Route path="/" element={<CharacterSheetPage />} />
    </Routes>
  );
}

export default App;