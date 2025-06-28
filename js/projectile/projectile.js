class Projectile {
  constructor(game, x, y, angle, isPlayer, damage) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.angle = angle; // Armazena o ângulo inicial
    this.isPlayer = isPlayer;
    this.damage = damage;

    const pUpgrades = this.game.player.upgrades;

    // === ALTERAÇÃO: TELEGUIDO É ATIVO SE O UPGRADE ESTÁ LIGADO E É TIRO DO JOGADOR ===
    this.isHoming = pUpgrades.hasHomingProjectiles.value && this.isPlayer;

    // Pierce: Projéteis teleguiados NÃO perfuram (pierce = 0).
    // Outros projéteis do jogador (que não são teleguiados) ainda podem ter pierce.
    this.pierce = 0;
    if (!this.isHoming) {
      this.pierce = pUpgrades.pierce.value;
    }

    this.ricochets = pUpgrades.ricochet.value;
    this.shrapnel = pUpgrades.shrapnel.value;
    this.combustionChance = pUpgrades.combustion.chance;
    this.infectionChance = pUpgrades.infection.chance;

    // O alvo é definido no construtor. Se for teleguiado, busca o alvo mais próximo.
    this.target = this.isHoming
      ? this.game.getClosestTarget({ x: this.x, y: this.y })
      : null;

    // === NOVAS/AJUSTADAS PROPRIEDADES PARA A PERSEGUIÇÃO INTELIGENTE ===
    this.homingStrength = 0.08; // Força da perseguição (velocidade de giro do míssil por frame). Ajuste conforme a necessidade de "agressividade".
    // Valores entre 0.05 e 0.15 costumam ser bons.
    this.homingDuration = 3000; // Duração em milissegundos que o míssil tentará perseguir (ex: 3 segundos).
    this.homingTimer = 0; // Contador para a duração da perseguição
    // Não precisamos de homingArcAngle se o míssil pode virar mais livremente.
    // Se quiser limitar a virada, reintroduza e ajuste.
    // ===============================================================

    const pxPerMsPlayer = 7 / 16.67; // Velocidade base do projétil do jogador em pixels/ms
    const pxPerMsEnemy = 4 / 16.67; // Velocidade base do projétil inimigo em pixels/ms

    this.speed = isPlayer ? pxPerMsPlayer : pxPerMsEnemy;

    this.velocityX = Math.cos(this.angle) * this.speed;
    this.velocityY = Math.sin(this.angle) * this.speed;

    this.baseRadius = isPlayer ? 3 : 5;
    this.radius = this.baseRadius;

    this.playerCoreColor = 0x90e0ef;
    this.playerGlowColor = 0xccf7ff;
    this.enemyCoreColor = 0xff4136;
    this.enemyGlowColor = 0xff8880;

    this.markedForDeletion = false;

    this.trailLength = isPlayer ? 6 : 10;
    this.trailPoints = [];
    this.trailDensity = 5;
    this.trailCounter = 0;

    this.pulseFrequency = isPlayer ? 0.02 : 0.03;
    this.pulseAmplitude = isPlayer ? 0.5 : 1.0;
  }

  update(deltaTime) {
    if (this.markedForDeletion) return;

    // Atualiza pontos da trilha
    this.trailCounter++;
    if (this.trailCounter >= this.trailDensity) {
      this.trailPoints.unshift({ x: this.x, y: this.y });
      if (this.trailPoints.length > this.trailLength) {
        this.trailPoints.pop();
      }
      this.trailCounter = 0;
    }

    // === Lógica de Perseguição Contínua (Inteligente) ===
    // O míssil persegue enquanto for teleguiado e dentro da duração de perseguição
    if (this.isHoming && this.homingTimer < this.homingDuration) {
      // Se o alvo atual é inválido (morreu, marcado para deleção) ou não existe, tenta encontrar um novo.
      if (!this.target || this.target.markedForDeletion) {
        this.target = this.game.getClosestTarget({ x: this.x, y: this.y });
      }

      if (this.target && !this.target.markedForDeletion) {
        const angleToTarget = Math.atan2(
          this.target.y - this.y,
          this.target.x - this.x
        );

        let angleDifference = angleToTarget - this.angle;

        // Normaliza a diferença de ângulo para estar entre -PI e PI
        if (angleDifference > Math.PI) angleDifference -= 2 * Math.PI;
        if (angleDifference < -Math.PI) angleDifference += 2 * Math.PI;

        // Ajusta o ângulo do míssil gradualmente.
        // Multiplica por deltaTime / 16.67 para consistência de FPS.
        this.angle +=
          angleDifference * this.homingStrength * (deltaTime / 16.67);

        // Recalcula as velocidades X e Y com o novo ângulo
        this.velocityX = Math.cos(this.angle) * this.speed;
        this.velocityY = Math.sin(this.angle) * this.speed;
      }
      this.homingTimer += deltaTime; // Incrementa o timer da perseguição
    }
    // ===========================================

    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;

    this.radius =
      this.baseRadius +
      Math.sin(this.game.gameTime * this.pulseFrequency) * this.pulseAmplitude;

    let bounced = false;
    if (this.ricochets > 0) {
      const worldWidth = this.game.terrain
        ? this.game.terrain.worldWidth
        : this.game.width;

      if (this.x - this.radius < 0) {
        this.x = this.radius;
        this.velocityX *= -1;
        bounced = true;
      } else if (this.x + this.radius > worldWidth) {
        this.x = worldWidth - this.radius;
        this.velocityX *= -1;
        bounced = true;
      }

      if (this.y - this.radius < 0) {
        this.y = this.radius;
        this.velocityY *= -1;
        bounced = true;
      }

      if (bounced) {
        this.ricochets--;
      }
    }

    const cameraX = this.game.camera ? this.game.camera.x : 0;
    const cameraY = this.game.camera ? this.game.camera.y : 0;

    const deletionMargin = 100;

    if (
      this.x + this.radius < cameraX - deletionMargin ||
      this.x - this.radius > cameraX + this.game.width + deletionMargin ||
      this.y + this.radius < cameraY - deletionMargin ||
      this.y - this.radius > cameraY + this.game.height + deletionMargin
    ) {
      this.markedForDeletion = true;
    }
  }

  // === MÉTODO DRAW COMPLETO ===
  draw(context) {
    context.save();
    context.lineCap = "round"; // Para pontas arredondadas da trilha e brilhos

    // Determina as cores principais e de brilho com base se é do jogador ou inimigo
    const coreColor = this.isPlayer
      ? this.playerCoreColor
      : this.enemyCoreColor;
    const glowColor = this.isPlayer
      ? this.playerGlowColor
      : this.enemyGlowColor;

    // Converte as cores numéricas para componentes RGB uma única vez por chamada de draw
    const r_core = (coreColor >> 16) & 0xff;
    const g_core = (coreColor >> 8) & 0xff;
    const b_core = coreColor & 0xff;

    const r_glow = (glowColor >> 16) & 0xff;
    const g_glow = (glowColor >> 8) & 0xff;
    const b_glow = glowColor & 0xff;

    // --- Desenha a Trilha ---
    for (let i = 0; i < this.trailPoints.length; i++) {
      const point = this.trailPoints[i];
      const alpha = 1 - i / this.trailLength; // Opacidade diminui ao longo da trilha
      const trailRadius = this.radius * (1 - i / (this.trailLength + 2)); // Raio diminui ao longo da trilha

      // Desenha a parte de brilho da trilha
      context.beginPath();
      context.arc(point.x, point.y, trailRadius * 1.5, 0, Math.PI * 2); // Maior para o brilho
      context.fillStyle = `rgba(${r_glow}, ${g_glow}, ${b_glow}, ${
        alpha * 0.4
      })`; // Brilho translúcido
      context.fill();

      // Desenha a parte central da trilha
      context.beginPath();
      context.arc(point.x, point.y, trailRadius, 0, Math.PI * 2);
      context.fillStyle = `rgba(${r_core}, ${g_core}, ${b_core}, ${
        alpha * 0.8
      })`; // Mais opaco que o brilho
      context.fill();
    }

    // --- Desenha o Corpo Principal do Projétil (Posição Atual) ---
    // Desenha o brilho principal do projétil
    context.beginPath();
    context.arc(this.x, this.y, this.radius * 1.2, 0, Math.PI * 2); // Ligeiramente maior para o efeito de brilho
    context.fillStyle = `rgba(${r_glow}, ${g_glow}, ${b_glow}, 0.8)`; // Cor do brilho com boa opacidade
    context.shadowBlur = this.radius * 2; // Brilho mais forte para o projétil principal
    context.shadowColor = `rgb(${r_glow}, ${g_glow}, ${b_glow})`; // Cor do brilho
    context.fill();
    context.shadowBlur = 0; // Reseta shadowBlur para não afetar outros desenhos

    // Desenha o núcleo do projétil
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = `rgb(${r_core}, ${g_core}, ${b_core})`; // Cor sólida do núcleo
    context.fill();

    context.restore();
  }
}
