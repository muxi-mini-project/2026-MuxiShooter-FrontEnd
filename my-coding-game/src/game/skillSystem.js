// src/game/skillSystem.js
export function applySkills(baseStats, skills) {
  const stats = { ...baseStats }

  skills.forEach(skill => {
    Object.entries(skill).forEach(([key, value]) => {
      if (key === 'id') return

      if (typeof value === 'number') {
        stats[key] = (stats[key] || 0) + value
      }

      if (key === 'doubleCast') {
        stats.castTimes = (stats.castTimes || 1) + 1
      }

      if (key === 'rows') {
        stats.rows = value
      }
    })
  })

  return stats
}
