// src/game/bulletTypes.js
export function createBullet({
  x,
  y,//坐标
  speed = 300,//速度
  damage = 10,//伤害
  size = 6,//尺寸
  pierce = 0,//穿透
  critRate = 0,//暴击率
  critDmg = 0,//暴击伤害
  forceCrit = false,//必定暴击
  ignoreDamageReduce = false//无视减伤
}) {
  return {
    x,
    y,
    speed,
    damage,
    size,
    pierce,
    critRate,
    critDmg,
    forceCrit,
    ignoreDamageReduce,
    alive: true
  }
}
