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
  let videoId = '';
  if (url.includes('v=')) {
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
        const processedData = response.data.data.map(item => ({ id: item.id, ...item.attributes }));
        setCharacters(processedData);
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
  if (!characters || characters.length === 0) return <p>No character data found.</p>;

  return (
    <div className="App">
      {characters.map((char) => {
        const embedUrl = getYouTubeEmbedUrl(char.YouTube_URL);
        const mainArtUrl = char.Main_Art?.data?.attributes?.url;

        return (
          // ★★★ โครงสร้างใหม่ที่เรียบง่ายขึ้น ★★★
          <div key={char.id} className="character-sheet-container">

            <aside className="sidebar-area">
              {/* ★ นำ Main Art กลับเข้ามาไว้ใน Sidebar ★ */}
              <div className="character-art-area">
                {mainArtUrl && (<img src={mainArtUrl} alt={char.Name} className="main-character-art"/>)}
              </div>

              <CollapsiblePanel title="Main Stats" defaultExpanded={true}>
                <div className="stats-grid">
                  <StatItem label="ATK" value={char.ATK} />
                  <StatItem label="DEF" value={char.DEF} />
                  <StatItem label="HP" value={char.HP} />
                  <StatItem label="SPD" value={char.SPD} />
                </div>
              </CollapsiblePanel>

              <CollapsiblePanel title="Special" defaultExpanded={true}>
                <div className="stats-grid-special">
                  <StatItem label="Lifesteal" value={char.Lifesteal} />
                  {/* ... ใส่ StatItem ที่เหลือ ... */}
                </div>
              </CollapsiblePanel>

              <CollapsiblePanel title="Enhancements">
                  {char.enhancements && char.enhancements.map((enh) => {
                    const enhancementIconUrl = enh.Enhancement_Icon?.data?.attributes?.url;
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
            </aside>

            <main className="main-content-area">
              <header className="character-header-area">
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