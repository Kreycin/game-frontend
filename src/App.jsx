import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

import './App.css';
import SkillCard from './components/SkillCard';
import VideoSection from './components/VideoSection';
import CollapsiblePanel from './components/CollapsiblePanel';
import StatItem from './components/StatItem';
import CountdownTimer from './components/CountdownTimer';
import OverlayPage from './components/OverlayPage';
import CommentSection from './components/CommentSection'; // ตรวจสอบว่าเป็น .tsx หรือ .jsx
import { useAuth } from './context/AuthContext'; // Import useAuth

const API_ENDPOINT = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_API_URL = `${API_ENDPOINT}/api/character-sheet`;

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
  const { loading: authLoading } = useAuth(); // ดึงสถานะ loading จาก AuthContext
  const targetCountdownDate = '2025-07-30T23:00:00+07:00';
  const isOverlayActive = import.meta.env.VITE_OVERLAY_MODE === 'true';

  // ลบ state และ useEffect ที่เกี่ยวกับ user/guest ออกทั้งหมด
  
  if (isOverlayActive) {
    return <OverlayPage targetDate={targetCountdownDate} />;
  }
  
  const [character, setCharacter] = useState(null);
  const [selectedStar, setSelectedStar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleExportAsImage = () => {
    if (!character) return;
    const elementToCapture = document.getElementById('character-sheet-container');
    if (elementToCapture) {
      const watermark = document.createElement('div');
      watermark.innerText = 'Made by Kreycin';
      watermark.style.position = 'absolute';
      watermark.style.right = '45px';
      watermark.style.bottom = '10px';
      watermark.style.fontSize = '12px';
      watermark.style.color = 'rgba(255, 255, 255, 0.4)';
      watermark.style.zIndex = '9999';
      watermark.style.pointerEvents = 'none';
      elementToCapture.appendChild(watermark);

      html2canvas(elementToCapture, {
        backgroundColor: '#1a1a1a',
        useCORS: true,
        scale: 2,
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${character.Name || 'character-sheet'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        elementToCapture.removeChild(watermark);
      }).catch(err => {
        console.error("Error during canvas generation:", err);
        elementToCapture.removeChild(watermark);
      });
    }
  };

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get(`${STRAPI_API_URL}?timestamp=${new Date().getTime()}`);
        const allCharacters = response.data.data;
        if (allCharacters && allCharacters.length > 0) {
          const latestCharData = allCharacters.sort((a, b) => new Date(b.attributes.updatedAt) - new Date(a.attributes.updatedAt))[0];
          const charToDisplay = { id: latestCharData.id, ...latestCharData.attributes };
          const sortedStarLevels = [...charToDisplay.Star_Levels].sort((a, b) => getStarLevelNumber(b.Star_Level) - getStarLevelNumber(a.Star_Level));
          charToDisplay.Star_Levels = sortedStarLevels;
          setCharacter(charToDisplay);
          if (sortedStarLevels.length > 0) {
            setSelectedStar(sortedStarLevels[0].Star_Level);
          }
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, []);

  useEffect(() => {
    const INCREMENT_URL = `${API_ENDPOINT}/api/site-counter/increment`;
    fetch(INCREMENT_URL, { 
      method: 'PUT',
      keepalive: true
    });
  }, []);

  if (loading || authLoading) return <div className="loading-state">Loading...</div>;
  if (error) return <div className="error-state">Error fetching data: {error.message}</div>;
  if (!character) return <div className="loading-state">No character data found.</div>;

  const selectedStarLevelData = character.Star_Levels.find(
    (level) => level.Star_Level === selectedStar
  );

  const currentEnhancements = selectedStarLevelData?.enhancements || [];
  const currentSkillDescriptions = selectedStarLevelData?.skill_descriptions || [];
  
  const mainArtUrl = character.Main_Art?.url;
  const embedUrl = getYouTubeEmbedUrl(character.YouTube_URL);

  return (
    <div className="App">
       <CountdownTimer 
        targetDate={targetCountdownDate} 
        prefixText={<>The World Serpent event will begin (China) in :<br /></>}
      />
      
      <title>{`${character.Name} - Character Sheet`}</title>
      
      <div id="character-sheet-container" key={character.id} className="character-sheet-container">
        <header className="character-header layout-header">
           <div className="name-and-id">
              <h1>{character.Name}</h1>
            </div>
          <div className="tags">
            <span className={`tag-rarity ${character.Rarity}`}>{character.Rarity}</span>
            <span className="tag-role">{character.Role}</span>
            {character.Element && <span className="tag-element">{character.Element}</span>}
          </div>
        </header>
        {mainArtUrl && (<img src={mainArtUrl} alt={character.Name} className="main-character-art layout-art"/>)}
        <CollapsiblePanel title="Main Stats" defaultExpanded={false} className="layout-main-stats">
          <div className="stats-grid">
            <StatItem label="ATK" value={character.ATK} />
            <StatItem label="DEF" value={character.DEF} />
            <StatItem label="HP" value={character.HP} />
            <StatItem label="SPD" value={character.SPD} />
          </div>
        </CollapsiblePanel>
        <CollapsiblePanel title="Special" defaultExpanded={false} className="layout-special-stats">
          <div className="stats-grid-special">
            {/* ... StatItems ... */}
          </div>
        </CollapsiblePanel>
        <div className="layout-skills">
          <div className="star-selector">
              {character.Star_Levels.map((level) => (
              <button key={level.id}
                  className={`star-button ${selectedStar === level.Star_Level ? 'active' : ''}`}
                  onClick={() => setSelectedStar(level.Star_Level)}>
                  {getStarLevelNumber(level.Star_Level)}★
              </button>
              ))}
          </div>
          <section className="skills-grid">
            {currentSkillDescriptions.length > 0 ? (
              currentSkillDescriptions.map((skillDesc) => (
                <SkillCard key={skillDesc.id} skillDescription={skillDesc} />
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
                    const enhancementIconUrl = enh.Enhancement_Icon?.url;
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

      <div className="export-container">
        <button onClick={handleExportAsImage} className="export-button">
          Export as PNG
        </button>
      </div>
      <div className="max-w-4xl mx-auto px-4">
        <CommentSection 
          pageId={`character-${character.id}`}
        />
      </div>
    </div>
  );
}

export default App;