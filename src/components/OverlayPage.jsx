// src/components/OverlayPage.jsx

import React from 'react';
import './OverlayPage.css'; // เราจะสร้างไฟล์ CSS นี้ในขั้นตอนต่อไป

const OverlayPage = () => {
  return (
    <div className="overlay-container">
      <div className="overlay-content">
        <h1>Under Maintenance</h1>
        <p>We are currently performing maintenance. Please check back later.</p>
        <p>ขออภัยในความไม่สะดวก ขณะนี้เว็บไซต์กำลังปิดปรับปรุง</p>
      </div>
    </div>
  );
};

export default OverlayPage;