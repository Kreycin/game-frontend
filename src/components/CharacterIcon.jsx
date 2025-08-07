// src/components/CharacterIcon.jsx

import React from 'react';

const API_ENDPOINT = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

const CharacterIcon = ({ characterData }) => {
  // ตรวจสอบข้อมูลเพื่อป้องกัน error
  // ถ้าไม่มีข้อมูลตัวละคร หรือไม่มีข้อมูลที่ซ้อนอยู่ข้างใน ก็ไม่ต้องแสดงอะไรเลย
  if (!characterData || !characterData.tier_list_character || !characterData.tier_list_character.attributes) {
    return null;
  }

  const character = characterData.tier_list_character.attributes;
  const expertBonus = characterData.expert_bonus;

  // ตรวจสอบว่ามี icon และ url ของ icon หรือไม่ ถ้าไม่มีให้ใช้รูปสำรอง
  const imageUrl = character.icon && character.icon.data && character.icon.data.attributes.url
    ? `${API_ENDPOINT}${character.icon.data.attributes.url}`
    : 'https://via.placeholder.com/80'; // รูปสำรองขนาด 80x80

  return (
    <div className="character-icon-container">
      <div className="character-image-wrapper">
        <img 
          src={imageUrl} 
          alt={character.name} 
          className="character-icon-image"
        />
        {/* เงื่อนไข: แสดง Expert Tag ก็ต่อเมื่อมีค่ามากกว่า 0 */}
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