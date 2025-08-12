// src/components/CharacterIcon.jsx

import React, { useState } from 'react';
import CharacterTooltip from './CharacterTooltip';

const CharacterIcon = ({ characterData }) => {
  const [isHovering, setIsHovering] = useState(false);

  if (!characterData || !characterData.tier_list_character) {
    return null;
  }

  const character = characterData.tier_list_character;
  const expertInfo = characterData;

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

        {character.description && (
          <div className="character-desc-overlay">
            {character.description}
          </div>
        )}

        {/* --- แก้ไข: เปลี่ยนจาก Div เป็น Img --- */}
        {expertInfo.condition && (
          <img 
            src="/condition-icon.png" 
            alt="Condition Tag" 
            className="character-condition-icon" 
          />
        )}

        {expertInfo.expert_bonus > 0 && (
          <img 
            src="/expert-icon.png" 
            alt="Expert Tag" 
            className="expert-icon" 
          />
        )}

        <CharacterTooltip character={character} expertInfo={expertInfo} />
      </div>
    </div>
  );
};

export default CharacterIcon;