class LaserOrb extends Orb {
  constructor(game, player, angleOffset) {
    super(game, player, angleOffset);
    this.shootCooldown = 2000;

    // Isso garante que o orb tenha tempo de ser visível e carregar um pouco antes de atirar.
    this.shootTimer = -500; // Começa "negativo" para dar um atraso inicial de 500ms antes do primeiro tiro
    // Ajuste este valor para controlar o atraso do primeiro disparo.

    this.baseColor = 0xc77cff; // Roxo base
    this.chargingColor = 0xe0b0ff; // Roxo mais claro para carregamento
    this.firingColor = 0xffe1ff; // Branco/Rosa claro para o flash de disparo
    this.chargeProgress = 0; // Progresso de carregamento (0 a 1)
    this.isFiring = false;
    this.firingTimer = 0;
    this.firingDuration = 100; // Duração do flash de disparo em ms
    this.pulseSpeed = 0.002; // Velocidade da pulsação suave no estado inativo
    this.pulseAmplitude = 0.1; // Amplitude da pulsação suave (escala)
    this.radius = 5; // Raio base do LaserOrb (era 5 no seu código original)
  }

  update(deltaTime) {
    super.update(deltaTime);

    // Apenas atualiza o timer se o jogo estiver rodando
    if (this.game.gameState === "running") {
      this.shootTimer += deltaTime;
    }

    // Calcula o progresso de carregamento, mesmo se o timer estiver negativo
    this.chargeProgress = Math.min(
      1,
      Math.max(0, this.shootTimer / this.shootCooldown)
    );

    if (this.shootTimer >= this.shootCooldown) {
      if (this.game.gameState === "running") {
        const target = this.game.getClosestEnemy(this); // Tenta encontrar um alvo

        // DISPARA SOMENTE SE HOUVER UM ALVO E O JOGO ESTIVER RODANDO
        if (target) {
          const u = this.player.upgrades.laserOrb; // Assume que u é definido como this.player.upgrades.laserOrb
          this.game.aoeEffects.push(
            new LaserBeam(this.game, this, target, u.damage, u.pierce, u.chain)
          );
          this.isFiring = true; // Ativa o feedback de disparo
          this.firingTimer = this.firingDuration;
          this.shootTimer = 0; // Reseta o timer APENAS após um disparo bem-sucedido
        } else {
          // Se não houver alvo, o orb permanece "carregado" e pronto para atirar.
          // Não reseta o shootTimer, para que ele atire assim que um alvo aparecer.
          // O chargeProgress permanecerá em 1.
        }
      } else {
        // Se o jogo não está rodando, o timer não avança, mas o estado visual de "pronto" permanece.
      }
    }

    // Atualiza o timer de feedback de disparo
    if (this.isFiring) {
      this.firingTimer -= deltaTime;
      if (this.firingTimer <= 0) {
        this.isFiring = false;
      }
    }
  }

  draw(context) {
    // Nome do método draw, não drawOrb, para sobrescrever o da classe base Orb
    context.save();
    context.translate(this.x, this.y);

    // Animação de pulsação suave no estado inativo
    const pulse =
      1 + Math.sin(this.game.gameTime * this.pulseSpeed) * this.pulseAmplitude;
    context.scale(pulse, pulse);

    let currentColor = this.baseColor;

    // Feedback de carregamento: Interpola a cor base para a cor de carregamento
    // Só muda a cor se não estiver disparando
    if (this.chargeProgress > 0 && !this.isFiring) {
      currentColor = lerpColor(
        this.baseColor,
        this.chargingColor,
        this.chargeProgress
      );
    }

    // Feedback de disparo: Usa a cor de disparo durante um breve período
    if (this.isFiring) {
      const firingIntensity = this.firingTimer / this.firingDuration; // De 1 a 0
      currentColor = lerpColor(currentColor, this.firingColor, firingIntensity);
    }

    // Desenha o corpo principal do orb
    context.fillStyle = rgbToHex(
      (currentColor >> 16) & 0xff,
      (currentColor >> 8) & 0xff,
      currentColor & 0xff
    );
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2); // Usa this.radius
    context.fill();

    // Desenha um brilho sutil (opcional)
    const glowColorRgb = hexToRgb(
      rgbToHex(
        (currentColor >> 16) & 0xff,
        (currentColor >> 8) & 0xff,
        currentColor & 0xff
      )
    );
    context.shadowColor = `rgba(${glowColorRgb.r}, ${glowColorRgb.g}, ${glowColorRgb.b}, 0.5)`;
    context.shadowBlur = 8;
    context.fill(); // Redesenha para aplicar o brilho

    context.restore();
  }
}
