// src/components/InstallGuideModal.jsx

import React from 'react';
import './InstallGuideModal.css';
import menuIcon from '../assets/dots-vertical.svg'; // เราจะสร้างไฟล์ไอคอนนี้ต่อ
import addToHomeIcon from '../assets/add-to-home.svg'; // และไฟล์นี้ด้วย

const InstallGuideModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>วิธีติดตั้งแอปพลิเคชัน</h2>
        <p>สำหรับ Android คุณสามารถติดตั้งแอปนี้ลงบนเครื่องเพื่อการเข้าถึงที่รวดเร็วขึ้นได้</p>
        <div className="instructions">
          <div className="step">
            <span className="step-number">1</span>
            <p>แตะที่ปุ่มเมนู (ไอคอนจุดสามจุด) ที่มุมขวาบนของเบราว์เซอร์ Chrome</p>
            <img src={menuIcon} alt="Menu Icon" className="instruction-icon" />
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <p>เลือกเมนู "เพิ่มลงในหน้าจอหลัก" หรือ "ติดตั้งแอป"</p>
            <img src={addToHomeIcon} alt="Add to Home Screen Icon" className="instruction-icon larger" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallGuideModal;