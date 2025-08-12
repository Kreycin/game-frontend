// src/components/CharacterTooltip.jsx

import React from 'react';
import '../styles/CharacterTooltip.css';

const CharacterTooltip = ({ character, expertInfo }) => {
  // ถ้าไม่มีข้อมูลตัวละคร ก็ไม่ต้องแสดงอะไรเลย
  if (!character) {
    return null;
  }

  return (
    <div className="tooltip-container">
      {/* Section: Character Name */}
      <div className="tooltip-section">
        <h3 className="tooltip-character-name">{character.name}</h3>
      </div>

      {/* Section: Expert Tag */}
      {expertInfo.expert_bonus > 0 && expertInfo.expert_tag_description && (
        <div className="tooltip-section">
          <h4>
            Expert Tag: +{expertInfo.expert_bonus}
          </h4>
          <p>{expertInfo.expert_tag_description}</p>
        </div>
      )}

      {/* Section: Condition */}
      {expertInfo.condition && (
        <div className="tooltip-section">
          <h4>
            Condition
            <span className="condition-tag">{expertInfo.condition}</span>
          </h4>
          <p>{expertInfo.condition_detail}</p>
        </div>
      )}

      {/* Section: Highlight */}
      {expertInfo.highlight && (
        <div className="tooltip-section">
          <h4>Highlight</h4>
          <p>{expertInfo.highlight}</p>
        </div>
      )}
    </div>
  );
};

export default CharacterTooltip;