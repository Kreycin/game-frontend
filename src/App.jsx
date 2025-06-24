// src/App.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';

// ไม่ต้อง import Helmet อีกต่อไป
// import { Helmet } from 'react-helmet-async'; 

import './App.css';
import SkillCard from './components/SkillCard';
import VideoSection from './components/VideoSection';
import CollapsiblePanel from './components/CollapsiblePanel';
import StatItem from './components/StatItem';
import CountdownTimer from './components/CountdownTimer';
import OverlayPage from './components/OverlayPage';

// ... โค้ดส่วนอื่นๆ ที่ไม่เปลี่ยนแปลง ...
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
  const isOverlayActive = import.meta.env.VITE_OVERLAY_MODE === 'true';
  if (isOverlayActive) {
    // ถ้าสวิตช์เปิดอยู่ ให้แสดงหน้านี้แล้วหยุดทันที
    return <OverlayPage targetDate={targetCountdownDate} />; 
  }
  const [character, setCharacter] = useState(null);
  // ... state และ functions อื่นๆ เหมือนเดิม ...
  const [selectedStar, setSelectedStar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // กำหนดวันที่เป้าหมายสำหรับ Countdown
  // ตัวอย่าง: วันที่ 25 กรกฎาคม 2025 เวลา 10:00:00 น. +0700 (เวลาประเทศไทย)
  // **คุณสามารถเปลี่ยนวันที่และเวลานี้ได้ตามต้องการ**
  const targetCountdownDate = '2025-07-01T18:00:00+07:00'; // <<<<<<< เพิ่มบรรทัดนี้


 const handleExportAsImage = () => {
    if (!character) return;
    
    const elementToCapture = document.getElementById('character-sheet-container');
    
    if (elementToCapture) {
      
      // ==================== ส่วนที่เพิ่มเข้ามาสำหรับลายน้ำ ====================

      // 1. สร้าง element <div> ขึ้นมาสำหรับเป็นลายน้ำ
      const watermark = document.createElement('div');

      // 2. กำหนดข้อความและสไตล์ของลายน้ำ
      // <<< คุณสามารถเปลี่ยนข้อความลายน้ำได้ที่นี่ >>>
      watermark.innerText = 'Made by Kreycin'; 
      
      // กำหนดสไตล์ให้ไปอยู่มุมขวาล่าง
      watermark.style.position = 'absolute';
      watermark.style.right = '45px'; // ระยะห่างจากขอบขวา
      watermark.style.bottom = '10px'; // ระยะห่างจากขอบล่าง
      watermark.style.fontSize = '12px'; // ขนาดตัวอักษร
      watermark.style.color = 'rgba(255, 255, 255, 0.4)'; // สีขาวโปร่งแสง 40%
      watermark.style.zIndex = '9999'; // ทำให้ลายน้ำอยู่บนสุดเสมอ
      watermark.style.pointerEvents = 'none'; // ทำให้ไม่สามารถคลิกได้

      // 3. นำลายน้ำไปแปะไว้ใน container ที่เราจะถ่ายรูป
      elementToCapture.appendChild(watermark);

      // =====================================================================

      html2canvas(elementToCapture, {
        backgroundColor: '#1a1a1a',
        useCORS: true,
        scale: 2,
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `${character.Name || 'character-sheet'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        // ==================== ส่วนที่สำคัญที่สุด ====================
        // 4. หลังจากถ่ายรูปและสร้างลิงก์เสร็จแล้ว ให้ลบลายน้ำทิ้งทันที
        elementToCapture.removeChild(watermark);
        // ==========================================================
      }).catch(err => {
        // เพิ่มการจัดการ Error และลบลายน้ำทิ้งเผื่อกรณีเกิดข้อผิดพลาด
        console.error("Error during canvas generation:", err);
        elementToCapture.removeChild(watermark);
      });
    }
  };

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
  
  const mainArtUrl = character.Main_Art?.url;
  const embedUrl = getYouTubeEmbedUrl(character.YouTube_URL);


  return (
    <div className="App">
      {/* <<<<<<< เริ่มการเพิ่มโค้ดในจุดที่ 3 */}
      {/* นี่คือตำแหน่งที่ตัวนับถอยหลังจะปรากฏบนหน้าจอ */}
       <CountdownTimer 
        targetDate={targetCountdownDate} 
        // เปลี่ยน prefixText เป็น JSX ที่มี <br /> สำหรับขึ้นบรรทัดใหม่
        prefixText={
          <>
            A new character is coming (estimate) in:
            <br />
        
          </>
        }
      /> 
      {/* <<<<<<< สิ้นสุดการเพิ่มโค้ดในจุดที่ 3 */}
      {/* ==================== โค้ดที่อัปเดตสำหรับ React 19 ==================== */}
      {/* เราสามารถเขียน <title> และ <meta> ได้โดยตรงเลย! */}
      <title>{`${character.Name} - Character Sheet | Demon Slayer Game Hub`}</title>
      <meta name="description" content={`ข้อมูลค่าพลัง, สกิล, และรายละเอียดทั้งหมดของตัวละคร ${character.Name} ระดับ ${character.Rarity}`} />
      
      {/* --- Open Graph Tags สำหรับการแชร์ --- */}
      <meta property="og:title" content={`${character.Name} - Character Sheet`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://demonslayergamehub.com" />
      {mainArtUrl && <meta property="og:image" content={mainArtUrl} />}
      <meta property="og:description" content={`ข้อมูลค่าพลัง, สกิล, และรายละเอียดทั้งหมดของตัวละคร ${character.Name} ระดับ ${character.Rarity}`} />
      <meta property="og:site_name" content="Demon Slayer Game Hub" />
      {/* ====================================================================== */}


      <div id="character-sheet-container" key={character.id} className="character-sheet-container">
        {/* ... โค้ดส่วนที่เหลือของ JSX เหมือนเดิมทุกประการ ... */}
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
    </div>
  );
}

export default App;