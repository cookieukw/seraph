class LaserBeam {

  constructor(game, source, target, damage, pierce, chain) {
    this.game = game;
    this.source = source; // O LaserOrb que disparou (deve ter .x e .y)
    this.target = target; // O inimigo alvo (pode ser null se o alvo sumir, mas usamos a lastKnownTargetPosition)
    this.damage = damage;
    this.pierce = pierce;
    this.chain = chain;
    this.duration = 500; // Duração total do laser visível (ms)
    this.timer = 0;
    this.markedForDeletion = false;
    this.enemiesHit = new Set(); // Para evitar hits múltiplos no mesmo inimigo por frame/laser

      // Isso garante que o laser terá um ponto final, mesmo se o alvo morrer/desaparecer imediatamente.
    this.lastKnownTargetX = target ? target.x + target.width / 2 : source.x; // Se target é nulo, aponta para a source
    this.lastKnownTargetY = target ? target.y + target.height / 2 : source.y;

    // Propriedades de animação visual
    this.baseWidth = 8; // Largura base do laser
    this.coreColor = 0xffffff; // Branco puro para o núcleo
    this.glowColor = 0xff00ff; // Magenta para o brilho externo
    this.startFlashDuration = 80; // Duração do flash inicial
    this.startFlashTimer = this.startFlashDuration; // Timer para o flash inicial
    this.pulseFrequency = 0.07; // Frequência da pulsação de largura
    this.pulseAmplitude = 5; // Amplitude da pulsação de largura
  }

  update(deltaTime) {
   
    this.timer += deltaTime;
    if (this.timer > this.duration) {
      this.markedForDeletion = true;
    }

    // Atualiza o timer do flash inicial
    if (this.startFlashTimer > 0) {
      this.startFlashTimer -= deltaTime;
    }

    // Se o alvo original existir e ainda não estiver marcado para deleção, atualiza a lastKnownTargetPosition.
    // Isso permite que o laser siga o alvo enquanto ele existe.
    if (this.target && !this.target.markedForDeletion) {
      this.lastKnownTargetX = this.target.x + this.target.width / 2;
      this.lastKnownTargetY = this.target.y + this.target.height / 2;
    }
  }

  draw(context) {
       // O laser deve sempre desenhar do source para a lastKnownTargetPosition.
    if (
      !this.source ||
      typeof this.source.x === "undefined" ||
      typeof this.source.y === "undefined"
    ) {
      return;
    }

    context.save();
    context.lineCap = "round"; // Pontas arredondadas para o feixe de laser
    context.lineJoin = "round"; // Juntas arredondadas

    // Calcula a opacidade base do laser, diminuindo com o tempo
    const fadeProgress = this.timer / this.duration; // Vai de 0 a 1
    const baseAlpha = 0.9 * (1 - fadeProgress); // Começa em 0.9 e vai para 0

    // Calcula a largura atual com pulsação
    const pulseEffect =
      Math.sin(this.game.gameTime * this.pulseFrequency) * this.pulseAmplitude;
    let currentWidth = this.baseWidth + pulseEffect;

    // Efeito de flash inicial: aumenta a largura e opacidade no começo
    let finalGlobalAlpha = baseAlpha; // Alpha padrão
    if (this.startFlashTimer > 0) {
      const flashProgress = this.startFlashTimer / this.startFlashDuration; // Vai de 1 (início) a 0 (fim do flash)
      currentWidth += this.baseWidth * 0.8 * flashProgress; // Aumenta a largura para o flash
      finalGlobalAlpha = Math.min(1, baseAlpha + 0.5 * flashProgress); // Alpha maior durante o flash, máximo 1
    }
    context.globalAlpha = finalGlobalAlpha; // Aplica o alpha global para tudo que for desenhado a seguir

    // --- Desenha o brilho externo do laser (glow) ---
    context.strokeStyle = `rgba(${
      hexToRgb(
        rgbToHex(
          (this.glowColor >> 16) & 0xff,
          (this.glowColor >> 8) & 0xff,
          this.glowColor & 0xff
        )
      ).r
    }, ${
      hexToRgb(
        rgbToHex(
          (this.glowColor >> 16) & 0xff,
          (this.glowColor >> 8) & 0xff,
          this.glowColor & 0xff
        )
      ).g
    }, ${
      hexToRgb(
        rgbToHex(
          (this.glowColor >> 16) & 0xff,
          (this.glowColor >> 8) & 0xff,
          this.glowColor & 0xff
        )
      ).b
    }, ${finalGlobalAlpha * 0.7})`; // Alpha ligeiramente menor para o brilho
    context.lineWidth = currentWidth + 8; // Largura maior para o brilho
    context.shadowBlur = currentWidth * 2; // Brilho mais forte
    context.shadowColor = `rgba(${
      hexToRgb(
        rgbToHex(
          (this.glowColor >> 16) & 0xff,
          (this.glowColor >> 8) & 0xff,
          this.glowColor & 0xff
        )
      ).r
    }, ${
      hexToRgb(
        rgbToHex(
          (this.glowColor >> 16) & 0xff,
          (this.glowColor >> 8) & 0xff,
          this.glowColor & 0xff
        )
      ).g
    }, ${
      hexToRgb(
        rgbToHex(
          (this.glowColor >> 16) & 0xff,
          (this.glowColor >> 8) & 0xff,
          this.glowColor & 0xff
        )
      ).b
    }, ${finalGlobalAlpha * 0.9})`; // Cor do brilho com alpha mais alto

    context.beginPath();
    context.moveTo(this.source.x, this.source.y);
    // MODIFICAÇÃO: Usa lastKnownTargetX/Y para garantir que o laser sempre tenha um ponto final.
    context.lineTo(this.lastKnownTargetX, this.lastKnownTargetY);
    context.stroke();

    // --- Desenha o núcleo do laser (mais fino e opaco) ---
    context.strokeStyle = `rgba(${
      hexToRgb(
        rgbToHex(
          (this.coreColor >> 16) & 0xff,
          (this.coreColor >> 8) & 0xff,
          this.coreColor & 0xff
        )
      ).r
    }, ${
      hexToRgb(
        rgbToHex(
          (this.coreColor >> 16) & 0xff,
          (this.coreColor >> 8) & 0xff,
          this.coreColor & 0xff
        )
      ).g
    }, ${
      hexToRgb(
        rgbToHex(
          (this.coreColor >> 16) & 0xff,
          (this.coreColor >> 8) & 0xff,
          this.coreColor & 0xff
        )
      ).b
    }, ${finalGlobalAlpha})`; // Usa o alpha global
    context.lineWidth = currentWidth; // Largura do núcleo
    context.shadowBlur = 0; // Desativa o brilho para o núcleo
    context.stroke();

    context.restore(); // Restaura o contexto
  }
}
