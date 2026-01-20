import React, { useState, useEffect } from 'react';
import BattleCanvas from './BattleCanvas';
import SkillUpgradeModal from '../components/SkillUpgradeModal';
import { useGameStore } from '../store/gameStore';

const BattlePages = () => {
  const { gameActive, level, exp } = useGameStore();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [lastLevel, setLastLevel] = useState(1);

  useEffect(() => {
    if (level > lastLevel) {
      setIsUpgradeOpen(true);
      setLastLevel(level);
    }
  }, [level, lastLevel]);

  return (
    <div style={styles.page}>
      {/* 顶部全局进度条 (你记忆中的样式) */}
      <div style={styles.topBar}>
        <div style={styles.expLabel}>GRADE: {level}</div>
        <div style={styles.expBg}>
          <div style={{...styles.expFill, width: `${(exp / (level * 100)) * 100}%`}} />
        </div>
      </div>

      {/* 2.5D 游戏舞台 */}
      <div style={styles.stage}>
        <div style={styles.canvasContainer}>
          <BattleCanvas onLevelUp={() => setIsUpgradeOpen(true)} isPaused={isUpgradeOpen} />
          
          {/* 左上角技能标志挂载点 */}
          <div style={styles.skillIcons}>
            <SkillIconsList />
          </div>
        </div>
      </div>

      <SkillUpgradeModal isOpen={isUpgradeOpen} onSelect={() => setIsUpgradeOpen(false)} />

      {!gameActive && (
        <div style={styles.startMask}>
          <button style={styles.startBtn} onClick={() => useGameStore.setState({ gameActive: true })}>
            ENTER OFFICE
          </button>
        </div>
      )}
    </div>
  );
};

// 内部组件：左上角技能标志
const SkillIconsList = () => {
  const { selectedCategories, categoryLevels } = useGameStore();
  return (selectedCategories || []).map((cat, i) => (
    <div key={i} style={styles.iconBox}>
      <div style={styles.iconTag}>{cat.substring(0, 1)}</div>
      <div style={styles.iconLv}>Lv.{categoryLevels[cat] || 1}</div>
    </div>
  ));
};

const styles = {
  page: { width: '100vw', height: '100vh', background: '#111', overflow: 'hidden', position: 'relative' },
  topBar: { position: 'absolute', top: '20px', left: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20 },
  expLabel: { color: '#fff', fontSize: '12px', marginBottom: '5px', fontWeight: 'bold' },
  expBg: { width: '200px', height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' },
  expFill: { height: '100%', background: '#3498db', transition: 'width 0.3s' },
  // 2.5D 透视核心
  stage: { 
    width: '100%', height: '100%', 
    perspective: '1000px', // 透视深度
    display: 'flex', justifyContent: 'center', alignItems: 'center' 
  },
  canvasContainer: { 
    width: '400px', height: '80vh', 
    background: '#000', 
    transform: 'rotateX(15deg)', // 关键：向后倾斜产生 2.5D 感
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    border: '2px solid #444',
    position: 'relative'
  },
  skillIcons: { position: 'absolute', top: '20px', left: '10px', display: 'flex', flexDirection: 'column', gap: '8px' },
  iconBox: { width: '34px', height: '34px', border: '1px solid #3498db', background: 'rgba(52,152,219,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  iconTag: { color: '#fff', fontSize: '12px', fontWeight: 'bold' },
  iconLv: { color: '#f1c40f', fontSize: '8px' },
  startMask: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  startBtn: { padding: '15px 40px', background: 'none', border: '2px solid #3498db', color: '#3498db', cursor: 'pointer', fontSize: '18px' }
};

export default BattlePages;