// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CharacterSheetPage from './pages/CharacterSheetPage';
import './App.css';

// ชุดข้อความสำหรับหน้า Loading
const loadingMessages = [
  "Waking up the server...",
  "Connecting to the game world...",
  "Summoning the latest tier lists...",
  "Polishing character sheets...",
  "Almost there, hang tight!",
  "Assembling the heroes..."
];

function App() {
  // State นี้จะใช้สำหรับรอเซิร์ฟเวอร์ตื่นเท่านั้น
  const [isServerWaking, setIsServerWaking] = useState(true);
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    // ฟังก์ชันสำหรับยิง API เพื่อปลุกเซิร์ฟเวอร์
    const wakeUpServer = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:1337';
        // เราไม่จำเป็นต้องรอคำตอบ แค่ยิงไปเพื่อปลุก
        fetch(`${backendUrl}/api/health-check`);
        
        // ตั้งเวลาจำลองการรอเซิร์ฟเวอร์ตื่น (ปรับได้ตามจริง)
        // จาก Log ของเราคือประมาณ 40 วินาที
        setTimeout(() => {
          setIsServerWaking(false);
        }, 40000); // 40 วินาที

      } catch (e) {
        console.error("Server wake-up call failed:", e);
        setIsServerWaking(false); // ถ้า error ก็ให้ไปต่อเลย
      }
    };

    wakeUpServer();

    // Logic การเปลี่ยนข้อความทุก 3 วินาที
    const messageInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingMessages.length);
      setCurrentMessage(loadingMessages[randomIndex]);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, []);

  // ขั้นที่ 1: แสดง Splash Screen ขณะรอเซิร์ฟเวอร์ตื่น
  if (isServerWaking) {
    return (
      <div className="splash-screen">
        <img src="/pwa-512x512.png" alt="App Logo" className="splash-logo" />
        <div className="spinner"></div>
        <p className="splash-message">{currentMessage}</p>
      </div>
    );
  }

  // ขั้นที่ 2: เซิร์ฟเวอร์ตื่นแล้ว, แสดงหน้าเว็บจริง (ซึ่งจะโชว์ Skeleton ก่อน)
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CharacterSheetPage />} />
        {/* คุณสามารถเพิ่ม Route อื่นๆ สำหรับอนาคตได้ที่นี่ */}
      </Routes>
    </Router>
  );
}

export default App;