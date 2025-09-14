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
  // --- [เพิ่ม] ส่วนสำหรับ Debug Mode ---
  const queryParams = new URLSearchParams(window.location.search);
  const debugMode = queryParams.get('debug');

  // --- [แก้ไข] ทำให้ State เริ่มต้นขึ้นอยู่กับ debugMode ---
  // ถ้า URL มี ?debug=splash, isServerWaking จะเป็น true ค้างไว้
  // ถ้าไม่มี, จะเป็น true ชั่วคราวแล้วเปลี่ยนเป็น false
  const [isServerWaking, setIsServerWaking] = useState(debugMode === 'splash' ? true : true);
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    if (debugMode === 'skeleton') {
      setIsServerWaking(false);
      return; // จบการทำงานของ useEffect ที่นี่
    }
    // --- [เพิ่ม] ถ้าอยู่ใน Debug Mode, ไม่ต้องทำอะไรเลย ---
    if (debugMode) {
      // ทำให้ข้อความยังเปลี่ยนไปเรื่อยๆ ใน debug mode
      const messageInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * loadingMessages.length);
        setCurrentMessage(loadingMessages[randomIndex]);
      }, 3000);
      return () => clearInterval(messageInterval);
    }

    // ฟังก์ชันสำหรับยิง API เพื่อปลุกเซิร์ฟเวอร์ (ทำงานเฉพาะเมื่อไม่อยู่ใน debug mode)
    const wakeUpServer = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:1337';
        fetch(`${backendUrl}/api/health-check`);
        
        setTimeout(() => {
          setIsServerWaking(false);
        }, 20000); // 40 วินาที

      } catch (e) {
        console.error("Server wake-up call failed:", e);
        setIsServerWaking(false);
      }
    };

    wakeUpServer();

    // Logic การเปลี่ยนข้อความทุก 3 วินาที
    const messageInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingMessages.length);
      setCurrentMessage(loadingMessages[randomIndex]);
    }, 3000);

    return () => clearInterval(messageInterval);
    
  }, [debugMode]); // --- [แก้ไข] เพิ่ม debugMode เข้าไปใน dependency array ---

  // --- [แก้ไข] เงื่อนไขการแสดง Splash Screen ---
  // ถ้า isServerWaking เป็น true (ไม่ว่าจะมาจาก debug mode หรือการรอปกติ) ให้แสดง Splash Screen
  if (isServerWaking) {
    return (
      <div className="splash-screen">
        <img src="/pwa-512x512.png" alt="App Logo" className="splash-logo" />
        <div className="spinner"></div>
        <p className="splash-message">{currentMessage}</p>
      </div>
    );
  }

  // เซิร์ฟเวอร์ตื่นแล้ว, แสดงหน้าเว็บจริง
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CharacterSheetPage />} />
      </Routes>
    </Router>
  );
}

export default App;
