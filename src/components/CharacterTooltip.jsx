// src/components/CharacterTooltip.jsx

import React from 'react';
import '../styles/CharacterTooltip.css';

const CharacterTooltip = ({ character }) => {
  // ถ้าไม่มีข้อมูลตัวละคร ก็ไม่ต้องแสดงอะไรเลย
  if (!character) {
    return null;
  }

  return (
    <div className="tooltip-container">
      {/* Section: Description */}
      {character.description && (
        <div className="tooltip-section">
          <h4>Description</h4>
          <p>{character.description}</p>
        </div>
      )}

      {/* Section: Condition */}
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

      {/* Section: Highlight */}
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