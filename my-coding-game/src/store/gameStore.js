import { create } from 'zustand'

export const useGameStore = create((set, get) => ({
  /* ================= 升级 & 技能 ================= */

  skillLevels: {},      // { laptop: 3 }
  skillEffects: [],     // 已获得技能对象

  isLevelUp: false,
  pauseGame: false,

  setLevelUp(state) {
    set({ isLevelUp: state, pauseGame: state })
  },

  pickSkill(category, skill) {
    set(state => {
      const nextLevels = {
        ...state.skillLevels,
        [category]: (state.skillLevels[category] || 0) + 1
      }

      const nextEffects = [...state.skillEffects, skill]

      return {
        skillLevels: nextLevels,
        skillEffects: nextEffects,
        combatStats: calcCombatStats(nextLevels, nextEffects)
      }
    })
  },

  /* ================= 战斗核心数据 ================= */

  baseStats: {
    attack: 10,       // 基础攻击力
    fireRate: 1,      // 射速
    bulletCount: 1,   // 子弹数量
    critRate: 0.05,   // 暴击率
    critDamage: 2.0   // 暴击伤害
  },

  combatStats: {
    attack: 10,
    fireRate: 1,
    bulletCount: 1,
    critRate: 0.05,
    critDamage: 2.0,
    damageMultiplier: 1
  }
}))

/* ================= 工具函数：由技能算最终战斗数值 ================= */

function calcCombatStats(levels, effects) {
  let stats = {
    attack: 10,
    fireRate: 1,
    bulletCount: 1,
    critRate: 0.05,
    critDamage: 2.0,
    damageMultiplier: 1
  }

  effects.forEach(skill => {
    if (skill.type === 'attack') {
      stats.attack += skill.value
    }

    if (skill.type === 'bullet') {
      stats.bulletCount += skill.value
    }

    if (skill.type === 'crit') {
      stats.critRate += skill.value
    }

    if (skill.type === 'damage') {
      stats.damageMultiplier += skill.value
    }
  })

  return stats
}
