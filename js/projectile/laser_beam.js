class LaserBeam {
  constructor(game, source, target, damage, pierce, chain) {
    this.game = game;
    this.source = source;
    this.target = target;
    this.damage = damage;
    this.pierce = pierce;
    this.chain = chain;
    this.duration = 150;
    this.timer = 0;
    this.markedForDeletion = false;
    this.enemiesHit = new Set();
  }
  update(deltaTime) {
    this.timer += deltaTime;
    if (this.timer > this.duration) this.markedForDeletion = true;
  }
  draw(context) {
    context.save();
    context.strokeStyle = "#F0F0FF";
    context.lineWidth = 2;
    context.globalAlpha = 0.9 * (1 - this.timer / this.duration);
    context.beginPath();
    context.moveTo(this.source.x, this.source.y);
    context.lineTo(
      this.target.x + this.target.width / 2,
      this.target.y + this.target.height / 2
    );
    context.stroke();
    context.restore();
  }
}
