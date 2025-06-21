import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SkillCard from './components/SkillCard';
import VideoSection from './components/VideoSection';
import CollapsiblePanel from './components/CollapsiblePanel';
import StatItem from './components/StatItem';

const API_ENDPOINT = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_API_URL = `${API_ENDPOINT}/api/character-sheet`;

const renderRichText = (richTextArray) => {
    if (!richTextArray) return null;
    if (typeof richTextArray === 'string') return <p>{richTextArray}</p>;
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
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get(STRAPI_API_URL);
        const processedData = response.data.data.map(item => ({ id: item.id, ...item.attributes }));
        setCharacters(processedData);
      } catch (err) {
        console.error(">>> DETAILED FETCH ERROR:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  if (loading) return <p>Loading characters...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;
  if (!characters || characters.length === 0) return <p>No character data found.</p>;

  return (
    <div className="App">
      {characters.map((char) => {
        const embedUrl = getYouTubeEmbedUrl(char.YouTube_URL);
        const mainArtUrl = char.Main_Art?.url;

        return (
          <div key={char.id} className="character-sheet-container">
            {/* We add specific classNames to each element for precise CSS grid control */}
            <header className="character-header layout-header">
              <h1>{char.Name}</h1>
              <div className="tags">
                <span className={`tag-rarity ${char.Rarity}`}>{char.Rarity}</span>
                <span className="tag-role">{char.Role}</span>
              </div>
            </header>

            {mainArtUrl && (<img src={mainArtUrl} alt={char.Name} className="main-character-art layout-art"/>)}

            <CollapsiblePanel title="Main Stats" defaultExpanded={false} className="layout-main-stats">
              <div className="stats-grid">
                <StatItem label="ATK" value={char.ATK} />
                <StatItem label="DEF" value={char.DEF} />
                <StatItem label="HP" value={char.HP} />
                <StatItem label="SPD" value={char.SPD} />
              </div>
            </CollapsiblePanel>

            <CollapsiblePanel title="Special" defaultExpanded={false} className="layout-special-stats">
              <div className="stats-grid-special">
                <StatItem label="Lifesteal" value={char.Lifesteal} />
                <StatItem label="Penetration" value={char.Penetration} />
                <StatItem label="CRIT Rate" value={char.CRIT_rate} />
                <StatItem label="CRIT Res" value={char.CRIT_Res} />
                <StatItem label="Debuff Acc" value={char.Debuff_Acc} />
                <StatItem label="Debuff Res" value={char.Debuff_Res} />
                <StatItem label="Accuracy" value={char.Accuracy} />
                <StatItem label="Doge" value={char.Doge} />
                <StatItem label="Healing Amt" value={char.Healing_Amt} />
                <StatItem label="Healing Amt(P)" value={char.Healing_Amt_P} />
                <StatItem label="Extra DMG" value={char.Extra_DMG} />
                <StatItem label="DMG Res" value={char.DMG_Res} />
                <StatItem label="CRIT DMG Res" value={char.CRIT_DMG_Res} />
                <StatItem label="CRIT DMG" value={char.CRIT_DMG} />
              </div>
            </CollapsiblePanel>

            <section className="skills-grid layout-skills">
              {char.skills && char.skills.length > 0 ? (
                char.skills.map((skill) => (<SkillCard key={skill.id} skill={skill} />))
              ) : (
                <p>No skills available.</p>
              )}
            </section>

            <CollapsiblePanel title="Enhancements" className="layout-enhancements">
                {char.enhancements && char.enhancements.map((enh) => {
                  const enhancementIconUrl = enh.Enhancement_Icon?.url;
                  return (
                    <div key={enh.id} className="enhancement-item">
                      {enhancementIconUrl && (
                        <img src={enhancementIconUrl} alt="Enhancement Icon" className="enhancement-icon" />
                      )}
                      <div>{renderRichText(enh.Description)}</div>
                    </div>
                  )
                })}
            </CollapsiblePanel>

            <VideoSection embedUrl={embedUrl} className="layout-showcase" />
          </div>
        )
      })}
    </div>
  );
}

export default App;
