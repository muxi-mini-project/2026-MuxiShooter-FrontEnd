export function calcDamage({
  attack,
  base,
  damageBonus,
  damageReduce,
  critRate,
  critDamage,
  extra = 0
}) {
  const isCrit = Math.random() < critRate

  let dmg =
    (10 + attack) *
    (1 + damageBonus - damageReduce + extra)

  if (isCrit) {
    dmg *= 1 + 1 + critDamage
  }

  return Math.max(1, Math.floor(dmg))
}
