import React, { useState } from 'react';
import EffectItem from './EffectItem';

const SkillCard = ({ skill }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!skill) return null;

  const iconUrl = skill.Skill_Icon?.[0]?.url; // ★★★ แก้ไขตรงนี้ ★★★

  const renderRichText = (richTextArray) => {
    if (!richTextArray) return null;
    if (typeof richTextArray === 'string') return <p>{richTextArray}</p>;
    return richTextArray.map((block, index) => (
      <p key={index}>{block.children.map(child => child.text).join('')}</p>
    ));
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
        <p className="skill-type-small">{skill.Skill_Type}</p>
        <div className="skill-description-small">
          {renderRichText(skill.Skill_Description)}
        </div>
        {skill.skill_effects && skill.skill_effects.length > 0 && (
            <div className="effects-list-in-skill">
              {skill.skill_effects.map((effect) => (
                <EffectItem key={effect.id} effect={effect} />
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

export default SkillCard;