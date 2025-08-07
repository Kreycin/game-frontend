// src/components/CharacterIcon.jsx

import React from 'react';

const API_ENDPOINT = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

const CharacterIcon = ({ characterData }) => {
  // ตรวจสอบข้อมูลเพื่อป้องกัน error (เหมือนเดิม)
  if (!characterData || !characterData.tier_list_character || !characterData.tier_list_character.attributes) {
    return null;
  }

  const character = characterData.tier_list_character.attributes;
  const expertBonus = characterData.expert_bonus;

  // --- นี่คือ Logic ใหม่ที่แก้ไขแล้ว ---
  let imageUrl = 'https://via.placeholder.com/80'; // รูปสำรองเริ่มต้น
  const rawUrl = character.icon?.data?.attributes?.url;

  if (rawUrl) {
    // ตรวจสอบว่า URL ที่ได้มาขึ้นต้นด้วย 'http' (เป็น URL เต็ม) หรือไม่
    if (rawUrl.startsWith('http')) {
      imageUrl = rawUrl; // ถ้าใช่ (มาจาก Cloudinary) ให้ใช้ URL นั้นเลย
    } else {
      imageUrl = `${API_ENDPOINT}${rawUrl}`; // ถ้าไม่ใช่ (มาจาก Local) ให้เติม API_ENDPOINT ข้างหน้า
    }
  }
  // ------------------------------------

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