// src/components/CharacterIcon.jsx

import React from 'react';

const CharacterIcon = ({ characterData }) => {
  // ตรวจสอบข้อมูลเพื่อป้องกัน error
  if (!characterData || !characterData.tier_list_character) {
    return null;
  }

  // --- นี่คือส่วนที่แก้ไขให้ตรงกับข้อมูลจริง ---
  const character = characterData.tier_list_character;
  const expertBonus = characterData.expert_bonus;

  // เราจะดึง URL มาจาก character.icon.url โดยตรง
  const imageUrl = character.icon?.url 
    ? character.icon.url 
    : 'https://via.placeholder.com/80'; // รูปสำรอง
  // ------------------------------------------

  return (
    <div className="character-icon-container">
      <div className="character-image-wrapper">
        <img 
          src={imageUrl} 
          alt={character.name} 
          className="character-icon-image"
        />
        {expertBonus > 0 && (
          <div className="expert-tag">
            +{expertBonus}
          </div>
        )}
      </div>
      <div className="character-icon-name">{character.name}</div>
      <div className="character-icon-desc">{character.description}</div>
    </div>
  );
};

export default CharacterIcon;