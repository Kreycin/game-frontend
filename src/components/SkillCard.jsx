import React, { useState } from 'react';
import EffectItem from './EffectItem';

const SkillCard = ({ skill }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!skill) return null;
  // ★★★ แก้ไขการเข้าถึง URL ให้เรียบง่ายและถูกต้อง ★★★
  const iconUrl = skill.Skill_Icon?.[0]?.url;

  const renderRichText = (richTextArray) => {
    // ... (เหมือนเดิม)
  };

  return (
    <div className={`skill-card-small ${isExpanded ? 'expanded' : ''}`}>
      <span className="skill-level-tag">Lv.3</span>
      <div className="skill-card-header-clickable" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="skill-icon-and-name">
          {iconUrl && (
            <img 
              src={iconUrl} 
              alt={skill.Skill_Name} 
              className="skill-icon-small"
            />
          )}
          <h4 className="skill-name-small">{skill.Skill_Name}</h4>
        </div>
        <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>
      
      <div className="skill-details-collapsible">
        {/* ... (เหมือนเดิม) ... */}
      </div>
    </div>
  );
};
export default SkillCard;