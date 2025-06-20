class Orb {
  constructor(game, player, angleOffset) {
    this.game = game;
    this.player = player;
    this.angleOffset = angleOffset;
    this.distance = 35;
    this.rotationSpeed = 0.02;
    this.currentAngle = 0;
  }
  update(deltaTime) {
    this.currentAngle += this.rotationSpeed;
    this.x =
      this.player.x +
      Math.cos(this.currentAngle + this.angleOffset) * this.distance;
    this.y =
      this.player.y +
      Math.sin(this.currentAngle + this.angleOffset) * this.distance;
  }
  draw(context) {
    this.drawOrb(context);
  }
  drawOrb(context) {}
}
