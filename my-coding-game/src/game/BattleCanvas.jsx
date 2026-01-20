import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

const BattleCanvas = ({ onLevelUp, isPaused }) => {
  const canvasRef = useRef(null);
  const { gameActive, getSkillStats, gainExp, addKill } = useGameStore();

  const engine = useRef({
    playerX: 200,
    bullets: [],
    enemies: [],
    lastFire: 0,
    lastSpawn: 0
  });

  useEffect(() => {
    if (!gameActive) return;
    const ctx = canvasRef.current.getContext('2d');
    let frame;

    const update = (time) => {
      const eng = engine.current;
      const stats = getSkillStats(); // 基础加成

      // 1. 角色持续攻击 (原版速度)
      if (time - eng.lastFire > 300) {
        eng.bullets.push({ x: eng.playerX, y: 700, val: stats.atk || 10 });
        eng.lastFire = time;
      }

      // 2. 敌人下落
      if (time - eng.lastSpawn > 1200) {
        eng.enemies.push({ x: Math.random() * 360 + 20, y: -20, hp: 20 });
        eng.lastSpawn = time;
      }

      // 3. 碰撞检测
      eng.bullets.forEach(b => {
        b.y -= 12;
        eng.enemies.forEach(en => {
          if (!en.dead && Math.abs(b.x - en.x) < 20 && Math.abs(b.y - en.y) < 20) {
            en.hp -= b.val;
            b.y = -100;
            if (en.hp <= 0) {
              en.dead = true;
              addKill();
              if (gainExp(20)) onLevelUp();
            }
          }
        });
      });

      eng.bullets = eng.bullets.filter(b => b.y > 0);
      eng.enemies = eng.enemies.filter(en => !en.dead);
      eng.enemies.forEach(en => en.y += 2);
    };

    const draw = () => {
      const eng = engine.current;
      ctx.clearRect(0, 0, 400, 800);

      // 绘制角色 (带点发光感)
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#3498db';
      ctx.fillStyle = '#3498db';
      ctx.beginPath(); ctx.arc(eng.playerX, 720, 15, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;

      // 绘制子弹
      ctx.fillStyle = '#fff';
      eng.bullets.forEach(b => {
        ctx.fillRect(b.x - 2, b.y, 4, 10);
      });

      // 绘制敌人
      ctx.fillStyle = '#e74c3c';
      eng.enemies.forEach(en => {
        ctx.fillRect(en.x - 12, en.y - 12, 24, 24);
      });
    };

    const loop = (time) => {
      if (!isPaused) update(time);
      draw();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [gameActive, isPaused]);

  return (
    <canvas 
      ref={canvasRef} width={400} height={800} 
      onMouseMove={(e) => {
        const r = canvasRef.current.getBoundingClientRect();
        engine.current.playerX = (e.clientX - r.left) * (400 / r.width);
      }}
      style={{ width: '100%', height: '100%', cursor: 'none' }} 
    />
  );
};

export default BattleCanvas;