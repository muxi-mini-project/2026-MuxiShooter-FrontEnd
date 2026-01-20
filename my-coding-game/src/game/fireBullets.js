// src/game/fireBullets.js
import { createBullet } from './bulletTypes'
import { buildBulletStats } from './bulletModifier'

export function fireBullets({
  player,
  baseStats,
  skillStats,
  bullets
}) {
  const bulletStats = buildBulletStats(baseStats, skillStats)

  const rows = skillStats.rows || 1
  const cols = skillStats.cols || 1
  const mirrors = skillStats.mirror || 0

  function spawn(offsetX) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bullets.push(
          createBullet({
            x: player.x + offsetX + (c - cols / 2) * 10,
            y: player.y - r * 10,
            ...bulletStats
          })
        )
      }
    }
  }

  // 本体
  spawn(0)

  // 镜像
  for (let i = 0; i < mirrors; i++) {
    spawn((i + 1) * 30)
    spawn(-(i + 1) * 30)
  }
}
