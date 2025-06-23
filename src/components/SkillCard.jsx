import React, { useState } from 'react';

const renderRichText = (richTextArray) => {
    if (!richTextArray) return null;
    return richTextArray.map((block, index) => (
      <p key={index}>{block.children.map(child => child.text).join('')}</p>
    ));
};

// No longer need getFullImageUrl
const SkillCard = ({ skillDescription }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const baseSkill = skillDescription.skill;

  if (!baseSkill) return null;

  // <<< CORRECTED: Use the direct URL from API >>>
  const skillIconUrl = baseSkill.Skill_Icon?.url;
  const effects = baseSkill.effects || [];

  return (
    <div className={`skill-card-small ${isExpanded ? 'expanded' : ''}`}>
      <div className="skill-card-header-clickable" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="skill-icon-and-name">
          {skillIconUrl && <img src={skillIconUrl} alt={baseSkill.Skill_Name} className="skill-icon-small"/>}
          <h4 className="skill-name-small">{baseSkill.Skill_Name}</h4>
        </div>
        <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
      </div>
      
      {baseSkill.Skill_Level && <div className="skill-level-tag">Lv.{baseSkill.Skill_Level}</div>}

      <div className={`skill-details-collapsible ${isExpanded ? 'expanded' : ''}`}>
        <div className="details-inner">
            <div className="skill-type-small">{baseSkill.Skill_Type}</div>
            <div className="skill-description-small">
                {renderRichText(skillDescription.Description)}
            </div>
            {effects.length > 0 && (
                <div className="effects-list-in-skill">
                    <h5>Effects:</h5>
                    {effects.map(effect => {
                      // <<< CORRECTED: Use the direct URL from API >>>
                      const effectIconUrl = effect.Effect_Icon?.url;
                      return (
                            <div key={effect.id} className="effect-item-in-skill">
                                <div className="effect-header-in-skill">
                                    {effectIconUrl && <img src={effectIconUrl} alt={effect.Effect_Name} className="effect-icon-in-skill"/>}
                                    <span className="effect-name-in-skill">{effect.Effect_Name}</span>
                                </div>
                                <div className="effect-description-in-skill">
                                    {renderRichText(effect.Description)}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SkillCard;