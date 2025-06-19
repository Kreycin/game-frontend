import React, { useState } from 'react';

// Component ใหม่สำหรับจัดการ Effect แต่ละอันโดยเฉพาะ
const EffectItem = ({ effect }) => {
  const API_BASE_URL = 'http://localhost:1337';
  // สร้าง state 'isExpanded' ของตัวเอง เพื่อจัดการการเปิด/ปิด
  const [isExpanded, setIsExpanded] = useState(false);

  if (!effect) return null;

  const renderRichText = (richTextArray) => {
    if (!richTextArray) return null;
    return richTextArray.map((block, index) => (
      <p key={index}>{block.children.map(child => child.text).join('')}</p>
    ));
  };

  return (
    <div className="effect-item-in-skill">
      {/* ทำให้ส่วนหัวทั้งหมดกดได้ */}
      <div className="effect-header-clickable" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="effect-header-in-skill">
          {effect.Effect_Icon && (
            <img 
              src={`${API_BASE_URL}${effect.Effect_Icon.url}`} 
              alt={effect.Effect_Name} 
              className="effect-icon-in-skill" 
            />
          )}
          <span className="effect-name-in-skill">{effect.Effect_Name}</span>
        </div>
        <span className={`toggle-icon-small ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>
      
      {/* ส่วนนี้จะแสดงก็ต่อเมื่อ isExpanded เป็น true */}
      <div className={`effect-details-collapsible ${isExpanded ? 'expanded' : ''}`}>
        <div className="effect-description-in-skill">
          {renderRichText(effect.Description)}
        </div>
      </div>
    </div>
  );
};

export default EffectItem;
