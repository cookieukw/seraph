class ShooterEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.scale = 2;
    this.width = 11 * this.scale;
    this.height = 18 * this.scale;

    this.x = Math.random() * this.game.width + this.game.camera.x;
    this.y = -this.height;

    this.speed = 1.5;
    this.state = "descending";

    this.targetY = (this.game.height / 5) * 1.5;
    this.shootCooldown = Math.random() * 1000 + 1500;

    this.initialX = this.x;
    this.hoverDirection = 1;
    this.hoverSpeed = 1.5;
    this.hoverDistance = 50; // distância pra andar pra frente e pra trás

    // Knockback
    this.knockbackVelocityX = 0;
    this.knockbackVelocityY = 0;
    this.knockbackDecay = 0.05;
    this.knockbackStrength = 20;

    // Boca animada (abre e fecha)
    this.mouthFrame = 0;
    this.mouthFrameTimer = 0;
    this.mouthFrameDuration = 250;

    // Tilt lateral para dar organicidade
    this.tilt = 0;
    this.maxTilt = 0.15;
  }

  update(deltaTime) {
    // Aplica knockback na posição
    this.x += this.knockbackVelocityX * (deltaTime / 1000);
    this.y += this.knockbackVelocityY * (deltaTime / 1000);

    // Decaimento do knockback
    this.knockbackVelocityX *= (1 - this.knockbackDecay);
    this.knockbackVelocityY *= (1 - this.knockbackDecay);
    if (Math.abs(this.knockbackVelocityX) < 0.1) this.knockbackVelocityX = 0;
    if (Math.abs(this.knockbackVelocityY) < 0.1) this.knockbackVelocityY = 0;

    if (this.state === "descending") {
      this.y += this.speed;
      if (this.y >= this.targetY) {
        this.y = this.targetY;
        this.state = "attacking";
        this.x = this.initialX; // fixa posição X na chegada
      }
    } else if (this.state === "attacking") {
      // Movimento lateral simples
      this.x += this.hoverSpeed * this.hoverDirection;

      // Limites laterais
      const leftLimit = this.initialX - this.hoverDistance;
      const rightLimit = this.initialX + this.hoverDistance;

      if (this.x > rightLimit) {
        this.x = rightLimit;
        this.hoverDirection = -1;
      } else if (this.x < leftLimit) {
        this.x = leftLimit;
        this.hoverDirection = 1;
      }

      // Tilt lateral baseado na direção (pra não travar tilt em 0)
      this.tilt = this.maxTilt * this.hoverDirection;

      // Cooldown tiro
      this.shootCooldown -= deltaTime;
      if (this.shootCooldown <= 0) {
        this.shootCooldown = 2500;

        // Atira no player
        const angle = Math.atan2(
          this.game.player.y - (this.y + this.height / 2),
          this.game.player.x - (this.x + this.width / 2)
        );
        this.game.enemyProjectiles.push(
          new Projectile(
            this.game,
            this.x + this.width / 2,
            this.y + this.height / 2,
            angle,
            false,
            10,
            false
          )
        );

        // Aplica knockback na direção oposta ao tiro
        const knockbackAngle = Math.atan2(
          (this.y + this.height / 2) - this.game.player.y,
          (this.x + this.width / 2) - this.game.player.x
        );
        this.knockbackVelocityX = Math.cos(knockbackAngle) * this.knockbackStrength;
        this.knockbackVelocityY = Math.sin(knockbackAngle) * this.knockbackStrength;
      }
    }

    // Animação boca (abre e fecha)
    this.mouthFrameTimer += deltaTime;
    if (this.mouthFrameTimer >= this.mouthFrameDuration) {
      this.mouthFrameTimer = 0;
      this.mouthFrame = (this.mouthFrame + 1) % 2;
    }
  }

  drawShape(context) {
    const s = this.scale;
    const x = this.x;
    const y = this.y;

    context.save();

    // Aplica tilt lateral
    context.translate(x + this.width / 2, y + this.height / 2);
    context.rotate(this.tilt);
    context.translate(-(x + this.width / 2), -(y + this.height / 2));

    context.fillStyle = "red";
    context.lineWidth = 0;
    context.strokeStyle = "black";

    const drawRect = (xr, yr, w, h) => {
      context.fillRect(x + xr * s, y + yr * s, w * s, h * s);
      context.strokeRect(x + xr * s, y + yr * s, w * s, h * s);
    };

    drawRect(4, 0, 3, 1);
    drawRect(3, 1, 5, 1);
    drawRect(2, 2, 7, 1);
    drawRect(1, 3, 9, 1);
    drawRect(1, 4, 9, 2);
    drawRect(2, 6, 7, 2);
    drawRect(3, 8, 5, 2);
    drawRect(2, 10, 7, 3);
    drawRect(4, 13, 3, 1);
    drawRect(3, 14, 2, 3);
    drawRect(6, 14, 2, 3);
    drawRect(1, 17, 2, 1);
    drawRect(8, 17, 2, 1);

    context.fillStyle = "black";
    if (this.mouthFrame === 1) {
      drawRect(4, 5, 3, 1);
    } else {
      context.lineWidth = 1;
      context.strokeRect(x + 4 * s, y + 5 * s, 3 * s, 1 * s);
      context.lineWidth = 0;
    }

    context.restore();
  }
}
