// src/pages/TierListPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import CharacterIcon from '../components/CharacterIcon';
import '../styles/TierListPage.css';

const API_ENDPOINT = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337';
const TIER_LIST_API_URL = `${API_ENDPOINT}/api/public-tier-lists`;
const GUIDE_API_URL = `${API_ENDPOINT}/api/tier-list-guide`;

// --- Component สำหรับแสดงผล Rich Text (Blocks) ---
const BlocksRenderer = ({ blocks }) => {
    if (!blocks) return null;

    return blocks.map((block, index) => {
        switch (block.type) {
            case 'paragraph':
                return (
                    <p key={`block-${index}`} className="guide-paragraph">
                        {block.children.map((child, childIndex) => {
                            let element = <span key={`child-${childIndex}`}>{child.text}</span>;
                            if (child.bold) element = <strong>{element}</strong>;
                            if (child.italic) element = <em>{element}</em>;
                            if (child.underline) element = <u>{element}</u>;
                            if (child.code) element = <code>{element}</code>;
                            return element;
                        })}
                    </p>
                );
            case 'list':
                const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
                return (
                    <ListTag key={`block-${index}`} className="guide-list">
                        {block.children.map((listItem, listIndex) => (
                            <li key={`list-item-${listIndex}`}>
                                {listItem.children.map((child, childIndex) => {
                                    let element = <span key={`list-child-${childIndex}`}>{child.text}</span>;
                                    if (child.bold) element = <strong>{element}</strong>;
                                    if (child.italic) element = <em>{element}</em>;
                                    if (child.underline) element = <u>{element}</u>;
                                    if (child.code) element = <code>{element}</code>;
                                    return element;
                                })}
                            </li>
                        ))}
                    </ListTag>
                );
            default:
                return <p key={`block-${index}`}>Unsupported block type: {block.type}</p>;
        }
    });
};

// --- Component สำหรับแสดงผลส่วน Guide ---
const TierListGuide = ({ guideData }) => {
    if (!guideData) return null;
    const { criteria, roles, ratings, tags, credit_name } = guideData;

    return (
        <div className="guide-container">
            <div className="guide-grid">
                <div className="guide-section">
                    <h3>Criteria</h3>
                    <BlocksRenderer blocks={criteria} />
                </div>
                <div className="guide-section">
                    <h3>Roles</h3>
                    <BlocksRenderer blocks={roles} />
                </div>
                <div className="guide-section">
                    <h3>Ratings</h3>
                    <BlocksRenderer blocks={ratings} />
                </div>
                <div className="guide-section">
                    <h3>Tags</h3>
                    <BlocksRenderer blocks={tags} />
                </div>
            </div>
            
        </div>
    );
};

