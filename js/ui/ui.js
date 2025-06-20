class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 16;
    this.fontFamily = "'Press Start 2P', cursive";
    this.levelUpText = "";
    this.levelUpTextOpacity = 0;
  }

  draw(context) {
    context.save();
    context.fillStyle = "white";
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.textAlign = "left";
    context.shadowColor = "black";
    context.shadowBlur = 4;
    context.fillText(`PONTOS: ${this.game.score}`, 20, 35);
    context.fillText(`NIVEL: ${this.game.player.level}`, 20, 155);
    const barWidth = 200;
    let barHeight = 25;
    let healthBarX = 20;
    let healthBarY = 50;
    context.fillStyle = "maroon";
    context.fillRect(healthBarX, healthBarY, barWidth, barHeight);
    const currentHealthWidth =
      (this.game.player.health / this.game.player.maxHealth) * barWidth;
    context.fillStyle = "green";
    context.fillRect(healthBarX, healthBarY, currentHealthWidth, barHeight);
    context.strokeStyle = "white";
    context.strokeRect(healthBarX, healthBarY, barWidth, barHeight);
    context.fillStyle = "white";
    context.textAlign = "center";
    context.font = `${this.fontSize - 4}px ${this.fontFamily}`;
    context.fillText(
      `HP: ${Math.ceil(this.game.player.health)} / ${
        this.game.player.maxHealth
      }`,
      healthBarX + barWidth / 2,
      healthBarY + 18
    );
    let xpBarY = 85;
    context.fillStyle = "#4B0082";
    context.fillRect(healthBarX, xpBarY, barWidth, 15);
    const currentXpWidth =
      (this.game.player.xp / this.game.player.xpToNextLevel) * barWidth;
    context.fillStyle = "#9370DB";
    context.fillRect(healthBarX, xpBarY, currentXpWidth, 15);
    context.strokeStyle = "white";
    context.strokeRect(healthBarX, xpBarY, barWidth, 15);
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText(`XP`, healthBarX + barWidth / 2, xpBarY + 12);

    const statusYStart = 185;
    context.textAlign = "left";
    let statusLine = 0;
    if (this.game.player.isParasitized()) {
      context.fillStyle = "#2ECC40";
      context.fillText("PARASITADO!", 210, 150);
      statusLine++;
    }
    if (this.game.player.speedBoosts.length > 0) {
      context.fillStyle = "yellow";
      context.fillText(
        `FRENESI x${this.game.player.speedBoosts.length}`,
        20,
        statusYStart + statusLine * 30
      );
      statusLine++;
    }

    if (this.levelUpTextOpacity > 0) {
      context.save();
      context.translate(-this.game.camera.x, 0);
      context.font = `24px ${this.fontFamily}`;
      context.fillStyle = `rgba(255, 215, 0, ${this.levelUpTextOpacity})`;
      context.textAlign = "center";
      context.fillText(this.levelUpText, this.levelUpX, this.levelUpY);
      this.levelUpTextOpacity -= 0.02;
      context.restore();
    }
  
    if (this.game.damageVignetteOpacity > 0) {
      // Garante que o gradiente foi criado.
      // Chamar createCachedDamageGradient() aqui é uma boa fallback
      // caso não seja chamado em triggerDamageVignette, mas o ideal é que triggerDamageVignette o chame primeiro.
      if (!this.cachedDamageGradient) {
        this.createCachedDamageGradient();
      }

      context.save(); // Salva o contexto para aplicar globalAlpha temporariamente
      context.globalAlpha = this.game.damageVignetteOpacity; // Controla a opacidade geral do gradiente
      context.fillStyle = this.cachedDamageGradient; // Usa o gradiente pré-criado
      context.fillRect(0, 0, this.game.width, this.game.height); // Desenha
      context.restore(); // Restaura globalAlpha para 1.0

      this.game.damageVignetteOpacity -= 0.02; // Continua o decaimento da opacidade
    }
    

    const elapsed = Math.floor(this.game.gameTime / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");
    context.fillStyle = "white";
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.textAlign = "right";
    context.fillText(`TEMPO: ${minutes}:${seconds}`, 210, 190);

    context.restore();
  }
  showLevelUpFeedback(x, y) {
    this.levelUpText = "NIVEL AVANCADO!";
    this.levelUpX = x;
    this.levelUpY = y - 40;
    this.levelUpTextOpacity = 1.0;
  }

  // NOVO MÉTODO: Cria e armazena o gradiente de dano UMA VEZ
  createCachedDamageGradient() {
    // Recria apenas se não existe (primeira vez) ou se o tamanho do canvas mudou
    // (boa prática se o canvas for redimensionável)
    if (
      !this.cachedDamageGradient ||
      this.game.width !== (this.cachedDamageGradient._width || 0) || // Checa se a largura do canvas mudou
      this.game.height !== (this.cachedDamageGradient._height || 0)
    ) {
      // Checa se a altura do canvas mudou

      const gradient = this.game.ctx.createRadialGradient(
        this.game.width / 2,
        this.game.height / 2,
        this.game.width / 3, // Raio interno
        this.game.width / 2,
        this.game.height / 2,
        this.game.width / 2 // Raio externo
      );
      // O gradiente é criado com o vermelho opaco no final. A transparência será controlada por globalAlpha.
      gradient.addColorStop(0, `rgba(255, 0, 0, 0)`); // Centro transparente
      gradient.addColorStop(1, `rgba(255, 0, 0, 1)`); // Borda vermelha opaca (alpha total)

      this.cachedDamageGradient = gradient;
      // Armazena as dimensões do canvas associadas a este gradiente para checagens futuras
      this.cachedDamageGradient._width = this.game.width;
      this.cachedDamageGradient._height = this.game.height;
    }
  }
}
