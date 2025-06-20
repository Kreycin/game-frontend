// path: game-frontend/src/components/EffectItem.jsx
import React, { useState } from 'react';

const EffectItem = ({ effect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!effect) return null;

  // ดึง URL ของไอคอนออกมา
  const iconUrl = effect.Effect_Icon?.data?.attributes?.url;

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
          {iconUrl && (
            <img 
              src={iconUrl} // ★★★ ใช้ URL เต็มจาก Cloudinary โดยตรง ★★★
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