// --- Component สำหรับแสดงผลตาราง Tier List ---
const TierListDisplay = ({ list }) => {
    if (!list || !list.attributes || !list.attributes.tiers) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>No Tier List data found for this mode.</div>;
    }
    const tierNameMapping = { 'T0': 'Apex', 'T0.5': 'Meta', 'T1': 'Meta', 'T1.5': 'Viable', 'T2': 'Viable', 'T3': 'Niche', 'T4': 'Niche', 'T5': 'Forgotten' };
    const tierColorMapping = { 'T0': '#e82934', 'T0.5': '#fa4550', 'T1': '#d69b56', 'T1.5': '#d69b56', 'T2': '#f2cc8b', 'T3': '#fffcae', 'T4': '#fff574', 'T5': '#a2d2ff' };
    const groupDividerColorMapping = { 'Apex': '#e82934', 'Meta': '#d69b56', 'Viable': '#f2cc8b', 'Niche': '#fffcae', 'Forgotten': '#a2d2ff' };
    const sortedTiers = list.attributes.tiers.sort((a, b) => parseFloat(a.tier_level.replace('T', '')) - parseFloat(b.tier_level.replace('T', '')));
    const groupedTiers = sortedTiers.reduce((acc, tier) => { const groupName = tierNameMapping[tier.tier_level] || 'Unknown'; if (!acc[groupName]) { acc[groupName] = []; } acc[groupName].push(tier); return acc; }, {});

    return (
        <div id="tier-list-table" className="tier-table-wrapper">
            <header className="tier-table-header">
                <div />
                <div className="role-header dps">⚔️ DPS</div>
                <div className="role-header support">⭐ SUPPORT</div>
                <div className="role-header def">🛡️ DEF</div>
            </header>
            <main>
                {Object.entries(groupedTiers).map(([groupName, tiersInGroup]) => (
                    <div className="tier-group" key={groupName}>
                        <div className="tier-group-header" style={{ borderTopColor: groupDividerColorMapping[groupName], color: groupDividerColorMapping[groupName] }}>
                            <span>✧ {groupName} CHARACTERS ✧</span>
                        </div>
                        {tiersInGroup.map((tier) => (
                            <div className="tier-row-grid" key={tier.id}>
                                <div className="tier-header-cell" style={{ backgroundColor: tierColorMapping[tier.tier_level] }}>
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

// --- Component หลักของหน้า ---
const TierListPage = () => {
    const [tierLists, setTierLists] = useState([]);
    const [guideData, setGuideData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMode, setSelectedMode] = useState(null);

    const handleExportAsPng = () => {
        const elementToCapture = document.getElementById('tier-list-table');
        if (elementToCapture) {
            html2canvas(elementToCapture, {
                allowTaint: true,
                useCORS: true,
                scale: 2,
                width: elementToCapture.scrollWidth,
                height: elementToCapture.scrollHeight,
                windowWidth: elementToCapture.scrollWidth,
                windowHeight: elementToCapture.scrollHeight,
            }).then(canvas => {
                const link = document.createElement('a');
                const activeList = tierLists.find(list => list.attributes.game_mode === selectedMode);
                const fileName = activeList ? `${activeList.attributes.title}-tier-list.png` : 'tier-list.png';
                link.download = fileName;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [tierListsResponse, guideResponse] = await Promise.all([
                    axios.get(TIER_LIST_API_URL),
                    axios.get(GUIDE_API_URL)
                ]);
                const validLists = tierListsResponse.data.data.filter(item => item && item.attributes && item.attributes.game_mode);
                setTierLists(validLists);

                // --- นี่คือส่วนที่แก้ไข ---
                // ข้อมูลจาก Single Type จะไม่มี .attributes ครอบอยู่
                setGuideData(guideResponse.data.data); 

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
        fetchAllData();
    }, []);

    if (loading) { return <div className="loading-state">Loading...</div>; }
    if (error) { return <div className="error-state">Error: {error.message}</div>; }

    const activeTierList = tierLists.find(list => list.attributes.game_mode === selectedMode);
    const availableModes = tierLists.map(list => list.attributes.game_mode);

    return (
        <div style={{ padding: '0 2rem 2rem 2rem' }}>
            <div className="star-selector" style={{ maxWidth: '400px', margin: '1rem auto' }}>
                {availableModes.map(mode => (
                    <button key={mode} className={`star-button ${selectedMode === mode ? 'active' : ''}`} onClick={() => setSelectedMode(mode)}>
                        {mode.replace(/mode /i, '').toUpperCase()}
                    </button>
                ))}
            </div>

            {tierLists.length > 0 ? <TierListDisplay list={activeTierList} /> : <div style={{ textAlign: 'center', marginTop: '2rem' }}>No Tier Lists have been created yet.</div>}
            {guideData?.credit_name && (
                <div className="guide-credit">
                    <p>Tier List by: <strong>{guideData.credit_name}</strong></p>
                </div>
            )}
            <TierListGuide guideData={guideData} />

            <div className="export-container">
                <button onClick={handleExportAsPng} className="export-button">
                    Export as PNG
                </button>
            </div>
        </div>
    );
};

export default TierListPage;