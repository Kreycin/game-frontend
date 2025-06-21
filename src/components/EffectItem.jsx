import React, { useState } from 'react';

const EffectItem = ({ effect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!effect) return null;
  // ★★★ แก้ไขการเข้าถึง URL ให้เรียบง่ายและถูกต้อง ★★★
  const iconUrl = effect.Effect_Icon?.url;

  const renderRichText = (richTextArray) => {
      // ... (เหมือนเดิม)
  };

  return (
    <div className="effect-item-in-skill">
      <div className="effect-header-clickable" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="effect-header-in-skill">
          {iconUrl && (
            <img 
              src={iconUrl}
              alt={effect.Effect_Name} 
              className="effect-icon-in-skill" 
            />
          )}
          <span className="effect-name-in-skill">{effect.Effect_Name}</span>
        </div>
        <span className={`toggle-icon-small ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>
      
      <div className={`effect-details-collapsible ${isExpanded ? 'expanded' : ''}`}>
        {/* ... (เหมือนเดิม) ... */}
      </div>
    </div>
  );
};
export default EffectItem;