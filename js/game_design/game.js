class Game {
  constructor(width, height, ctx) {
    this.width = width;
    this.height = height;
    this.ctx = ctx;
    this.setup();
  }

  setup() {
    this.terrain = new Terrain(this);
    this.background = new Background(this);
    this.player = new Player(this);
    this.camera = new Camera(this);
    this.input = new InputHandler(this);
    this.ui = new UI(this);
    this.mouse = { x: 0, y: 0 };
    this.isMouseDown = false;
    this.projectiles = [];
    this.enemies = [];
    this.enemyProjectiles = [];
    this.particles = [];
    this.aoeEffects = [];
    this.enemySpawnRate = 2000;
    this.enemySpawnTimer = 0;
    this.gameState = "running";
    this.autoAimActive = false;
    this.particlesEnabled = true;
    this.screenShakeEnabled = true;
    this.damageVignetteOpacity = 0;

    this.shakeTimer = 0; // Temporizador de duração do tremor
    this.shakeDuration = 0; // Duração total do tremor (definida em triggerShake)
    this.shakeMagnitude = 0; // Magnitude inicial do tremor
    this.shakeFrequencyX = 0.02; // Frequência da oscilação no eixo X
    this.shakeFrequencyY = 0.03; // Frequência da oscilação no eixo Y
    this.shakeOffsetX = 0; // Offset X atual do tremor
    this.shakeOffsetY = 0; // Offset Y atual do tremor

    this.score = 0;
    this.gameTime = 0;
    this.scoreTimer = 0;
    this.scoreInterval = 2000;
  

     this.bossDefeatedFlag = false; //  flag para controlar a derrota do boss
    this.initialEnemySpawnRate = 2000; // Guarda a taxa inicial
    this.enemySpawnRate = this.initialEnemySpawnRate; //

    this.boss = null; // O chefe começa como nulo
    this.bossTriggered = false; // Para garantir que o chefe seja criado apenas uma vez
    this.enemySpawnRate = 2000; // Mantém a taxa de spawn de inimigos normais
    this.backgroundParticles = [];

    this.pauseMenu = document.getElementById("pause-menu");
    this.levelUpScreen = document.getElementById("level-up-screen");
    this.upgradeChoicesContainer = document.getElementById(
      "upgrade-choices-container"
    );
    this.debugMenu = document.getElementById("debug-menu");
    this.debugUpgradesContainer = document.getElementById(
      "debug-upgrades-container"
    );
    this.isDebugMenuOpen = false;

    this.gameControls = document.getElementById("game-controls");
    this.pauseBtn = document.getElementById("pause-btn");
    this.resumeBtn = document.getElementById("resume-btn");
    this.autoAimBtn = document.getElementById("auto-aim-btn");
    this.particleToggle = document.getElementById("particle-toggle");
    this.shakeToggle = document.getElementById("shake-toggle");
    this.exitMenuBtn = document.getElementById("exit-menu-btn");

    this.particleToggle.checked = this.particlesEnabled;
    this.shakeToggle.checked = this.screenShakeEnabled;

    this.gameControls.style.display = "flex";
    this.pauseMenu.classList.remove("active");
    this.levelUpScreen.classList.remove("active");
    this.debugMenu.classList.remove("active");

   this.boss = null; // O chefe começa como nulo
    this.bossTriggered = false; // Para garantir que o chefe seja criado apenas uma vez
    this.initialEnemySpawnRate = 2000; // Guarda a taxa inicial de spawn de inimigos
    this.enemySpawnRate = this.initialEnemySpawnRate;
    this.bossDefeatedFlag = false; // Flag para controlar o estado de derrota do boss


    for (let i = 0; i < 150; i++) {
      this.backgroundParticles.push(new BackgroundParticle(this));
    }

    if (!this.listenersAdded) {
      // Pega uma referência ao elemento canvas para o cálculo
      const canvas = this.ctx.canvas;

      window.addEventListener("mousemove", (e) => {
        if (this.mouse) {
          // Pega o tamanho e a posição do canvas na página
          const rect = canvas.getBoundingClientRect();

          // Calcula a posição exata do mouse DENTRO do canvas
          this.mouse.x = e.clientX - rect.left;
          this.mouse.y = e.clientY - rect.top;
        }
      });
      window.addEventListener("mousedown", (e) => {
        // Esta verificação também pode ser melhorada para usar o rect
        const canvas = this.ctx.canvas;
        if (e.target === canvas) this.isMouseDown = true;
      });
      window.addEventListener("mouseup", (e) => {
        this.isMouseDown = false;
      });
      this.pauseBtn.addEventListener("click", () => this.togglePause());
      this.resumeBtn.addEventListener("click", () => this.togglePause());
      this.autoAimBtn.addEventListener("click", () => this.toggleAutoAim());
      this.particleToggle.addEventListener("change", (e) => {
        this.particlesEnabled = e.target.checked;
      });
      this.shakeToggle.addEventListener("change", (e) => {
        this.screenShakeEnabled = e.target.checked;
      });
      this.exitMenuBtn.addEventListener("click", () => {
        console.log("Sair para o menu");
      });
      this.listenersAdded = true;
    }
  }
  update(deltaTime) {
    deltaTime = Math.min(deltaTime, 100); // Não permite que deltaTime seja maior que 100ms
    // Condição para invocar o chefe
     // Condição para invocar o chefe
    if (this.score >= 5000 && !this.bossTriggered && !this.bossDefeatedFlag) { //
      this.bossTriggered = true; //
      this.boss = new Boss(this); // Cria o chefe
      this.enemies = []; // Limpa os inimigos normais da tela
      // Opcional: Reinicie o timer para evitar um spawn imediato de mobs logo após a limpeza.
      this.enemySpawnTimer = 0.2;
    }

    this.backgroundParticles.forEach((p) => p.update()); //

    // Atualiza o chefe se ele existir
    if (this.boss) { //
      this.boss.update(deltaTime, this.player); //
      // Verifica se o boss foi marcado para deleção neste frame e se ainda não marcamos como derrotado
      if (this.boss.markedForDeletion && !this.bossDefeatedFlag) { //
          this.bossDefeated(); // Chama a função que lida com a derrota do boss
      }
    }

    // Lógica consolidada para gerar inimigos normais
    // Se não há um chefe ativo no momento:
    if (!this.boss) { //
        // Decide a taxa de spawn baseada no estado do bossDefeatedFlag
        if (this.bossDefeatedFlag) { // Se o boss foi derrotado
            // Acelera o spawn após a derrota do boss
            this.enemySpawnRate = this.initialEnemySpawnRate / 3;
        } else if (!this.bossTriggered) { // Se o boss ainda não foi invocado (antes de score 3)
            // Mantém a taxa normal de spawn antes do boss aparecer
            this.enemySpawnRate = this.initialEnemySpawnRate;
        }
        // Se this.bossTriggered for true mas this.boss for null E bossDefeatedFlag for false,
        // significa que o boss está em transição ou foi derrotado mas a flag ainda não foi processada.
        // Neste caso, a lógica cairia aqui e continuaria spawnando na taxa atual (ou a última definida).

        this.enemySpawnTimer += deltaTime; //
        if (this.enemySpawnTimer > this.enemySpawnRate) { //
            const enemyType = Math.random(); //
            if (enemyType > 0.8) { //
                this.enemies.push(new ParasiteEnemy(this)); //
            } else if (enemyType > 0.5) { //
                this.enemies.push(new SpiralEnemy(this)); //
            } else { //
                this.enemies.push(new ShooterEnemy(this)); //
            }
            this.enemySpawnTimer = 0; //
        }
    }


    if (this.shakeTimer > 0) {
      this.shakeTimer -= deltaTime;

      const progress = Math.max(0, this.shakeTimer / this.shakeDuration); // Progresso do decaimento (de 1 a 0)
      const currentMagnitude = this.easeOutQuad(progress) * this.shakeMagnitude; // Aplica easing para a magnitude

      this.shakeOffsetX =
        Math.sin(this.gameTime * this.shakeFrequencyX) * currentMagnitude;
      this.shakeOffsetY =
        Math.cos(this.gameTime * this.shakeFrequencyY) * currentMagnitude;

      if (this.shakeTimer <= 0) {
        this.shakeTimer = 0;
        this.shakeOffsetX = 0;
        this.shakeOffsetY = 0;
      }
    }

    this.gameTime += deltaTime;
    this.player.update(this.input, this.mouse, deltaTime);
    this.camera.update();

    this.scoreTimer += deltaTime;
    if (this.scoreTimer >= this.scoreInterval) {
      this.score += 50;
      this.scoreTimer = 0;
    }

    [
      ...this.particles,
      ...this.projectiles,
      ...this.enemyProjectiles,
      ...this.enemies,
      ...this.aoeEffects,
    ].forEach((obj) => obj.update(deltaTime));
    this.checkCollisions();
    this.projectiles = this.projectiles.filter((p) => !p.markedForDeletion);
    this.enemies = this.enemies.filter((e) => !e.markedForDeletion);
    this.enemyProjectiles = this.enemyProjectiles.filter(
      (ep) => !ep.markedForDeletion
    );
    this.particles = this.particles.filter((p) => !p.markedForDeletion);
    this.aoeEffects = this.aoeEffects.filter((aoe) => !aoe.markedForDeletion);
  }


   bossDefeated() {
    this.boss = null; // Remove a referência ao boss para ele sumir da tela
    this.bossDefeatedFlag = true;
    this.enemies = []; // Limpa quaisquer inimigos que sobraram no momento da derrota (se você quiser)
    // A taxa de spawn será ajustada no update devido ao bossDefeatedFlag
    this.enemySpawnTimer = 0; // Reseta o timer para o novo spawn acelerado começar logo

    // Ativa o menu de seleção de upgrades
    this.enterLevelUpState(5); // Seleciona 5 upgrades
  }
  draw(context) {
    context.clearRect(0, 0, this.width, this.height);
    // Desenha as partículas de fundo primeiro
    this.backgroundParticles.forEach((p) => p.draw(context));

    this.background.draw(context); // Desenha seu fundo parallax
    context.save(); // Salva o estado para a translação da câmera E do tremor

    context.translate(-this.camera.x, -this.camera.y); // Translação da câmera
    if (this.shakeTimer > 0) {
      context.translate(this.shakeOffsetX, this.shakeOffsetY);
    }

    this.terrain.draw(context);

    // Desenha o chefe e seus lasers
    if (this.boss) {
      this.boss.draw(context, this.player);

      // Itera sobre os lasers do chefe e chama o método de desenho de cada um
      this.boss.laserBeams.forEach((laser) => laser.draw(context));

   //   this.boss.orbs.forEach((orb) => orb.draw(context));
    }

    [
      ...this.particles.filter((p) => this.isInCameraView(p)),
      ...this.aoeEffects.filter((aoe) => this.isInCameraView(aoe)),
      ...this.projectiles.filter((p) => this.isInCameraView(p)),
      ...this.enemies.filter((e) => this.isInCameraView(e)),
      ...this.enemyProjectiles.filter((ep) => this.isInCameraView(ep)),
      this.player, // O player é sempre desenhado
    ].forEach((obj) => obj.draw(context));

    this.player.drawAimingLine(context);

    context.restore(); // Restaura o estado após translação da câmera e do tremor
    this.ui.draw(context); // A UI geralmente fica fixa e não treme

    this.input.renderJoysticks(context);
    if (this.gameState === "gameOver") {
      this.drawGameOver(context);
    }
  }

  isInCameraView(obj) {
    // Verifica se o objeto tem as propriedades necessárias para o culling
    if (
      typeof obj.x === "undefined" ||
      typeof obj.y === "undefined" ||
      typeof obj.width === "undefined" ||
      typeof obj.height === "undefined"
    ) {
      return true; // Se faltar alguma propriedade, assume que é visível para evitar erros
    }

    // Adicione uma margem extra para que objetos que estão "quase" na tela ainda sejam desenhados,
    // evitando que apareçam e desapareçam abruptamente nas bordas.
    const margin = 50; // Margem em pixels (ajuste conforme necessário)

    const cameraLeft = this.camera.x - margin;
    const cameraRight = this.camera.x + this.width + margin;
    const cameraTop = this.camera.y - margin;
    const cameraBottom = this.camera.y + this.height + margin;

    const objLeft = obj.x;
    const objRight = obj.x + obj.width;
    const objTop = obj.y;
    const objBottom = obj.y + obj.height;

    // Retorna true se houver qualquer sobreposição entre o objeto e a área de visão da câmera (com margem)
    return (
      objRight > cameraLeft &&
      objLeft < cameraRight &&
      objBottom > cameraTop &&
      objTop < cameraBottom
    );
  }
  drawGameOver(context) {
    context.save();
    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(0, 0, this.width, this.height);
    context.textAlign = "center";
    context.shadowColor = "black";
    context.shadowBlur = 10;
    context.font = `40px ${this.fontFamily}`;
    context.fillStyle = "#FF4136";
    context.fillText("GAME OVER", this.width / 2, this.height / 2 - 40);
    context.shadowBlur = 0;
    context.font = `16px ${this.fontFamily}`;
    context.fillStyle = "white";
    context.fillText(
      `PONTUACAO FINAL: ${this.score}`,
      this.width / 2,
      this.height / 2
    );
    context.fillText(
      "Pressione Enter para reiniciar",
      this.width / 2,
      this.height / 2 + 40
    );
    context.restore();
  }

 
  checkCollisions() {
    // 1. Colisão: Projéteis do Jogador vs. Todos os Alvos (Inimigos + Chefe)

    this.projectiles.forEach((p) => {
      if (p.markedForDeletion) return;
      const allTargets = this.getDamageableTargets(); //

      for (const target of allTargets) {
        if (target.markedForDeletion) continue; //

        const targetRadius = target.radius || target.width / 2; //
        const targetCenterX = target.radius //
          ? target.x //
          : target.x + target.width / 2; //
        const targetCenterY = target.radius //
          ? target.y //
          : target.y + target.height / 2; //

        const dx = p.x - targetCenterX; //
        const dy = p.y - targetCenterY; //

       if (Math.sqrt(dx * dx + dy * dy) < p.radius + targetRadius) {
            target.takeDamage(p.damage);

            // Se p.pierce é 0, ele será marcado para deleção aqui
            if (p.pierce > 0) {
              p.pierce--;
              if (p.pierce === 0) {
                p.markedForDeletion = true; 
              }
            } else {
              p.markedForDeletion = true; // <-- Isso vai destruir a bala curvada após 1 hit
            }
            // ... (restante da lógica de deleção e break)
          }
      }
    });

    // 2. Colisão: Efeitos de Área (AoE) vs. Todos os Alvos (Inimigos + Chefe)  <-- A PEÇA QUE FALTAVA
    this.aoeEffects.forEach((aoe) => {
      if (aoe.markedForDeletion) return;
      const allTargets = this.getDamageableTargets();
      allTargets.forEach((target) => {
        if (
          target.markedForDeletion ||
          !aoe.enemiesHit ||
          aoe.enemiesHit.has(target)
        )
          return;
        const targetRadius = target.radius || target.width / 2;
        const targetCenterX = target.radius
          ? target.x
          : target.x + target.width / 2;
        const targetCenterY = target.radius
          ? target.y
          : target.y + target.height / 2;
        const dx = targetCenterX - aoe.x;
        const dy = targetCenterY - aoe.y;
        if (Math.sqrt(dx * dx + dy * dy) < aoe.radius + targetRadius) {
          target.takeDamage(aoe.damage);
          aoe.enemiesHit.add(target);
        }
      });
    });

    // 3. Colisão: Inimigos de Contato vs. Jogador
    this.enemies.forEach((e) => {
      if (e.markedForDeletion) return;
      if (e instanceof ParasiteEnemy || e instanceof SpiralEnemy) {
        const dx = e.x + e.width / 2 - this.player.x;
        const dy = e.y + e.height / 2 - this.player.y;
        if (
          Math.sqrt(dx * dx + dy * dy) <
          this.player.width / 2 + e.width / 2
        ) {
          if (e instanceof ParasiteEnemy) {
            e.markedForDeletion = true;
            this.createParticles(e.x, e.y, e.colorBody);
            this.player.latchedParasites++;
          } else if (e instanceof SpiralEnemy) {
            const timeProgress = Math.min(this.gameTime / 600000, 1.0);
            const damage = Math.floor(15 + 15 * timeProgress);
            this.player.takeDamage(damage);
            this.createParticles(e.x, e.y, e.color, 30);
            e.markedForDeletion = true;
          }
        }
      }
    });

    // 4. Colisão: Projéteis Inimigos vs. Jogador
    this.enemyProjectiles.forEach((ep) => {
      if (ep.markedForDeletion) return;
      const dx = ep.x - this.player.x;
      const dy = ep.y - this.player.y;
      if (Math.sqrt(dx * dx + dy * dy) < ep.radius + this.player.width / 2) {
        ep.markedForDeletion = true;
        this.player.takeDamage(Math.floor(ep.damage));
      }
    });

    // 5. Colisão: Laser do Chefe vs. Jogador
    if (this.boss) {
      let playerIsBeingHit = false;
      this.boss.laserBeams.forEach((laser) => {
        if (laser.active) {
          const lineX1 = laser.x,
            lineY1 = laser.y;
          const lineX2 = laser.x + Math.cos(laser.angle) * laser.beamLength;
          const lineY2 = laser.y + Math.sin(laser.angle) * laser.beamLength;
          const playerR = this.player.width / 2,
            playerX = this.player.x + playerR,
            playerY = this.player.y + this.player.height / 2;
          const lenSq =
            Math.pow(lineX2 - lineX1, 2) + Math.pow(lineY2 - lineY1, 2);
          let dot =
            ((playerX - lineX1) * (lineX2 - lineX1) +
              (playerY - lineY1) * (lineY2 - lineY1)) /
            lenSq;
          dot = Math.max(0, Math.min(1, dot));
          const closestX = lineX1 + dot * (lineX2 - lineX1);
          const closestY = lineY1 + dot * (lineY2 - lineY1);
          const distance = Math.hypot(playerX - closestX, playerY - closestY);
          if (distance < playerR + laser.thickness / 2) {
            playerIsBeingHit = true;
          }
        }
      });
      if (playerIsBeingHit) {
        this.player.timeInBossLaser += this.lastDeltaTime || 16.67;
        const damageInterval = 200;
        if (this.player.timeSinceLastLaserDamage > damageInterval) {
          const rampUpTime = 2000;
          const damageRampProgress = Math.min(
            1,
            this.player.timeInBossLaser / rampUpTime
          );
          const baseDamage = 3,
            maxDamage = 10;
          const currentDamage =
            baseDamage + (maxDamage - baseDamage) * damageRampProgress;
          this.player.takeDamage(Math.ceil(currentDamage));
          this.player.timeSinceLastLaserDamage = 0;
        }
      } else {
        this.player.timeInBossLaser = 0;
      }
    }
  }

  getDamageableTargets() {
    // Começa com uma lista de todos os inimigos que não estão marcados para deleção.
    let targets = this.enemies.filter((e) => !e.markedForDeletion);
    targets = targets.filter((e) => this.isInCameraView(e));
    // Se o chefe existir, estiver ativo e não marcado para deleção, adicione-o à lista de alvos.
    if (this.boss && !this.boss.markedForDeletion) {
      //  console.log("Adicionando o chefe como alvo de dano");
      targets.push(this.boss);
    }

    return targets;
  }

  getClosestTarget(sourcePosition) {
    let closestTarget = null;
    let minDistance = Infinity;

    // Concatena inimigos e chefe para considerar todos os alvos
    const potentialTargets = [...this.enemies];
    if (this.boss && !this.boss.markedForDeletion) { // Adiciona o chefe se ele não estiver marcado para deleção
        potentialTargets.push(this.boss);
    }

    for (const target of potentialTargets) {
      // *** VERIFICAÇÃO CRÍTICA AQUI: O alvo não deve estar marcado para deleção ***
      if (target.markedForDeletion) {
        continue; 
      }

      const targetCenterX = target.radius ? target.x : target.x + target.width / 2;
      const targetCenterY = target.radius ? target.y : target.y + target.height / 2;

      const dx = targetCenterX - sourcePosition.x;
      const dy = targetCenterY - sourcePosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        closestTarget = target;
      }
    }
    return closestTarget;
  }
  //Encontra o próximo alvo para o raio encadeado
  findNextChainTarget(startEntity, excludedEnemies, maxRange = 200) {
    let closestEnemy = null;
    let minDistance = maxRange; // Define um alcance máximo para o raio pular

    this.getDamageableTargets().forEach((enemy) => {
      // Pula o próprio inimigo, inimigos já atingidos ou marcados para deleção
      if (
        enemy === startEntity ||
        excludedEnemies.has(enemy) ||
        enemy.markedForDeletion
      ) {
        return;
      }

      const dx = enemy.x + enemy.width / 2 - startEntity.x;
      const dy = enemy.y + enemy.height / 2 - startEntity.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        closestEnemy = enemy;
      }
    });

    return closestEnemy;
  }

  //Gerencia a criação da corrente de raios
  triggerChainLightning(sourceOrb, initialTarget) {
    const u = this.player.upgrades.laserOrb;
    const maxChains = u.chain || 0;
    const damage = u.damage || 5;

    const effectsToCreate = [];
    const enemiesHitInChain = new Set();

    let currentSource = sourceOrb;
    let currentTarget = initialTarget;
    let chainsLeft = maxChains + 1;

    while (chainsLeft > 0 && currentTarget) {
      enemiesHitInChain.add(currentTarget);
      currentTarget.takeDamage(damage);

      // Cria a nossa nova animação de choque em vez do LaserBeam
      effectsToCreate.push(
        new ChainLightningSegment(this, currentSource, currentTarget, "purple")
      );

      chainsLeft--;

      if (chainsLeft > 0) {
        const nextTarget = this.findNextChainTarget(
          currentTarget,
          enemiesHitInChain
        );
        currentSource = currentTarget;
        currentTarget = nextTarget;
      } else {
        break;
      }
    }

    this.aoeEffects.push(...effectsToCreate);
  }
  togglePause() {
    if (this.isDebugMenuOpen) return;
    if (this.gameState === "running") {
      this.gameState = "paused";
      this.pauseMenu.classList.add("active");
    } else if (this.gameState === "paused") {
      this.gameState = "running";
      this.pauseMenu.classList.remove("active");
    }
  }
  toggleDebugMenu() {
    this.isDebugMenuOpen = !this.isDebugMenuOpen;
    if (this.isDebugMenuOpen) {
      this.populateDebugMenu();
      this.gameState = "paused";
      this.debugMenu.classList.add("active");
    } else {
      this.gameState = "running";
      this.debugMenu.classList.remove("active");
    }
  }
  populateDebugMenu() {
    // Limpa o container antes de adicionar novos botões para evitar duplicação
    this.debugUpgradesContainer.innerHTML = "";

    upgradePool.forEach((upgrade) => {
      // Itera através de cada nível do upgrade
      for (let i = 0; i < upgrade.maxLevel; i++) {
        const levelData = upgrade.levels[i];

        const btn = document.createElement("button");
        btn.classList.add("debug-btn");
        btn.textContent = levelData.title;

        // --- CORREÇÃO APLICADA AQUI ---
        // O handler de clique agora é inteligente e lida com os dois tipos de upgrades.
        btn.onclick = () => {
          // 1. Verifica se o upgrade principal tem uma função 'apply' genérica.
          if (typeof upgrade.apply === "function") {
            // Se sim, usa a função genérica, passando o índice do nível (i).
            // Isso é para os seus upgrades mais dinâmicos.
            upgrade.apply(this.player, i);
          } else {
            // 2. Se não, usa o método antigo, onde cada nível tem sua própria função 'apply'.
            levelData.apply(this.player);
          }
          // Opcional: Feedback no console para saber qual upgrade foi ativado.
          console.log(`Debug: Habilidade '${levelData.title}' aplicada.`);
        };
        this.debugUpgradesContainer.appendChild(btn);
      }
    });
  }
  toggleAutoAim() {
    this.autoAimActive = !this.autoAimActive;
    this.autoAimBtn.classList.toggle("active", this.autoAimActive);
  }
  createParticles(x, y, color, count = 15) {
    if (!this.particlesEnabled) return;
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(this, x, y, color));
    }
  }
  createShrapnel(x, y, count) {
    for (let i = 0; i < count; i++) {
      this.projectiles.push(
        new Projectile(this, x, y, Math.random() * Math.PI * 2, true, 1)
      );
    }
  }
  triggerCorpseExplosion(x, y) {
    const u = this.player.upgrades.corpseExplosion;
    this.aoeEffects.push(
      new AoE_Effect(
        this,
        x,
        y,
        u.radius,
        u.damage,
        150,
        "rgba(255, 100, 0, 0.5)"
      )
    );
  }
  triggerInfectionExplosion(x, y, w, h) {
    const u = this.player.upgrades.infection;
    this.aoeEffects.push(
      new AoE_Effect(
        this,
        x + w / 2,
        y + h / 2,
        u.radius,
        u.damage,
        150,
        "rgba(100, 255, 100, 0.5)"
      )
    );
  }

  triggerLightningStrikes() {
    const u = this.player.upgrades.lightningStrike;
    const availableEnemies = this.getDamageableTargets(); // Esta função já inclui o chefe

    if (availableEnemies.length === 0) return;

    for (let i = 0; i < u.count; i++) {
      const target =
        availableEnemies[Math.floor(Math.random() * availableEnemies.length)];

      if (target) {
        // Verifica se o alvo tem a propriedade 'radius' (o chefe tem).
        // Se tiver, usa (x,y) como centro. Se não, calcula o centro a partir de width/height.
        const targetCenterX = target.radius
          ? target.x
          : target.x + target.width / 2;
        const targetCenterY = target.radius
          ? target.y
          : target.y + target.height / 2;

        this.aoeEffects.push(
          new LightningBolt(
            this,
            targetCenterX, // Coordenada X corrigida
            targetCenterY, // Coordenada Y corrigida
            u.radius,
            u.damage,
            "#FFFF99"
          )
        );
      }
    }
  }

  triggerThorns(x, y) {
    const u = this.player.upgrades.thorns;
    this.aoeEffects.push(
      new AoE_Effect(
        this,
        x,
        y,
        u.radius,
        u.damage,
        100,
        "rgba(200, 200, 200, 0.5)"
      )
    );
  }
  triggerDamageVignette() {
    this.damageVignetteOpacity = 0.4; // Define a opacidade inicial
    this.ui.createCachedDamageGradient(); //  Chama UI para pré-gerar o gradiente
  }

  // Método para ativar o tremor de tela
  // duration: duração total do tremor em milissegundos
  // magnitude: intensidade máxima do tremor em pixels
  // frequencyX, frequencyY: (opcional) frequência de oscilação para os eixos X e Y
  triggerShake(duration, magnitude, frequencyX = 0.02, frequencyY = 0.03) {
    if (!this.screenShakeEnabled) return;
    this.shakeDuration = duration;
    this.shakeTimer = duration; // Inicia o temporizador com a duração total
    this.shakeMagnitude = magnitude; // Define a magnitude máxima
    this.shakeFrequencyX = frequencyX;
    this.shakeFrequencyY = frequencyY;
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
  }
  setGameOver() {
    this.gameState = "gameOver";
    this.gameControls.style.display = "none";
  } //  Função de easing para o decaimento do tremor (Quadratic Ease Out)
  easeOutQuad(t) {
    return t * (2 - t);
  }
  restart() {
    this.setup();
  }
  enterLevelUpState(choicesCount = 3) {
    if (this.gameState !== "running") return;
    const upgradeChoices = this.getUpgradeChoices(choicesCount);
    if (upgradeChoices.length === 0) {
      this.player.heal(25);
      return;
    }
    this.gameState = "levelUp";
    this.upgradeChoicesContainer.innerHTML = "";
    upgradeChoices.forEach((upgrade) => {
      const card = document.createElement("div");
      card.classList.add("upgrade-card");
      const nextLevel = this.player.upgrades[upgrade.id].level;
      card.innerHTML = `<h3>${upgrade.levels[nextLevel].title}</h3><p>${upgrade.levels[nextLevel].description}</p>`;
      card.onclick = () => this.selectUpgrade(upgrade, true);
      this.upgradeChoicesContainer.appendChild(card);
    });
    this.levelUpScreen.classList.add("active");
  }

  selectUpgrade(upgrade, fromLevelUp = false) {
    const currentLevel = this.player.upgrades[upgrade.id].level;
    if (currentLevel < upgrade.maxLevel) {
      // --- LÓGICA DINÂMICA ---
      // Verifica se o upgrade tem uma função 'apply' genérica no nível raiz
      if (typeof upgrade.apply === "function") {
        // Passa o jogador e o índice do nível a ser aplicado (que é o nível atual)
        upgrade.apply(this.player, currentLevel);
      } else {
        // Mantém a compatibilidade com o formato antigo para outros upgrades
        upgrade.levels[currentLevel].apply(this.player);
      }
      // --- FIM DA LÓGICA ---

      if (fromLevelUp) {
        this.player.upgrades[upgrade.id].level++;
      }
    }

    if (fromLevelUp) {
      this.levelUpScreen.classList.remove("active");
      this.gameState = "running";
    }
  }

  getUpgradeChoices(count) {
    // Pega todas as habilidades que ainda não estão no nível máximo
    const availableUpgrades = upgradePool.filter(
      (up) =>
        this.player.upgrades[up.id] &&
        this.player.upgrades[up.id].level < up.maxLevel
    );

    // Embaralha TODAS as habilidades disponíveis
    const shuffled = [...availableUpgrades].sort(() => 0.5 - Math.random());

    // Retorna a quantidade solicitada do topo da lista embaralhada
    return shuffled.slice(0, count);
  }
  run() {
    let lastTime = 0;
    const animate = (timestamp) => {
      const deltaTime = timestamp - lastTime || 0;
      lastTime = timestamp;
      this.lastDeltaTime = deltaTime;
      if (this.gameState === "running") {
        this.update(deltaTime);
      }
      this.draw(this.ctx);

      requestAnimationFrame(animate);
    };
    animate(0);
  }
}
