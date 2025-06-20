class AoE_Effect {
  constructor(game, x, y, radius, damage, duration, color) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.damage = damage;
    this.duration = duration;
    this.color = color;
    this.timer = 0;
    this.markedForDeletion = false;
    this.enemiesHit = new Set();
  }
  update(deltaTime) {
    this.timer += deltaTime;
    if (this.timer > this.duration) this.markedForDeletion = true;
  }
  draw(context) {
    context.beginPath();
    context.fillStyle = this.color;
    context.globalAlpha = 0.5 * (1 - this.timer / this.duration);
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fill();
  }
}
