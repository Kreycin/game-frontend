// src/pages/TierListPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CharacterIcon from '../components/CharacterIcon';
import '../styles/TierListPage.css';

const API_ENDPOINT = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';
const API_URL = `${API_ENDPOINT}/api/public-tier-lists`;

const TierListDisplay = ({ list }) => {
    if (!list || !list.attributes || !list.attributes.tiers) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>No Tier List data found for this mode.</div>;
    }

    const tierNameMapping = {
        'T0': 'Apex', 'T0.5': 'Meta', 'T1': 'Meta', 'T1.5': 'Viable',
        'T2': 'Viable', 'T3': 'Niche', 'T4': 'Niche', 'T5': 'Forgotten'
    };
    const tierColorMapping = {
        'T0': '#e82934', 'T0.5': '#fa4550', 'T1': '#d69b56', 'T1.5': '#d69b56',
        'T2': '#f2cc8b', 'T3': '#fffcae', 'T4': '#fff574', 'T5': '#a2d2ff'
    };
    const groupDividerColorMapping = {
        'Apex': '#e82934', 'Meta': '#d69b56', 'Viable': '#f2cc8b', 'Niche': '#fffcae', 'Forgotten': '#a2d2ff'
    };

    const sortedTiers = list.attributes.tiers.sort((a, b) => parseFloat(a.tier_level.replace('T', '')) - parseFloat(b.tier_level.replace('T', '')));
    
    const groupedTiers = sortedTiers.reduce((acc, tier) => {
        const groupName = tierNameMapping[tier.tier_level] || 'Unknown';
        if (!acc[groupName]) {
            acc[groupName] = [];
        }
        acc[groupName].push(tier);
        return acc;
    }, {});

    return (
        <div className="tier-table-wrapper">
            <header className="tier-table-header">
                <div /> {/* Empty cell for top-left */}
                <div className="role-header dps">⚔️ DPS</div>
                <div className="role-header support">⭐ SUPPORT</div>
                <div className="role-header def">🛡️ DEF</div>
            </header>

            <main>
                {Object.entries(groupedTiers).map(([groupName, tiersInGroup]) => (
                    <div className="tier-group" key={groupName}>
                        <div 
                            className="tier-group-header" 
                            style={{ borderTopColor: groupDividerColorMapping[groupName] }}
                        >
                            <span>✧ {groupName} CHARACTERS ✧</span>
                        </div>
                        
                        {tiersInGroup.map((tier) => (
                            <div className="tier-row-grid" key={tier.id}>
                                <div className="tier-header-cell">
                                    <div className="tier-color-bar" style={{ backgroundColor: tierColorMapping[tier.tier_level] }} />
                                    <div className="tier-level-text">{tier.tier_level}</div>
                                </div>
                                <div className="character-cell">
                                    <div className="characters-grid">
                                        {tier.dps_characters.map(charData => <CharacterIcon key={charData.id} characterData={charData} />)}
                                    </div>
                                </div>
                                <div className="character-cell">
                                    <div className="characters-grid">
                                        {tier.support_characters.map(charData => <CharacterIcon key={charData.id} characterData={charData} />)}
                                    </div>
                                </div>
                                <div className="character-cell">
                                    <div className="characters-grid">
                                        {tier.def_characters.map(charData => <CharacterIcon key={charData.id} characterData={charData} />)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </main>
        </div>
    );
};

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