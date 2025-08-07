// ในไฟล์ GameGuide.jsx ของคุณ
import React, { useEffect } from 'react';
import './GameGuide.css'; // เราจะสร้าง/แก้ไขไฟล์นี้ในขั้นตอนถัดไป

function GameGuide() {
  useEffect(() => {
    // สร้างตัวแปรว่างๆ ไว้รอเก็บ instance ของกราฟ
    let defChartInstance = null;
    let critChartInstance = null;

    // โค้ด JavaScript สำหรับสร้าง Chart
    const tooltipCallback = {
        plugins: {
            tooltip: {
                callbacks: {
                    title: function(tooltipItems) {
                        const item = tooltipItems[0];
                        let label = item.chart.data.labels[item.dataIndex];
                        if (Array.isArray(label)) {
                            return label.join(' ');
                        }
                        return label;
                    }
                }
            }
        }
    };
    const defCtx = document.getElementById('defChart').getContext('2d');
    const defData = [];
    const defLabels = [];
    const attackerLevel = 80;
    const K_A = 800;
    const K_B = 10;
    for (let def = 0; def <= 4000; def += 200) {
        const mitigation = 1 - (def / (def + K_A + (attackerLevel * K_B)));
        const reductionPercent = (1 - mitigation) * 100;
        defData.push(reductionPercent);
        defLabels.push(def);
    }

    // สร้างกราฟ DEF และเก็บ instance ไว้ในตัวแปร
    defChartInstance = new Chart(defCtx, {
        type: 'line',
        data: {
            labels: defLabels,
            datasets: [{
                label: 'Damage Reduction (%)',
                data: defData,
                borderColor: '#FF5E5B',
                backgroundColor: 'rgba(255, 94, 91, 0.2)',
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            }]
        },
        options: {
            ...tooltipCallback,
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 100, ticks: { callback: (value) => value + '%' } },
                x: { title: { display: true, text: "Target's DEF Value" } }
            }
        }
    });

    const critCtx = document.getElementById('critChart').getContext('2d');
    
    // สร้างกราฟ Crit และเก็บ instance ไว้ในตัวแปร
    critChartInstance = new Chart(critCtx, {
        type: 'bar',
        data: {
            labels: ['Attacker Crit Rate', 'Target Crit Res', 'Effective Crit Rate'],
            datasets: [{
                label: 'Critical Hit Chance (%)',
                data: [75, -20, 55],
                backgroundColor: ['#00CECB', '#FF5E5B', '#FFED66'],
                borderColor: ['#00CECB', '#FF5E5B', '#FFED66'],
                borderWidth: 1
            }]
        },
        options: {
            ...tooltipCallback,
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: { x: { beginAtZero: true, ticks: { callback: (value) => value + '%' } } },
            plugins: { ...tooltipCallback.plugins, legend: { display: false } }
        }
    });

    // นี่คือ Cleanup Function ที่จะทำงานก่อน Effect ครั้งถัดไป
    return () => {
      if (defChartInstance) {
        defChartInstance.destroy();
      }
      if (critChartInstance) {
        critChartInstance.destroy();
      }
    };
  }, []); // Dependency array เป็น [] เพื่อให้ทำงานแค่ครั้งเดียวตอน mount

  return (
    // ส่วน JSX ทั้งหมดนี้เหมือนเดิมเป๊ะๆ ครับ
    <div className="body-text container mx-auto p-6 md:p-12">
        <header className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold title-text">The Grand Grimoire of Calculations</h1>
            <p className="mt-4 text-lg md:text-xl header-text">A Summary of All Decoded Formulas and Mechanics in the Game</p>
        </header>

        <section id="stat-calculation" className="mb-16">
            <h2 className="text-3xl font-bold header-text text-center mb-8">Section 1: The Anatomy of Power (Stat Calculation)</h2>
            <p className="text-center max-w-3xl mx-auto mb-10">This is the foundation of everything, the creation of the 'raw materials' used in combat. All primary stats (ATK, DEF, HP, SPD) originate from the same master formula.</p>
            <div className="card rounded-lg p-6 max-w-4xl mx-auto">
                <h3 className="text-xl font-bold header-text mb-4 text-center">Master Formula Diagram for Primary Stats</h3>
                <div className="flex flex-col items-center">
                    <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                        <div className="card p-4 text-center flex-1">
                            <h4 className="font-bold">Base Value</h4>
                            <p className="text-sm">From Level and Star Rank</p>
                        </div>
                        <div className="text-4xl font-bold self-center text-gray-400 mx-4">+</div>
                        <div className="card p-4 text-center flex-1">
                            <h4 className="font-bold">Flat Bonus</h4>
                            <p className="text-sm">From Runes and Equipment</p>
                        </div>
                    </div>
                    <div className="w-full flex justify-center my-4">
                       <div className="arrow h-8"></div>
                    </div>
                    <div className="relative w-full text-center">
                        <p className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-gray-400 font-bold hidden md:block">+ % Bonus</p>
                        <div className="card p-4">
                            <h4 className="font-bold">Sub-Total (Outside of Combat)</h4>
                            <p className="text-sm font-semibold">`Base + Flat + (Base * %)`</p>
                        </div>
                    </div>
                    <div className="w-full flex justify-center my-4">
                       <div className="arrow h-8"></div>
                    </div>
                    <div className="relative w-full text-center">
                        <p className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-gray-400 font-bold hidden md:block">* Buffs</p>
                        <div className="highlight-card p-4">
                            <h4 className="font-bold">Final Value</h4>
                            <p className="text-sm">The value used in actual combat</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="damage-calculation" className="mb-16">
            <h2 className="text-3xl font-bold header-text text-center mb-8">Section 2: The Art of Combat (Damage Calculation)</h2>
            <p className="text-center max-w-3xl mx-auto mb-10">When stats are ready, it's time for battle. This is the data flow sequence that occurs in every attack to determine the final damage outcome.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="space-y-8">
                     <div className="card rounded-lg p-6">
                        <h3 className="text-xl font-bold header-text mb-4">Critical Hit Chance</h3>
                        <p className="text-sm mb-4">The true critical hit chance is a direct subtraction between the attacker's and target's stats.</p>
                        <div className="chart-container" style={{height:'250px'}}>
                            <canvas id="critChart"></canvas>
                        </div>
                    </div>
                     <div className="card rounded-lg p-6">
                        <h3 className="text-xl font-bold header-text mb-4">⚡️ True Damage</h3>
                        <p className="text-sm">A special type of damage that <strong className="title-text">ignores all DEF and DMG Res</strong>. It can only be mitigated by <strong className="header-text">True DMG Res</strong>.</p>
                    </div>
                     <div className="card rounded-lg p-6">
                        <h3 className="text-xl font-bold header-text mb-4">🛡️ Reflection Damage</h3>
                        <p className="text-sm">Calculated from <strong className="title-text">actual damage received</strong> and reflected back as <strong className="header-text">True Damage</strong>.</p>
                    </div>
                </div>

                <div className="flex flex-col items-center space-y-4">
                     <div className="card p-4 text-center w-full">
                        <p className="text-xs uppercase font-semibold">Step 1</p>
                        <h4 className="font-bold">Calculate Raw Damage</h4>
                        <p className="text-sm font-mono">ATK * Skill Multiplier</p>
                    </div>
                    <div className="arrow h-6"></div>
                    <div className="card p-4 text-center w-full">
                         <p className="text-xs uppercase font-semibold">Step 2</p>
                        <h4 className="font-bold">Adjust for Critical Hit</h4>
                        <p className="text-sm">If critical, multiply by Crit DMG</p>
                    </div>
                    <div className="arrow h-6"></div>
                    <div className="card p-4 text-center w-full">
                         <p className="text-xs uppercase font-semibold">Step 3</p>
                        <h4 className="font-bold">Mitigate with Defense</h4>
                        <p className="text-sm">Uses Diminishing Returns formula</p>
                    </div>
                    <div className="arrow h-6"></div>
                     <div className="card p-4 text-center w-full">
                        <p className="text-xs uppercase font-semibold">Step 4</p>
                        <h4 className="font-bold">Mitigate with DMG Res</h4>
                        <p className="text-sm">Countered by Ignore DMG Res</p>
                    </div>
                     <div className="arrow h-6"></div>
                    <div className="highlight-card p-6 text-center w-full">
                        <h4 className="font-bold text-lg">Final Normal Damage</h4>
                    </div>
                </div>

                <div className="space-y-8">
                     <div className="card rounded-lg p-6">
                        <h3 className="text-xl font-bold header-text mb-4">Effectiveness of DEF</h3>
                        <p className="text-sm mb-4">The DEF mitigation formula uses "Diminishing Returns," meaning the higher the DEF, the less effective each additional point of DEF becomes at reducing damage.</p>
                        <div className="chart-container">
                            <canvas id="defChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  );
}

export default GameGuide;