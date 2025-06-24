// src/components/OverlayPage.jsx

import React from 'react';
import CountdownTimer from './CountdownTimer'; // 1. Import ตัวนับเวลาเข้ามา
import './OverlayPage.css';

// 2. รับ props ที่ชื่อ targetDate ที่ส่งมาจาก App.jsx
const OverlayPage = ({ targetDate }) => { 
  return (
    <div className="overlay-container">

      {/* ส่วนที่ 1: แสดงตัวนับเวลา */}
      <div className="overlay-header">
        <CountdownTimer 
          targetDate={targetDate} 
          prefixText="Countdown Time" // 3. กำหนดข้อความนำหน้าตามที่คุณต้องการ
        />
      </div>

      {/* ส่วนที่ 2: พื้นที่สำหรับรูปภาพ */}
      <div className="overlay-image-container">
        {/* <<< ในอนาคต คุณสามารถใส่ <img> tag ของคุณตรงนี้ได้เลย >>>
          เช่น: <img src="URL_ของรูปภาพ" alt="Special Event" />
        */}
        <span className="image-placeholder-text">Image</span>
      </div>

    </div>
  );
};

export default OverlayPage;