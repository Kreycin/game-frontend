// src/components/CharacterIcon.jsx

import React from 'react';

const API_ENDPOINT = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';

const CharacterIcon = ({ characterData }) => {
  if (!characterData || !characterData.tier_list_character) {
    return null;
  }

  const character = characterData.tier_list_character;
  const expertBonus = characterData.expert_bonus;

  const imageUrl = character.icon?.url 
    ? character.icon.url 
    : 'https://via.placeholder.com/80';

  return (
    <div className="character-icon-container">
      <div className="character-image-wrapper">
        <img 
          src={imageUrl} 
          alt={character.name} 
          className="character-icon-image"
        />
        {/* --- เพิ่ม: แสดง Description (AOE) บนรูป --- */}
        {character.description && (
          <div className="character-desc-overlay">
            {character.description}
          </div>
        )}

        {expertBonus > 0 && (
          <div className="expert-tag">
            +{expertBonus}
          </div>
        )}
      </div>
      <div className="character-icon-name">{character.name}</div>
      {/* เราซ่อน description เดิมด้วย CSS ไปแล้ว */}
    </div>
  );
};

export default CharacterIcon;