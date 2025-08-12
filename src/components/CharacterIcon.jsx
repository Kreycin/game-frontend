// src/components/CharacterIcon.jsx

import React, { useState } from 'react';
import CharacterTooltip from './CharacterTooltip';

const CharacterIcon = ({ characterData }) => {
  const [isHovering, setIsHovering] = useState(false);

  if (!characterData || !characterData.tier_list_character) {
    return null;
  }

  // --- ส่วนแก้ไข: แยกข้อมูลออกเป็น 2 ส่วน ---
  const character = characterData.tier_list_character; // ข้อมูลพื้นฐาน (name, icon)
  const expertInfo = characterData; // ข้อมูลที่กรอกใน Tier List (expert_bonus, condition, etc.)

  const imageUrl = character.icon?.url 
    ? character.icon.url 
    : 'https://via.placeholder.com/80';

  return (
    <div 
      className="character-icon-container"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={`character-image-wrapper ${isHovering ? 'hovering' : ''}`}>
        <img 
          src={imageUrl} 
          alt={character.name} 
          className="character-icon-image"
        />

        {/* ป้าย Condition (จะดึงมาจาก expertInfo) */}
        {expertInfo.condition && (
          <div className="character-condition-overlay">
            {expertInfo.condition}
          </div>
        )}

        {expertInfo.expert_bonus > 0 && (
          <img 
            src="/expert-icon.png" 
            alt="Expert Tag" 
            className="expert-icon" 
          />
        )}

        {/* --- ส่วนแก้ไข: ส่ง props 2 ตัวเข้าไปใน Tooltip --- */}
        <CharacterTooltip character={character} expertInfo={expertInfo} />
      </div>
    </div>
  );
};

export default CharacterIcon;