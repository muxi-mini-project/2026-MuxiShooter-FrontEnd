// src/game/waveController.js
import { createEnemy } from './enemyTypes'

export function createWaveController(stage, enemies) {
  let waveIndex = 0
  let spawnTimer = 0
  let spawned = 0

  function update(dt) {
    const wave = stage.waves[waveIndex]
    if (!wave) return 'STAGE_CLEAR'

    spawnTimer += dt

    if (spawned < wave.count && spawnTimer >= wave.interval) {
      spawnEnemy(wave)
      spawnTimer = 0
      spawned++
    }

    // 当前波已清完
    if (
      spawned === wave.count &&
      enemies.length === 0
    ) {
      waveIndex++
      spawned = 0
      spawnTimer = 0
    }

    return 'RUNNING'
  }

  function spawnEnemy(wave) {
    enemies.push(
      createEnemy({
        x: 40 + Math.random() * 280,
        hp: wave.hp,
        speed: wave.speed,
        damageReduce: wave.isBoss ? 0.3 : 0
      })
    )
  }

  return { update }
}
