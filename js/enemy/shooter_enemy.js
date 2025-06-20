class ShooterEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.width = 18;
    this.height = 18;
    this.x = Math.random() * this.game.width + this.game.camera.x;
    this.y = -this.height;
    this.speed = 1.5;
    this.state = "descending";
    this.targetY = (this.game.height / 5) * 1.5;
    this.shootCooldown = Math.random() * 1000 + 1500;
    this.color = "#FF4136";
    this.initialX = this.x;
    this.hoverFrequency = Math.random() * 0.002 + 0.001;
    this.hoverAmplitude = Math.random() * 20 + 20;
    this.hoverOffset = Math.random() * Math.PI * 2;
  }
  update(deltaTime) {
    super.update(deltaTime);
    if (this.state === "descending") {
      this.y += this.speed;
      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.state = "attacking";
        this.initialX = this.x;
      }
    } else if (this.state === "attacking") {
      this.x =
        this.initialX +
        Math.cos(this.game.gameTime * this.hoverFrequency + this.hoverOffset) *
          this.hoverAmplitude;
      this.shootCooldown -= deltaTime;
      if (this.shootCooldown <= 0) {
        const timeProgress = Math.min(this.game.gameTime / 600000, 1.0);
        const minDamage = 8 + 4 * timeProgress;
        const maxDamage = 12 + 10 * timeProgress;
        const damage =
          Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
        const angle = Math.atan2(
          this.game.player.y - this.y,
          this.game.player.x - this.x
        );
        this.game.enemyProjectiles.push(
          new Projectile(
            this.game,
            this.x + this.width / 2,
            this.y + this.height / 2,
            angle,
            false,
            damage,
            false
          )
        );
        this.shootCooldown = 2500;
      }
    }
  }
  drawShape(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}
