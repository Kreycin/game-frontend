import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SkillCard from './components/SkillCard';
import VideoSection from './components/VideoSection';
import CollapsiblePanel from './components/CollapsiblePanel'; // ★★★ Import Component ใหม่ ★★★

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
  let videoId = '';
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1];
  }
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return null;
};

function App() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get(STRAPI_API_URL);
        setCharacters(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  if (loading) return <p>Loading characters...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <div className="App">
      {characters.map((char) => {
        const embedUrl = getYouTubeEmbedUrl(char.YouTube_URL);

        return (
          <div key={char.id} className="character-sheet-container">
            <aside className="left-sidebar">
              {char.Main_Art && (<img src={`http://localhost:1337${char.Main_Art.url}`} alt={char.Name} className="main-character-art"/>)}
              
              {/* ★★★ เรียกใช้ CollapsiblePanel ที่นี่ ★★★ */}
              <CollapsiblePanel title="Main Stats" defaultExpanded={false}>
                <div className="stats-grid">
                  <div className="stat-item"><span>ATK</span><strong>{char.ATK}</strong></div>
                  <div className="stat-item"><span>DEF</span><strong>{char.DEF}</strong></div>
                  <div className="stat-item"><span>HP</span><strong>{char.HP}</strong></div>
                  <div className="stat-item"><span>SPD</span><strong>{char.SPD}</strong></div>
                </div>
              </CollapsiblePanel>

              <CollapsiblePanel title="Special" defaultExpanded={false}>
                <div className="stats-grid-special">
                  <div className="stat-item"><span>Lifesteal</span><strong>{char.Lifesteal}</strong></div>
                  <div className="stat-item"><span>Penetration</span><strong>{char.Penetration}</strong></div>
                  <div className="stat-item"><span>CRIT Rate</span><strong>{char.CRIT_rate}</strong></div>
                  <div className="stat-item"><span>CRIT Res</span><strong>{char.CRIT_Res}</strong></div>
                  <div className="stat-item"><span>Debuff Acc</span><strong>{char.Debuff_Acc}</strong></div>
                  <div className="stat-item"><span>Debuff Res</span><strong>{char.Debuff_Res}</strong></div>
                  <div className="stat-item"><span>Accuracy</span><strong>{char.Accuracy}</strong></div>
                  <div className="stat-item"><span>Doge</span><strong>{char.Doge}</strong></div>
                  <div className="stat-item"><span>Healing Amt</span><strong>{char.Healing_Amt}</strong></div>
                  <div className="stat-item"><span>Healing Amt(P)</span><strong>{char.Healing_Amt_P}</strong></div>
                  <div className="stat-item"><span>Extra DMG</span><strong>{char.Extra_DMG}</strong></div>
                  <div className="stat-item"><span>DMG Res</span><strong>{char.DMG_Res}</strong></div>
                  <div className="stat-item"><span>CRIT DMG Res</span><strong>{char.CRIT_DMG_Res}</strong></div>
                  <div className="stat-item"><span>CRIT DMG</span><strong>{char.CRIT_DMG}</strong></div>
                </div>
              </CollapsiblePanel>

              <CollapsiblePanel title="Enhancements">
                  {char.enhancements && char.enhancements.map((enh) => (
                    <div key={enh.id} className="enhancement-item">
                      {enh.Enhancement_Icon && enh.Enhancement_Icon.length > 0 && (
                        <img 
                          src={`http://localhost:1337${enh.Enhancement_Icon[0].url}`} 
                          alt="Enhancement Icon" 
                          className="enhancement-icon"
                        />
                      )}
                      <div>{renderRichText(enh.Description)}</div>
                    </div>
                  ))}
              </CollapsiblePanel>

            </aside>

            <main className="main-content">
              <header className="character-header">
                <h1>{char.Name}</h1>
                <div className="tags">
                  <span className={`tag-rarity ${char.Rarity}`}>{char.Rarity}</span>
                  <span className="tag-role">{char.Role}</span>
                </div>
              </header>
              
              <section className="skills-grid">
                {char.skills && char.skills.length > 0 ? (
                  char.skills.map((skill) => (<SkillCard key={skill.id} skill={skill} />))
                ) : (
                  <p>No skills available.</p>
                )}
              </section>

              <VideoSection embedUrl={embedUrl} />
              
            </main>
          </div>
        )
      })}
    </div>
  );
}

export default App;
