// src/game/enemyTypes.js
export function createEnemy({
  x,
  y = -20,
  hp,
  speed,
  size = 20,
  damageReduce = 0
}) {
  return {
    x,
    y,
    hp,
    maxHp: hp,
    speed,
    size,
    scale: 1,
    damageReduce,
    alive: true
  }
}
