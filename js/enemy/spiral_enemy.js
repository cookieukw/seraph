class SpiralEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.width = 16;
    this.height = 16;
    this.x =
      Math.random() > 0.5
        ? this.game.camera.x - this.width
        : this.game.camera.x + this.game.width;
    this.y = Math.random() * game.height * 0.5;
    this.speedY = 2;
    this.color = "#B10DC9";
    this.direction = this.x < this.game.player.x ? 1 : -1;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.y += this.speedY;
    this.x += this.direction * 3;
    if (this.y > this.game.height) {
      this.markedForDeletion = true;
    }
  }
  drawShape(context) {
    context.save();
    context.translate(this.x + this.width / 2, this.y + this.height / 2);
    context.rotate(this.game.gameTime * 0.005 * this.direction);
    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(0, -this.height / 2);
    context.lineTo(this.width / 2, this.height / 2);
    context.lineTo(-this.width / 2, this.height / 2);
    context.closePath();
    context.fill();
    context.restore();
  }
}
