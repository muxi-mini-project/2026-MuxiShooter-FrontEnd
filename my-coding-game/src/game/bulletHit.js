import { calcDamage } from "./damage"

export function handleBulletHit(bullet, enemy, store) {
    const dmg = calcDamage({
        attack: store.baseStats.attack,
        base: bullet.damage,
        damageBonus: store.skillStats.damageBonus || 0,
        damageReduce: enemy.damageReduce || 0,
        critRate: store.
        critDamage: bullet.critDmg
    })
    bullet.hitCount += 1
  let isCrit =
    bullet.forceCrit || Math.random() < bullet.critRate

  let finalDamage = bullet.damage

  if (isCrit) {
    finalDamage *= 1 + 1 + bullet.critDmg
  }

  if (!bullet.ignoreDamageReduce) {
    finalDamage *= 1 - enemy.damageReduce
  }

  enemy.hp -= Math.floor(finalDamage)

  if(bullet.hitCount > bullet){
    bullet.alive = false   
  }
  
}
