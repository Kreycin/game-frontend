// src/pages/TierListPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// -- Import Component และ CSS ที่เราสร้างขึ้นมา --
import CharacterIcon from '../components/CharacterIcon';
import '../styles/TierListPage.css';

const API_ENDPOINT = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';
const API_URL = `${API_ENDPOINT}/api/public-tier-lists`;

// -- Component ย่อยสำหรับแสดงผล 1 แถว Tier --
const TierRow = ({ tierData }) => {
  const { tier_level, tier_name, dps_characters, support_characters, def_characters } = tierData;

  // -- กำหนดชื่อเรียก Tier ตามที่คุณต้องการ --
  const tierNameMapping = {
    'T0': 'Apex', 'T0.5': 'Meta', 'T1': 'Meta', 'T1.5': 'Viable',
    'T2': 'Viable', 'T3': 'Niche', 'T4': 'Niche', 'T5': 'Forgotten'
  };

  return (
    <div className="tier-row">
      <div className="tier-row-header">
        <span className="tier-level">{tier_level}</span>
        <span className="tier-name">{tierNameMapping[tier_level] || tier_name}</span>
      </div>
      <div className="tier-roles-grid">
        <div className="role-section">
          <h3>DPS</h3>
          <div className="characters-grid">
            {dps_characters.map(charData => <CharacterIcon key={charData.id} characterData={charData} />)}
          </div>
        </div>
        <div className="role-section">
          <h3>SUPPORT</h3>
          <div className="characters-grid">
            {support_characters.map(charData => <CharacterIcon key={charData.id} characterData={charData} />)}
          </div>
        </div>
        <div className="role-section">
          <h3>DEF</h3>
          <div className="characters-grid">
            {def_characters.map(charData => <CharacterIcon key={charData.id} characterData={charData} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

// -- Component สำหรับแสดงผล Tier List ทั้งหมดของโหมดที่เลือก --
const TierListDisplay = ({ list }) => {
    if (!list || !list.attributes || !list.attributes.tiers) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>No Tier List data found for this mode.</div>;
    }

    return (
        <div className="tier-list-container">
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2rem' }}>{list.attributes.title}</h2>
            {list.attributes.tiers
              .sort((a, b) => parseFloat(a.tier_level.replace('T', '')) - parseFloat(b.tier_level.replace('T', '')))
              .map(tier => <TierRow key={tier.id} tierData={tier} />)
            }
        </div>
    );
};

// -- Component หลักของหน้า --
const TierListPage = () => {
    const [tierLists, setTierLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMode, setSelectedMode] = useState(null);

    useEffect(() => {
        const fetchTierLists = async () => {
            try {
                const response = await axios.get(API_URL);
                const validLists = response.data.data.filter(item => item && item.attributes && item.attributes.game_mode);
                setTierLists(validLists);
                if (validLists.length > 0) {
                    const defaultList = validLists.find(l => l.attributes.game_mode === 'mode 5v5') || validLists[0];
                    setSelectedMode(defaultList.attributes.game_mode);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTierLists();
    }, []);

    if (loading) { return <div className="loading-state">Loading Tier Lists...</div>; }
    if (error) { return <div className="error-state">Error: {error.message}</div>; }

    const activeTierList = tierLists.find(list => list.attributes.game_mode === selectedMode);
    const availableModes = tierLists.map(list => list.attributes.game_mode);

    return (
        <div style={{ padding: '0 2rem 2rem 2rem' }}>
            <h1 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>Zenith Tier List</h1>

            <div className="star-selector" style={{ maxWidth: '400px', margin: '1rem auto' }}>
                {availableModes.map(mode => (
                    <button
                        key={mode}
                        className={`star-button ${selectedMode === mode ? 'active' : ''}`}
                        onClick={() => setSelectedMode(mode)}
                    >
                        {mode.replace(/mode /i, '').toUpperCase()}
                    </button>
                ))}
            </div>

            {tierLists.length > 0 ? (
                <TierListDisplay list={activeTierList} />
            ) : (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>No Tier Lists have been created yet.</div>
            )}
        </div>
    );
};

export default TierListPage;