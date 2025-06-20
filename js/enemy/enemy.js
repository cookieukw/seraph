class Enemy {
  constructor(game) {
    this.game = game;
    this.markedForDeletion = false;
    this.health = 1 + Math.floor(this.game.gameTime / 35000);
    this.xpValue = 25;
    this.statusEffects = {
      combustion: { active: false, damage: 0, duration: 0, timer: 0 },
      infection: { active: false },
    };
  }
  update(deltaTime) {
    if (this.statusEffects.combustion.active) {
      const s = this.statusEffects.combustion;
      s.timer += deltaTime;
      if (s.timer > 1000) {
        this.health -= s.damage;
        if (this.health <= 0) this.markedForDeletion = true;
        s.timer = 0;
        s.duration--;
      }
      if (s.duration <= 0) s.active = false;
    }
  }
  draw(context) {
    context.save();
    if (this.statusEffects.combustion.active) {
      context.shadowColor = "orange";
      context.shadowBlur = 10;
    }
    if (this.statusEffects.infection.active) {
      context.filter = "saturate(0.5) sepia(1)";
    }
    this.drawShape(context);
    context.restore();
  }
  drawShape(context) {}
  takeDamage(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.markedForDeletion = true;
      if (this.statusEffects.infection.active) {
        this.game.triggerInfectionExplosion(
          this.x,
          this.y,
          this.width,
          this.height
        );
      }
      if (this.game.player.upgrades.corpseExplosion.level > 0) {
        this.game.triggerCorpseExplosion(
          this.x + this.width / 2,
          this.y + this.height / 2
        );
      }
      this.game.createParticles(
        this.x + this.width / 2,
        this.y + this.height / 2,
        this.color
      );
      this.game.player.gainXP(this.xpValue);
      this.game.player.onKill();
    }
  }
}
