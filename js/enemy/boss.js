class Boss {
  constructor(game) {
    this.game = game;
    this.radius = 60;
    this.x = this.game.width / 2;
    this.y = -this.radius;

    this.lockedAngle = 0;
    this.laserBeams = []; // Este array guardará os feixes de luz
    this.orbs = [];

    this.maxHealth = 1000;
    this.currentHealth = this.maxHealth;
    this.markedForDeletion = false;

    this.state = "entering";
    this.attackPhase = "idle";
    this.attackPhaseTimer = 0;

    // --- Propriedades de Movimento ---
    this.initialSpeed = 0.5; // Velocidade inicial do Boss na Fase 1
    this.speed = this.initialSpeed;
    this.moveAmplitudeX = 50; // Amplitude da oscilação horizontal
    this.moveFrequencyX = 0.001; // Frequência da oscilação horizontal
    this.followPlayerThreshold = 50; // Distância mínima para começar a seguir o player em X
    this.targetXPosition = this.x; // Posição X que o boss REALMENTE quer alcançar
    this.lerpFactor = 0.03; // Fator de interpolação linear para suavizar o movimento.
    this.isMoving = true; // Nova flag para controlar o movimento do boss

    // --- Propriedades de Fases ---
    this.phase = 1; // Fase atual do Boss
    this.phase2HealthThreshold = this.maxHealth * 0.66; // Fase 2 em 66% de vida
    this.phase3HealthThreshold = this.maxHealth * 0.33; // Fase 3 em 33% de vida

    this.phase1ColorBody = { r: 165, g: 116, b: 212 }; // #a574d4 (roxo)
    this.phase1ColorGlow = { r: 170, g: 100, b: 255 }; // rgba(170, 100, 255, 0.7)
    this.phase1ColorStroke = { r: 217, g: 179, b: 255 }; // #d9b3ff

    this.phase2ColorBody = { r: 255, g: 140, b: 0 }; // Laranja (darkorange)
    this.phase2ColorGlow = { r: 255, g: 165, b: 0 }; // Laranja mais claro
    this.phase2ColorStroke = { r: 255, g: 200, b: 100 };

    this.phase3ColorBody = { r: 255, g: 0, b: 0 }; // Vermelho puro
    this.phase3ColorGlow = { r: 255, g: 69, b: 0 }; // Vermelho alaranjado (orangered)
    this.phase3ColorStroke = { r: 255, g: 100, b: 100 };

    // Número de lasers por fase
    this.laserBeamCountPhase1 = 1;
    this.laserBeamCountPhase2 = 3;
    this.laserBeamCountPhase3 = 5;

    // Definição dos tempos de fase de ataque (em ms)
    // Estes são os tempos BASE, que serão ajustados por fase
    this.baseAimingDuration = 1000; // Tempo que a mira fica ativa
    this.baseChargingDuration = 700; // Tempo de carregamento
    this.baseLaserActiveDuration = 1500; // Duração que cada laser fica ativo
    this.baseCooldownDuration = 2500; // Tempo de recarga

    this.firingRotationOffset = 0; //  Offset de rotação para a fase de disparo
    this.firingRotationSpeed = Math.PI / 2; //  Velocidade de rotação (meia volta por segundo)
  }

  update(deltaTime, target) {
    if (this.markedForDeletion) {
      // Adicione esta linha
      this.laserBeams = this.laserBeams.filter((lb) => !lb.markedForDeletion); // Garante que lasers existentes sejam limpos
      return; // Sai da função update se o boss estiver marcado para deleção
    }
    if (this.state === "entering") {
      const targetY = 150;
      this.y += (targetY - this.y) * 0.05;
      if (Math.abs(this.y - targetY) < 1) {
        this.y = targetY;
        this.state = "active";
        this.attackPhase = "aiming";
        this.attackPhaseTimer = this.baseAimingDuration; // Inicia com o tempo de mira
        this.isMoving = true; // Boss pode se mover ao entrar
      }
      return;
    }
    if (this.state !== "active") return;

    // --- Partículas de Carregamento ---
    if (this.attackPhase === "charging") {
      // É preciso inicializar chargingParticleTimer e chargingParticleInterval no construtor ou antes de usar
      if (typeof this.chargingParticleTimer === "undefined")
        this.chargingParticleTimer = 0;
      if (typeof this.chargingParticleInterval === "undefined")
        this.chargingParticleInterval = 50; // Exemplo de intervalo
      if (typeof this.chargingParticleCount === "undefined")
        this.chargingParticleCount = 1; // Exemplo de contagem

      this.chargingParticleTimer += deltaTime;
      if (this.chargingParticleTimer >= this.chargingParticleInterval) {
        let particleColor = this.phase1ColorGlow;
        if (this.phase === 2) particleColor = this.phase2ColorGlow;
        else if (this.phase === 3) particleColor = this.phase3ColorGlow;

        const particleHexColor = this.rgbToHex(
          particleColor.r,
          particleColor.g,
          particleColor.b
        );

        this.game.createParticles(
          this.x,
          this.y,
          particleHexColor, // Agora passando a string HEX
          this.chargingParticleCount
        );
        this.chargingParticleTimer = 0;
      }
    }

    // --- Lógica de Fase do Boss ---
    const previousPhase = this.phase;
    if (this.phase === 1 && this.currentHealth <= this.phase2HealthThreshold) {
      this.phase = 2; // Transiciona para a Fase 2
    } else if (
      this.phase === 2 &&
      this.currentHealth <= this.phase3HealthThreshold
    ) {
      this.phase = 3; // Transiciona para a Fase 3
    }

    // Se a fase mudou, aplica os ajustes e treme a tela
    if (this.phase !== previousPhase) {
      console.log(`Boss entrou na Fase ${this.phase}!`);
      if (this.phase === 2) {
        this.game.triggerShake(200, 5); // Tremer a tela para indicar mudança de fase
        this.speed = this.initialSpeed * 1.5; // Aumenta a velocidade em 50%
      } else if (this.phase === 3) {
        this.game.triggerShake(300, 8); // Tremer a tela mais forte
        this.speed = this.initialSpeed * 2.5; // Aumenta a velocidade drasticamente
      }
      // Não ajustamos os timers base aqui, eles serão usados para calcular os tempos da fase atual
    }

    // --- Lógica de Movimento do Boss ---
    if (this.isMoving) {
      // Só se move se a flag isMoving for true
      const playerCenterX = target.x; // Posição X do player
      const bossCenterX = this.x;

      const maxAllowedX = this.game.terrain.worldWidth - this.radius;
      const minAllowedX = 0 + this.radius;

      let desiredXFromPlayer = bossCenterX;

      if (Math.abs(playerCenterX - bossCenterX) > this.followPlayerThreshold) {
        desiredXFromPlayer = playerCenterX;
      }

      const oscillationOffset =
        Math.sin(this.game.gameTime * this.moveFrequencyX) *
        this.moveAmplitudeX;

      this.targetXPosition = Math.max(
        minAllowedX,
        Math.min(maxAllowedX, desiredXFromPlayer + oscillationOffset)
      );

      this.x +=
        (this.targetXPosition - this.x) *
        this.lerpFactor *
        (deltaTime / 16.67) *
        this.speed;
    }
    if (this.phase === 3 && this.attackPhase === "firing") {
      // Ajusta o offset de rotação para criar o efeito de giro
      this.firingRotationOffset +=
        this.firingRotationSpeed * (deltaTime / 1000); // Rotação por segundo
      // Opcional: Garante que o ângulo não cresça indefinidamente
      this.firingRotationOffset %= Math.PI * 2;
    } else {
      // Reseta o offset de rotação quando não está na fase de disparo ou não é fase 3
      this.firingRotationOffset = 0;
    }
    this.updateLaserAttack(deltaTime, target);

    this.laserBeams.forEach((lb) => lb.update(deltaTime));
    this.laserBeams = this.laserBeams.filter((lb) => !lb.markedForDeletion);
  }

  // Ela converte componentes RGB em uma string de cor hexadecimal.
  rgbToHex(r, g, b) {
    const toHex = (c) => {
      // Garante que o valor esteja entre 0 e 255 e converte para hexadecimal.
      // Adiciona um '0' na frente se for um único dígito (ex: 'F' vira '0F').
      const hex = Math.max(0, Math.min(255, c)).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  draw(context, target) {
    if (this.markedForDeletion) return;

    let currentBodyColorRgb = this.phase1ColorBody;
    let currentGlowColorRgb = this.phase1ColorGlow;
    let currentStrokeColorRgb = this.phase1ColorStroke;

    if (this.phase === 2) {
      currentBodyColorRgb = this.phase2ColorBody;
      currentGlowColorRgb = this.phase2ColorGlow;
      currentStrokeColorRgb = this.phase2ColorStroke;
    } else if (this.phase === 3) {
      currentBodyColorRgb = this.phase3ColorBody;
      currentGlowColorRgb = this.phase3ColorGlow;
      currentStrokeColorRgb = this.phase3ColorStroke;
    }

    let glowColor = `rgba(${currentGlowColorRgb.r}, ${currentGlowColorRgb.g}, ${currentGlowColorRgb.b}, 0.7)`;
    if (this.attackPhase === "charging") {
      const pulse = Math.abs(Math.sin(Date.now() * 0.02));
      glowColor = `rgba(${currentGlowColorRgb.r}, ${currentGlowColorRgb.g}, ${
        currentGlowColorRgb.b
      }, ${0.7 + pulse * 0.3})`;
    }

    context.save();
    context.translate(this.x, this.y);

    context.shadowColor = glowColor;
    context.shadowBlur = 30;

    const bodyGrad = context.createRadialGradient(
      0,
      0,
      this.radius * 0.2,
      0,
      0,
      this.radius
    );
    bodyGrad.addColorStop(
      0,
      `rgb(${currentBodyColorRgb.r}, ${currentBodyColorRgb.g}, ${currentBodyColorRgb.b})`
    );
    bodyGrad.addColorStop(
      1,
      `rgb(${currentBodyColorRgb.r * 0.7}, ${currentBodyColorRgb.g * 0.7}, ${
        currentBodyColorRgb.b * 0.7
      })`
    );

    context.fillStyle = bodyGrad;
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = `rgb(${currentStrokeColorRgb.r}, ${currentStrokeColorRgb.g}, ${currentStrokeColorRgb.b})`;
    context.lineWidth = 3;
    context.stroke();
    context.restore();

    // ADIÇÃO DA MIRA DO BOSS (apenas a mira geral do boss)
    if (this.attackPhase === "aiming") {
      context.save();
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(target.x + target.width / 2, target.y + target.height / 2);
      context.strokeStyle = "rgba(255, 0, 0, 0.5)";
      context.lineWidth = 2;
      context.setLineDash([15, 10]);
      context.stroke();
      context.restore();
    }
  }

  updateLaserAttack(deltaTime, target) {
    if (this.markedForDeletion) {
      return;
    }
    this.attackPhaseTimer -= deltaTime;

    // Calcula os tempos de fase com base na fase atual
    let currentAimingDuration = this.baseAimingDuration;
    let currentChargingDuration = this.baseChargingDuration;
    let currentLaserActiveDuration = this.baseLaserActiveDuration;
    let currentCooldownDuration = this.baseCooldownDuration;

    if (this.phase === 2) {
      currentAimingDuration *= 0.8;
      currentChargingDuration *= 0.8;
      currentLaserActiveDuration *= 0.9;
      currentCooldownDuration *= 0.8;
    } else if (this.phase === 3) {
      currentAimingDuration *= 0.6;
      currentChargingDuration *= 0.6;
      currentLaserActiveDuration *= 0.8;
      currentCooldownDuration *= 0.6;
    }

    if (this.attackPhase === "aiming") {
      this.isMoving = false; // Para o boss durante a mira
      const playerCenterX = target.x + target.width / 2;
      const playerCenterY = target.y + target.height / 2;
      this.lockedAngle = Math.atan2(
        playerCenterY - this.y,
        playerCenterX - this.x
      );

      if (this.attackPhaseTimer <= 0) {
        this.attackPhase = "charging";
        this.attackPhaseTimer = currentChargingDuration; // Define o timer para a duração do carregamento
      }
    } else if (this.attackPhase === "charging") {
      this.isMoving = false; // Mantém o boss parado durante o carregamento
      if (this.attackPhaseTimer <= 0) {
       if (this.attackPhaseTimer <= 0) {
        this.attackPhase = "firing";

        // Remove a lógica de rotação que estava aqui.
        // A rotação contínua será controlada em 'update' agora.

        this.laserBeams = [];

        let currentLaserCount;
        let delayIncrement = 0;
        let spreadAngle = 0;

        let currentGlowColorRgb;
        if (this.phase === 1) {
          currentLaserCount = this.laserBeamCountPhase1;
          delayIncrement = 150;
          spreadAngle = 0;
          currentGlowColorRgb = this.phase1ColorGlow;
        } else if (this.phase === 2) {
          currentLaserCount = this.laserBeamCountPhase2;
          delayIncrement = 300;
          spreadAngle = Math.PI / 6;
          currentGlowColorRgb = this.phase2ColorGlow;
        } else {
          // this.phase === 3
          currentLaserCount = this.laserBeamCountPhase3;
          delayIncrement = 100;
          spreadAngle = Math.PI * 2; // Garante 360 graus
          currentGlowColorRgb = this.phase3ColorGlow;
        }

        const lastLaserActivationTime = (currentLaserCount - 1) * delayIncrement;
        this.attackPhaseTimer = lastLaserActivationTime + currentLaserActiveDuration;

        for (let i = 0; i < currentLaserCount; i++) {
          let angleOffset = 0;
          if (currentLaserCount > 1) {
            if (this.phase === 3) {
                // Para a fase 3, use o spreadAngle completo para distribuir.
                // A rotação será adicionada fora deste cálculo.
                angleOffset = (i / currentLaserCount) * spreadAngle;
            } else {
                angleOffset = (i - (currentLaserCount - 1) / 2) * spreadAngle;
            }
          }
          const laserDelay = i * delayIncrement;

          // Adiciona o offset de rotação contínua APENAS na Fase 3
          let finalAngle = this.lockedAngle + angleOffset;
          if (this.phase === 3) {
              finalAngle += this.firingRotationOffset;
          }


          this.laserBeams.push(
            new BossLaser(
              this.game,
              this,
              laserDelay,
              finalAngle, // Usa o ângulo final com rotação
              currentGlowColorRgb,
              currentLaserActiveDuration
            )
          );

          this.game.aoeEffects.push(
            new BossLaserAim(
              this.game,
              this.x,
              this.y,
              finalAngle, // Usa o ângulo final com rotação
              laserDelay
            )
          );
        }
        this.game.aoeEffects.push(new VignetteEffect(this.game));
       }}
    } else if (this.attackPhase === "firing") {
      this.isMoving = false; // Mantém o boss parado durante o disparo
      if (this.attackPhaseTimer <= 0) {
        this.attackPhase = "cooldown";
        this.attackPhaseTimer = currentCooldownDuration; // Define o timer para a duração do cooldown
        this.laserBeams = []; // Garante que os lasers são limpos após o disparo
      }
    } else if (this.attackPhase === "cooldown") {
      this.isMoving = true; // Permite que o boss se mova durante o cooldown
      if (this.attackPhaseTimer <= 0) {
        this.attackPhase = "aiming";
        this.attackPhaseTimer = currentAimingDuration; // Reinicia o timer para a fase de mira
      }
    }
  }

  takeDamage(damage) {
    if (this.state !== "active") {
      return;
    }
    this.currentHealth -= damage;

    this.game.triggerShake(50, 2);
    if (this.currentHealth <= 0) {
      this.currentHealth = 0;
      this.markedForDeletion = true; // <-- Aqui o chefe é marcado
    }
  }
}
