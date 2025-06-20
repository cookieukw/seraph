class ParasiteEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.width = 10;
    this.height = 10;
    this.x =
      Math.random() > 0.5
        ? this.game.camera.x - this.width
        : this.game.camera.x + this.game.width;
    this.y = Math.random() * this.game.height;
    this.speed = 2.5;
    this.color = "#2ECC40";
  }
  update(deltaTime) {
    super.update(deltaTime);
    const angle = Math.atan2(
      this.game.player.y - this.y,
      this.game.player.x - this.x
    );
    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;
  }
  drawShape(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width / 2,
      0,
      Math.PI * 2
    );
    context.fill();
  }
}
