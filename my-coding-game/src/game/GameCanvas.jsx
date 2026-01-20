import { useEffect, useRef } from 'react'
import { fireBullets } from './fireBullets'
import { handleBulletHit } from './bulletHit'
import { getFireInterval } from './fireController'
import { useGameStore } from '../store/gameStore'
import { STAGES } from '../config/stages'
import { createWaveController } from './waveController'

const WIDTH = 360
const HEIGHT = 640
const DEFENSE_LINE = 520

export default function GameCanvas() {
  const canvasRef = useRef(null)
  const lastTime = useRef(0)
  const fireTimer = useRef(0)
  const waveController = useRef(null)

  const {
    baseStats,
    skillStats,
    bullets,
    enemies,
    player,
    hp,
    setHP,
    gainExp,
    levelUp,
    pauseGame,
    setLevelUp
  } = useGameStore()

  /* ================= 初始化关卡 ================= */
  useEffect(() => {
    const stage = STAGES[0] // TODO: 从主页传入
    waveController.current = createWaveController(stage, enemies)
  }, [])

  /* ================= 主循环 ================= */
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    function loop(time) {
    let dt = (time - lastTime.current) / 1000
      dt = Math.min(dt, 0.033) // 最大 30ms

      lastTime.current = time

     if (!pauseGame) {
        update(dt)
      }
      render(ctx)


      requestAnimationFrame(loop)
    }

    requestAnimationFrame(loop)
  }, [])

  /* ================= 更新逻辑 ================= */
  function update(dt) {
    if (waveController.current) {
      const waveState = waveController.current.update(dt)
      if (waveState === 'STAGE_CLEAR') {
        console.log('关卡胜利')
      }
    }

    /* 自动射击 */
    fireTimer.current += dt
    const interval = getFireInterval(
      baseStats.fireInterval,
      skillStats
    )

    if (fireTimer.current >= interval) {
      fireBullets({
        player,
        baseStats,
        skillStats,
        bullets,
        damage,
        size,
        speed,
        pierce: skillStats.pierce || 0,
        critRate: skillStats.critRate || 0,
        critDmg: skillStats.critDmg || 0,
        forceCrit: skillStats.forceCrit || false,
        ignoreDamageReduce: skillStats.ignoreDamageReduce || false,
        hitCount: 0
      })
      fireTimer.current = 0
    }

    /* 更新子弹 */
    bullets.forEach(b => {
      b.y -= b.speed * dt
      if (b.y < -20) b.alive = false
    })

    /* 更新敌人 */
    enemies.forEach(e => {
      e.y += e.speed * dt
      e.scale = 0.5 + e.y / HEIGHT

      if (e.y >= DEFENSE_LINE) {
        setHP(hp - 1)
        e.alive = false
      }
    })

    /* 碰撞检测 */
    bullets.forEach(b => {
      if (!b.alive) return
      enemies.forEach(e => {
        if (!e.alive) return

        const dx = b.x - e.x
        const dy = b.y - e.y
        const dist = Math.hypot(dx, dy)

        if (dist < b.size + e.size * e.scale) {
          handleBulletHit(b, e)
          if (e.hp <= 0) {
            e.alive = false
            gainExp(1)
          }
        }
      })
    })

    cleanArray(bullets)
    cleanArray(enemies)

    if (
      useGameStore.getState().exp >=
      useGameStore.getState().expMax &&
      !isLevelUp
    ) {
      setLevelUp(true)
    }
  }


  /* ================= 渲染 ================= */
  function render(ctx) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    ctx.strokeStyle = '#444'
    ctx.beginPath()
    ctx.moveTo(0, DEFENSE_LINE)
    ctx.lineTo(WIDTH, DEFENSE_LINE)
    ctx.stroke()

    ctx.fillStyle = '#4af'
    ctx.fillRect(player.x - 15, DEFENSE_LINE + 10, 30, 30)

    ctx.fillStyle = '#fff'
    bullets.forEach(b => {
      ctx.beginPath()
      ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2)
      ctx.fill()
    })

    enemies.forEach(e => {
      const size = e.size * e.scale
      ctx.fillStyle = 'red'
      ctx.fillRect(e.x - size / 2, e.y - size / 2, size, size)

      ctx.fillStyle = '#000'
      ctx.fillRect(e.x - size / 2, e.y - size / 2 - 6, size, 4)
      ctx.fillStyle = '#0f0'
      ctx.fillRect(
        e.x - size / 2,
        e.y - size / 2 - 6,
        size * (e.hp / e.maxHp),
        4
      )
    })

    ctx.fillStyle = '#fff'
    ctx.fillText(`HP: ${hp}`, 10, 20)

    const expRatio =
      useGameStore.getState().exp /
      useGameStore.getState().expMax
    ctx.fillRect(10, 30, 100 * expRatio, 6)
  }

  /* ================= 触控 ================= */
  useEffect(() => {
    const canvas = canvasRef.current

    function move(e) {
      const touch = e.touches ? e.touches[0] : e
      const rect = canvas.getBoundingClientRect()
      const x = touch.clientX - rect.left
      player.x = Math.max(20, Math.min(WIDTH - 20, x))
    }

    canvas.addEventListener('mousemove', move)
    canvas.addEventListener('touchmove', move)

    return () => {
      canvas.removeEventListener('mousemove', move)
      canvas.removeEventListener('touchmove', move)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}

function cleanArray(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!arr[i].alive) arr.splice(i, 1)
  }
}
