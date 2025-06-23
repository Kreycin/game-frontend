import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SkillCard from './components/SkillCard';
import VideoSection from './components/VideoSection';
import CollapsiblePanel from './components/CollapsiblePanel';
import StatItem from './components/StatItem';

const API_ENDPOINT = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_API_URL = `${API_ENDPOINT}/api/character-sheet`;

const getFullImageUrl = (relativeUrl) => {
  if (!relativeUrl) return null;
  return `${API_ENDPOINT}${relativeUrl}`;
};

const getStarLevelNumber = (starString) => {
  if (!starString) return 0;
  return parseInt(starString.replace('star', ''), 10);
};

const renderRichText = (richTextArray) => {
    if (!richTextArray) return null;
    return richTextArray.map((block, index) => (
      <p key={index}>{block.children.map(child => child.text).join('')}</p>
    ));
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  let videoId = null;
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    videoId = match[1];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

function App() {
  const [character, setCharacter] = useState(null);
  const [selectedStar, setSelectedStar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get(STRAPI_API_URL);
        const responseData = response.data.data;
        const charData = responseData && responseData.length > 0
            ? { id: responseData[0].id, ...responseData[0].attributes }
            : null;
        
        if (charData) {
           const sortedStarLevels = [...charData.Star_Levels].sort((a, b) => getStarLevelNumber(b.Star_Level) - getStarLevelNumber(a.Star_Level));
           charData.Star_Levels = sortedStarLevels;
           setCharacter(charData);
           if (sortedStarLevels.length > 0) {
             setSelectedStar(sortedStarLevels[0].Star_Level);
           }
        }
      } catch (err) {
        console.error(">>> DETAILED FETCH ERROR:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, []);

  if (loading) return <div className="loading-state">Loading character...</div>;
  if (error) return <div className="error-state">Error fetching data: {error.message}</div>;
  if (!character) return <div className="loading-state">No character data found.</div>;

  const selectedStarLevelData = character.Star_Levels.find(
    (level) => level.Star_Level === selectedStar
  );

  const currentEnhancements = selectedStarLevelData?.enhancements || [];
  const currentSkillDescriptions = selectedStarLevelData?.skill_descriptions || [];
  
  // <<< CORRECTED PATH >>>
  const mainArtUrl = getFullImageUrl(character.Main_Art?.url);
  const embedUrl = getYouTubeEmbedUrl(character.YouTube_URL);

  return (
    <div className="App">
      <div key={character.id} className="character-sheet-container">
        <header className="character-header layout-header">
           <div className="name-and-id">
              <h1>{character.Name}</h1>
              {character.Character_ID && <span className="character-id-tag">{character.Character_ID}</span>}
            </div>
          <div className="tags">
            <span className={`tag-rarity ${character.Rarity}`}>{character.Rarity}</span>
            <span className="tag-role">{character.Role}</span>
            {character.Element && <span className="tag-element">{character.Element}</span>}
          </div>
        </header>

        {mainArtUrl && (<img src={mainArtUrl} alt={character.Name} className="main-character-art layout-art"/>)}

        <CollapsiblePanel title="Main Stats (19★)" defaultExpanded={true} className="layout-main-stats">
          <div className="stats-grid">
            <StatItem label="ATK" value={character.ATK} />
            <StatItem label="DEF" value={character.DEF} />
            <StatItem label="HP" value={character.HP} />
            <StatItem label="SPD" value={character.SPD} />
          </div>
        </CollapsiblePanel>

        <CollapsiblePanel title="Special" defaultExpanded={false} className="layout-special-stats">
          <div className="stats-grid-special">
            <StatItem label="Lifesteal" value={character.Lifesteal} />
            <StatItem label="Penetration" value={character.Penetration} />
            <StatItem label="CRIT Rate" value={character.CRIT_rate} />
            <StatItem label="CRIT Res" value={character.CRIT_Res} />
            <StatItem label="Debuff Acc" value={character.Debuff_Acc} />
            <StatItem label="Debuff Res" value={character.Debuff_Res} />
            <StatItem label="Accuracy" value={character.Accuracy} />
            <StatItem label="Doge" value={character.Doge} />
            <StatItem label="Healing Amt" value={character.Healing_Amt} />
            <StatItem label="Healing Amt(P)" value={character.Healing_Amt_P} />
            <StatItem label="Extra DMG" value={character.Extra_DMG} />
            <StatItem label="DMG Res" value={character.DMG_Res} />
            <StatItem label="CRIT DMG Res" value={character.CRIT_DMG_Res} />
            <StatItem label="CRIT DMG" value={character.CRIT_DMG} />
          </div>
        </CollapsiblePanel>
        
        <div className="layout-skills">
          <div className="star-selector">
              {character.Star_Levels.map((level) => (
              <button
                  key={level.id}
                  className={`star-button ${selectedStar === level.Star_Level ? 'active' : ''}`}
                  onClick={() => setSelectedStar(level.Star_Level)}
              >
                  {getStarLevelNumber(level.Star_Level)}★
              </button>
              ))}
          </div>
          <section className="skills-grid">
            {currentSkillDescriptions.length > 0 ? (
              currentSkillDescriptions.map((skillDesc) => (
                <SkillCard key={skillDesc.id} skillDescription={skillDesc} getFullImageUrl={getFullImageUrl} />
              ))
            ) : (
              <p>No skills available for this star level.</p>
            )}
          </section>
        </div>

        <CollapsiblePanel title="Enhancements" className="layout-enhancements" defaultExpanded={true}>
            <div className="panel-content-inner">
                {currentEnhancements.length > 0 ? (
                    currentEnhancements.map((enh) => {
                    // <<< CORRECTED PATH >>>
                    const enhancementIconUrl = getFullImageUrl(enh.Enhancement_Icon?.url);
                    return (
                        <div key={enh.id} className="enhancement-item">
                        {enhancementIconUrl && (
                            <img src={enhancementIconUrl} alt="Enhancement Icon" className="enhancement-icon" />
                        )}
                        <div>{renderRichText(enh.Description)}</div>
                        </div>
                    )
                    })
                ) : (
                    <p>No enhancements for this star level.</p>
                )}
            </div>
        </CollapsiblePanel>

        <VideoSection embedUrl={embedUrl} className="layout-showcase" />
      </div>
    </div>
  );
}

export default App;