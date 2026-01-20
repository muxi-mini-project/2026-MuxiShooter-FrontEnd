// src/game/bulletModifier.js
import { calcDamage } from './damage'

export function buildBulletStats(baseStats, skillStats) {
  return {
    damage: calcDamage({
      base: 10,
      attack: baseStats.attack,
      dmgUp: skillStats.dmgUp || 0,
      dmgDown: skillStats.dmgDown || 0,
      isCrit: false,
      critBonus: skillStats.critDmg || 0
    }),
    size: 6 * (1 + (skillStats.sizeUp || 0)),
    pierce: skillStats.pierce || 0,
    critRate:
      skillStats.forceCrit ? 1 : (baseStats.critRate + (skillStats.critRate || 0)),
    critDmg: baseStats.critDmg + (skillStats.critDmg || 0),
    forceCrit: skillStats.forceCrit || false,
    ignoreDamageReduce: skillStats.ignoreDamageReduce || false
  }
}
