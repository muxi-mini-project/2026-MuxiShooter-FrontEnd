// src/config/stages.js
export const STAGES = [
  {
    id: 1,
    name: '新手测试',
    waves: [
      {
        count: 5,
        hp: 20,
        speed: 40,
        interval: 0.8
      },
      {
        count: 8,
        hp: 30,
        speed: 45,
        interval: 0.6
      }
    ]
  },
  {
    id: 2,
    name: '强度上升',
    waves: [
      {
        count: 8,
        hp: 40,
        speed: 50,
        interval: 0.6
      },
      {
        count: 10,
        hp: 60,
        speed: 55,
        interval: 0.5
      },
      {
        count: 1,
        hp: 300,
        speed: 30,
        interval: 1,
        isElite: true
      }
    ]
  },
  {
    id: 3,
    name: '期末周',
    waves: [
      {
        count: 12,
        hp: 70,
        speed: 60,
        interval: 0.5
      },
      {
        count: 15,
        hp: 90,
        speed: 65,
        interval: 0.4
      },
      {
        count: 1,
        hp: 600,
        speed: 25,
        interval: 1,
        isBoss: true
      }
    ]
  }
]
