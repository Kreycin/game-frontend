import React, { useState } from 'react';

// รับ API_ENDPOINT เข้ามาเป็น prop
const EffectItem = ({ effect, API_ENDPOINT }) => { 
  const [isExpanded, setIsExpanded] = useState(false);

  if (!effect) return null;

  const renderRichText = (richTextArray) => {
    if (!richTextArray) return null;
    return richTextArray.map((block, index) => (
      <p key={index}>{block.children.map(child => child.text).join('')}</p>
    ));
  };

  return (
    <div className="effect-item-in-skill">
      <div className="effect-header-clickable" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="effect-header-in-skill">
          {effect.Effect_Icon && (
            <img 
              // ใช้ API_ENDPOINT จาก prop
              src={`<span class="math-inline">\{API\_ENDPOINT\}</span>{effect.Effect_Icon.url}`} 
              alt={effect.Effect_Name} 
              className="effect-icon-in-skill" 
            />
          )}
          <span className="effect-name-in-skill">{effect.Effect_Name}</span>
        </div>
        <span className={`toggle-icon-small ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>

      <div className={`effect-details-collapsible ${isExpanded ? 'expanded' : ''}`}>
        <div className="effect-description-in-skill">
          {renderRichText(effect.Description)}
        </div>
      </div>
    </div>
  );
};

export default EffectItem;