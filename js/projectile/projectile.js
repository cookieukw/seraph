class Projectile {
  constructor(game, x, y, angle, isPlayer, damage) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.isPlayer = isPlayer;
    this.damage = damage;
    const pUpgrades = this.game.player.upgrades;
    this.isHoming = pUpgrades.hasHomingProjectiles.value;
    this.ricochets = pUpgrades.ricochet.value;
    this.pierce = pUpgrades.pierce.value;
    this.shrapnel = pUpgrades.shrapnel.value;
    this.combustionChance = pUpgrades.combustion.chance;
    this.infectionChance = pUpgrades.infection.chance;
    this.target = this.isHoming ? this.game.getClosestEnemy({ x, y }) : null;
    this.speed = isPlayer ? 7 : 4;
    this.velocityX = Math.cos(angle) * this.speed;
    this.velocityY = Math.sin(angle) * this.speed;
    this.radius = isPlayer ? 2.5 : 4;
    this.color = isPlayer ? "#90E0EF" : "#FF4136";
    this.markedForDeletion = false;
  }
  update() {
    if (this.isHoming && this.target && !this.target.markedForDeletion) {
      const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
      this.velocityX = Math.cos(angle) * this.speed;
      this.velocityY = Math.sin(angle) * this.speed;
    }
    this.x += this.velocityX;
    this.y += this.velocityY;

    // BUG FIX: Lógica de ricochete adicionada
    let bounced = false;
    if (this.ricochets > 0) {
      if (
        this.x - this.radius < 0 ||
        this.x + this.radius > this.game.terrain.worldWidth
      ) {
        this.velocityX *= -1;
        bounced = true;
      }
      if (this.y - this.radius < 0) {
        // Apenas quica no teto
        this.velocityY *= -1;
        bounced = true;
      }
      if (bounced) {
        this.ricochets--;
      }
    }

    if (
      this.x + this.radius < 0 ||
      this.x - this.radius > this.game.terrain.worldWidth ||
      this.y > this.game.height
    ) {
      this.markedForDeletion = true;
    }
  }
  draw(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
  }
}
