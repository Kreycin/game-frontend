// src/components/CharacterTooltip.jsx

import React from 'react';
import '../styles/CharacterTooltip.css'; // <-- ตรวจสอบว่ามีการ import บรรทัดนี้

const CharacterTooltip = ({ character }) => {
  if (!character) {
    return null;
  }

  return (
    <div className="tooltip-container">
      {character.description && (
        <div className="tooltip-section">
          <h4>Description</h4>
          <p>{character.description}</p>
        </div>
      )}

      {character.condition_detail && (
        <div className="tooltip-section">
          <h4>
            Condition
            {character.condition && (
              <span className="condition-tag">{character.condition}</span>
            )}
          </h4>
          <p>{character.condition_detail}</p>
        </div>
      )}

      {character.highlight && (
        <div className="tooltip-section">
          <h4>Highlight</h4>
          <p>{character.highlight}</p>
        </div>
      )}
    </div>
  );
};

export default CharacterTooltip;