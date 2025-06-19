import React, { useState } from 'react';

// Component ใหม่สำหรับจัดการ Effect แต่ละอันใน Glossary
const EffectGlossaryItem = ({ effect }) => {
  const API_BASE_URL = 'http://localhost:1337';
  // สร้าง state เพื่อจัดการการเปิด/ปิด ของตัวเอง
  const [isExpanded, setIsExpanded] = useState(false);

  // ฟังก์ชันสำหรับแสดงผล Rich Text
  const renderRichText = (richTextArray) => {
    if (!richTextArray) return null;
    if (typeof richTextArray === 'string') return <p>{richTextArray}</p>;
    return richTextArray.map((block, index) => (
      <p key={index}>{block.children.map(child => child.text).join('')}</p>
    ));
  };

  return (
    <div className="effect-glossary-item">
      {/* ทำให้ส่วนหัวทั้งหมดกดได้ */}
      <div className="effect-header-clickable" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="effect-header">
          {effect.Effect_Icon && (
            <img src={`${API_BASE_URL}${effect.Effect_Icon.url}`} alt={effect.Effect_Name} className="effect-icon" />
          )}
          <span className="effect-name">{effect.Effect_Name}</span>
        </div>
        {/* ไอคอนสำหรับบอกสถานะเปิด/ปิด */}
        <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>

      {/* แสดงคำอธิบายก็ต่อเมื่อ isExpanded เป็น true */}
      {isExpanded && (
        <div className="effect-description">
          {renderRichText(effect.Description)}
        </div>
      )}
    </div>
  );
};

export default EffectGlossaryItem;
