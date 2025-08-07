// src/components/CharacterIcon.jsx

import React, { useState } from 'react';
import CharacterTooltip from './CharacterTooltip'; // 1. Import Tooltip เข้ามา

const CharacterIcon = ({ characterData }) => {
  const [isHovering, setIsHovering] = useState(false); // 2. สร้าง State สำหรับจัดการการโฮเวอร์

  if (!characterData || !characterData.tier_list_character) {
    return null;
  }

  const character = characterData.tier_list_character;
  const expertBonus = characterData.expert_bonus;

  const imageUrl = character.icon?.url 
    ? character.icon.url 
    : 'https://via.placeholder.com/80';

  return (
    <div 
      className="character-icon-container"
      // 3. เพิ่ม Event Listeners สำหรับการโฮเวอร์
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="character-image-wrapper">
        <img 
          src={imageUrl} 
          alt={character.name} 
          className="character-icon-image"
        />

        {/* ป้าย Description (AOE) */}
        {character.description && (
          <div className="character-desc-overlay">
            {character.description}
          </div>
        )}

        {/* 4. เพิ่มป้าย Condition (H+) */}
        {character.condition && (
          <div className="character-condition-overlay">
            {character.condition}
          </div>
        )}

        {expertBonus > 0 && (
          <div className="expert-tag">
            +{expertBonus}
          </div>
        )}

        {/* 5. แสดง Tooltip เมื่อ isHovering เป็น true */}
        {isHovering && <CharacterTooltip character={character} />}
      </div>
      <div className="character-icon-name">{character.name}</div>
    </div>
  );
};

export default CharacterIcon;