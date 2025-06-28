class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 16;
    this.fontFamily = "'Press Start 2P', cursive";
    this.levelUpText = "";
    this.levelUpTextOpacity = 0;
    // Adicione uma margem superior para o tempo e status
    this.topMargin = 20; 
    this.leftMargin = 20;
    this.lineHeight = 30; // Espaçamento entre as linhas de texto
  }

  draw(context) {
    context.save(); // Salva o estado inicial do contexto
    
    // Configurações de estilo base para a UI
    context.fillStyle = "white";
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.shadowColor = "black";
    context.shadowBlur = 4;
    
    // --- HUD DO JOGADOR E INFORMAÇÕES DO JOGO ---

    // 1. Pontos (topo esquerdo)
    context.textAlign = "left";
    context.fillText(`PONTOS: ${this.game.score}`, this.leftMargin, this.topMargin + 15);

    // 2. Barras de HP e XP (logo abaixo dos pontos)
    const barWidth = 200;
    let healthBarX = this.leftMargin;
    let healthBarY = this.topMargin + 30; // Ajusta Y para ficar abaixo dos pontos
    
    // HP Bar Background
    context.fillStyle = "maroon";
    context.fillRect(healthBarX, healthBarY, barWidth, 25);
    // HP Bar Foreground
    const currentHealthWidth = (this.game.player.health / this.game.player.maxHealth) * barWidth;
    context.fillStyle = "green";
    context.fillRect(healthBarX, healthBarY, currentHealthWidth, 25);
    // HP Bar Border
    context.strokeStyle = "white";
    context.strokeRect(healthBarX, healthBarY, barWidth, 25);
    // HP Text
    context.fillStyle = "white";
    context.textAlign = "center";
    context.font = `${this.fontSize - 4}px ${this.fontFamily}`;
    context.fillText(`HP: ${Math.ceil(this.game.player.health)} / ${this.game.player.maxHealth}`, healthBarX + barWidth / 2, healthBarY + 18);
    
    let xpBarY = healthBarY + 25 + 5; // Abaixo da barra de HP, com uma pequena margem
    // XP Bar Background
    context.fillStyle = "#4B0082";
    context.fillRect(healthBarX, xpBarY, barWidth, 15);
    // XP Bar Foreground
    const currentXpWidth = (this.game.player.xp / this.game.player.xpToNextLevel) * barWidth;
    context.fillStyle = "#9370DB";
    context.fillRect(healthBarX, xpBarY, currentXpWidth, 15);
    // XP Bar Border
    context.strokeStyle = "white";
    context.strokeRect(healthBarX, xpBarY, barWidth, 15);
    // XP Text
    context.textAlign = "center";
    context.fillText(`XP`, healthBarX + barWidth / 2, xpBarY + 12);

    // Nível do Jogador (Abaixo das barras)
    context.textAlign = "left";
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    let currentLeftY = xpBarY + 15 + this.lineHeight; // Posição Y atual para elementos da esquerda
    context.fillText(`NIVEL: ${this.game.player.level}`, this.leftMargin, currentLeftY);


    // 3. Tempo de Jogo (Lateral esquerda, abaixo do nível)
    const elapsed = Math.floor(this.game.gameTime / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.textAlign = "left"; // Alinha à esquerda
    currentLeftY += this.lineHeight; // Pula para a próxima linha
    context.fillText(`TEMPO: ${minutes}:${seconds}`, this.leftMargin, currentLeftY);


    // 4. Status (Parasitado, Frenesi) - Agora também na lateral esquerda, abaixo do tempo
    context.textAlign = "left"; // Alinha os status à esquerda

    if (this.game.player.latchedParasites > 0) { // Ou this.game.player.isParasitized()
        context.fillStyle = "#2ECC40"; // Verde
        currentLeftY += this.lineHeight; // Pula para a próxima linha
        context.fillText(`PARASITADO! (${this.game.player.latchedParasites})`, this.leftMargin, currentLeftY);
    }

    if (this.game.player.speedBoosts.length > 0) {
      context.fillStyle = "yellow";
      currentLeftY += this.lineHeight; // Pula para a próxima linha
      context.fillText(`FRENESI x${this.game.player.speedBoosts.length}`, this.leftMargin, currentLeftY);
    }
    
    // --- Barra de Vida do Boss (já estava bem posicionada no rodapé) ---
    if (this.game.boss && !this.game.boss.markedForDeletion) {
        const bossBarHeight = 25;
        const bossBarY = this.game.height - bossBarHeight - 20; 
        const bossBarWidth = this.game.width * 0.75;
        const bossBarX = (this.game.width - bossBarWidth) / 2;
        
        context.fillStyle = 'rgba(100, 0, 0, 0.8)';
        context.fillRect(bossBarX, bossBarY, bossBarWidth, bossBarHeight);

        const currentBossHealthWidth = (this.game.boss.currentHealth / this.game.boss.maxHealth) * bossBarWidth;
        context.fillStyle = '#e74c3c';
        context.fillRect(bossBarX, bossBarY, currentBossHealthWidth, bossBarHeight);

        context.strokeStyle = 'white';
        context.lineWidth = 2;
        context.strokeRect(bossBarX, bossBarY, bossBarWidth, bossBarHeight);
        
        context.fillStyle = "white";
        context.font = `14px ${this.fontFamily}`;
        context.textAlign = "center";
        context.fillText(`${Math.ceil(this.game.boss.currentHealth)} / ${this.game.boss.maxHealth}`, this.game.width / 2, bossBarY + 18);
    }
    
    // --- Efeitos Globais (Level Up, Vignette) ---
    if (this.levelUpTextOpacity > 0) {
      context.save();
      context.font = `24px ${this.fontFamily}`;
      context.fillStyle = `rgba(255, 215, 0, ${this.levelUpTextOpacity})`;
      context.textAlign = "center";
      context.fillText(this.levelUpText, this.game.width / 2, this.game.height / 2);
      this.levelUpTextOpacity -= 0.02;
      context.restore();
    }
 
    if (this.game.damageVignetteOpacity > 0) {
      if (!this.cachedDamageGradient) {
        this.createCachedDamageGradient();
      }
      context.save();
      context.globalAlpha = this.game.damageVignetteOpacity;
      context.fillStyle = this.cachedDamageGradient;
      context.fillRect(0, 0, this.game.width, this.game.height);
      context.restore();
      this.game.damageVignetteOpacity -= 0.02;
    }
    
    context.restore(); // Restaura o contexto APÓS todos os desenhos da UI principal
  }

  // --- MÉTODOS AUXILIARES ---

  showLevelUpFeedback(x, y) {
    this.levelUpText = "NIVEL AVANCADO!";
    this.levelUpTextOpacity = 1.0;
  }

  createCachedDamageGradient() {
    if (
      !this.cachedDamageGradient ||
      this.game.width !== (this.cachedDamageGradient._width || 0) ||
      this.game.height !== (this.cachedDamageGradient._height || 0)
    ) {
      const gradient = this.game.ctx.createRadialGradient(
        this.game.width / 2,
        this.game.height / 2,
        this.game.width / 3,
        this.game.width / 2,
        this.game.height / 2,
        this.game.width / 2
      );
      gradient.addColorStop(0, `rgba(255, 0, 0, 0)`);
      gradient.addColorStop(1, `rgba(255, 0, 0, 1)`);
      this.cachedDamageGradient = gradient;
      this.cachedDamageGradient._width = this.game.width;
      this.cachedDamageGradient._height = this.game.height;
    }
  }
}