class LaserOrb extends Orb {
  constructor(game, player, angleOffset) {
    super(game, player, angleOffset);
    this.shootCooldown = 2000;
    this.shootTimer = Math.random() * this.shootCooldown;
  }
  update(deltaTime) {
    super.update(deltaTime);
    this.shootTimer += deltaTime;
    if (this.shootTimer >= this.shootCooldown) {
      if (this.game.gameState === "running") {
        const target = this.game.getClosestEnemy(this);
        if (target) {
          const u = this.player.upgrades.laserOrb;
          this.game.aoeEffects.push(
            new LaserBeam(this.game, this, target, u.damage, u.pierce, u.chain)
          );
        }
      }
      this.shootTimer = 0;
    }
  }
  drawOrb(context) {
    context.fillStyle = "#C77CFF";
    context.beginPath();
    context.arc(this.x, this.y, 5, 0, Math.PI * 2);
    context.fill();
  }
}
