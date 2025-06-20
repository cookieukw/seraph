class ShootingOrb extends Orb {
  constructor(game, player, angleOffset) {
    super(game, player, angleOffset);
    this.shootCooldown = 500;
    this.shootTimer = Math.random() * this.shootCooldown;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.shootTimer += deltaTime;
    if (this.shootTimer >= this.shootCooldown) {
      if (this.game.gameState === "running")
        this.game.projectiles.push(
          new Projectile(
            this.game,
            this.x,
            this.y,
            this.player.staffAngle,
            true,
            1
          )
        );
      this.shootTimer = 0;
    }
  }
  drawOrb(context) {
    context.fillStyle = "#00BFFF";
    context.beginPath();
    context.arc(this.x, this.y, 4, 0, Math.PI * 2);
    context.fill();
  }
}
