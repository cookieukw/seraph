class LightningBolt extends AoE_Effect {
  constructor(game, x, y, radius, damage, color) {
    super(game, x, y, radius, damage, 200, color);
  }
  draw(context) {
    context.save();
    context.strokeStyle = this.color;
    context.lineWidth = 3;
    context.globalAlpha = 0.8 * (1 - this.timer / this.duration);
    context.beginPath();
    context.moveTo(this.x, 0);
    context.lineTo(this.x, this.y);
    context.stroke();

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.globalAlpha = 0.3 * (1 - this.timer / this.duration);
    context.fill();

    context.restore();
  }
}
