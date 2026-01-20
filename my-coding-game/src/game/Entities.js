class Enemy {
  constructor(type, config) {
    this.type = type; // 'MIST' 或 'BUG'
    this.x = Math.random() * 360 + 20;
    this.y = 50; // 远方出现
    this.hp = config.hp;
    this.speed = config.speed;
    this.active = true;
  }

  update(playerX) {
    if (this.type === 'BUG') {
      // BUG小怪兽：主动追击，x轴向主角靠拢
      const dx = playerX - this.x;
      this.x += Math.sign(dx) * 0.5; 
    }
    this.y += this.speed;
  }
}