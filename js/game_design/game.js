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
    this.shakeTimer = 0;
    this.shakeMagnitude = 0;
    this.score = 0;
    this.gameTime = 0;
    this.scoreTimer = 0;
    this.scoreInterval = 2000;

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

    if (!this.listenersAdded) {
      window.addEventListener("mousemove", (e) => {
        if (this.mouse) {
          this.mouse.x = e.clientX;
          this.mouse.y = e.clientY;
        }
      });
      window.addEventListener("mousedown", (e) => {
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
    if (this.shakeTimer > 0) this.shakeTimer -= deltaTime;

    this.gameTime += deltaTime;
    this.player.update(this.input, this.mouse, deltaTime);
    this.camera.update();
    this.scoreTimer += deltaTime;
    if (this.scoreTimer >= this.scoreInterval) {
      this.score += 50;
      this.scoreTimer = 0;
    }
    this.enemySpawnTimer += deltaTime;
    if (this.enemySpawnTimer > this.enemySpawnRate) {
      const enemyType = Math.random();
      if (enemyType > 0.8) {
        this.enemies.push(new ParasiteEnemy(this));
      } else if (enemyType > 0.5) {
        this.enemies.push(new SpiralEnemy(this));
      } else {
        this.enemies.push(new ShooterEnemy(this));
      }
      this.enemySpawnTimer = 0;
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
  draw(context) {
    context.clearRect(0, 0, this.width, this.height);

    context.save();
    if (this.shakeTimer > 0) {
      context.translate(
        Math.random() * this.shakeMagnitude * 2 - this.shakeMagnitude,
        Math.random() * this.shakeMagnitude * 2 - this.shakeMagnitude
      );
    }

    this.background.draw(context);

    context.save();
    context.translate(-this.camera.x, -this.camera.y);
    this.terrain.draw(context);
    // BUG FIX: Desenhar todos os objetos do jogo dentro do mesmo `save/restore` da câmera
    [
      ...this.particles,
      ...this.aoeEffects,
      ...this.projectiles,
      ...this.enemies,
      ...this.enemyProjectiles,
      this.player,
    ].forEach((obj) => obj.draw(context));
    context.restore();

    this.ui.draw(context);

    context.restore();

    if (this.gameState === "gameOver") {
      this.drawGameOver(context);
    }
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
    this.projectiles.forEach((p) => {
      for (const e of this.enemies) {
        if (p.markedForDeletion || e.markedForDeletion) continue;
        const dx = p.x - (e.x + e.width / 2);
        const dy = p.y - (e.y + e.height / 2);
        if (Math.sqrt(dx * dx + dy * dy) < p.radius + e.width / 2) {
          if (p.pierce > 0) {
            p.pierce--;
          } else {
            p.markedForDeletion = true;
          }
          if (p.shrapnel > 0) {
            this.createShrapnel(p.x, p.y, p.shrapnel);
          }
          if (Math.random() < p.combustionChance) {
            e.statusEffects.combustion = {
              active: true,
              damage: 1,
              duration: 3,
              timer: 0,
            };
          }
          if (Math.random() < p.infectionChance) {
            e.statusEffects.infection.active = true;
          }
          e.takeDamage(p.damage);
          if (this.player.upgrades.vampirism_up.value > 0)
            this.player.heal(
              p.damage * this.player.upgrades.vampirism_up.value
            );
          if (p.markedForDeletion) break;
        }
      }
    });
    this.enemies.forEach((e) => {
      if (e.markedForDeletion) return;
      const dx = e.x + e.width / 2 - this.player.x;
      const dy = e.y + e.height / 2 - this.player.y;
      if (Math.sqrt(dx * dx + dy * dy) < this.player.width / 2 + e.width / 2) {
        if (e instanceof ParasiteEnemy) {
          e.markedForDeletion = true;
          this.createParticles(e.x, e.y, e.color);
          this.player.latchedParasites++;
        } else if (e instanceof SpiralEnemy) {
          const timeProgress = Math.min(this.gameTime / 600000, 1.0);
          const damage = Math.floor(15 + 15 * timeProgress);
          this.player.takeDamage(damage);
          this.createParticles(e.x, e.y, e.color, 30);
          e.markedForDeletion = true;
        }
      }
    });
    this.enemyProjectiles.forEach((ep) => {
      if (ep.markedForDeletion) return;
      const dx = ep.x - this.player.x;
      const dy = ep.y - this.player.y;
      if (Math.sqrt(dx * dx + dy * dy) < ep.radius + this.player.width / 2) {
        ep.markedForDeletion = true;
        this.player.takeDamage(Math.floor(ep.damage));
      }
    });
    this.aoeEffects.forEach((aoe) => {
      if (aoe instanceof LaserBeam) {
        if (
          aoe.target &&
          !aoe.target.markedForDeletion &&
          !aoe.enemiesHit.has(aoe.target)
        ) {
          aoe.target.takeDamage(aoe.damage);
          aoe.enemiesHit.add(aoe.target);
        }
      } else {
        this.enemies.forEach((e) => {
          if (e.markedForDeletion || (aoe.enemiesHit && aoe.enemiesHit.has(e)))
            return;
          if (aoe.radius) {
            const dx = e.x + e.width / 2 - aoe.x;
            const dy = e.y + e.height / 2 - aoe.y;
            if (Math.sqrt(dx * dx + dy * dy) < aoe.radius + e.width / 2) {
              e.takeDamage(aoe.damage);
              if (aoe.enemiesHit) aoe.enemiesHit.add(e);
            }
          }
        });
      }
    });
  }
  getClosestEnemy(entity) {
    let closestEnemy = null;
    let minDistance = Infinity;
    this.enemies.forEach((enemy) => {
      const dx = enemy.x + enemy.width / 2 - entity.x;
      const dy = enemy.y + enemy.height / 2 - entity.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < minDistance) {
        minDistance = distance;
        closestEnemy = enemy;
      }
    });
    return closestEnemy;
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
    if (this.debugUpgradesContainer.childElementCount > 0) return;

    upgradePool.forEach((upgrade) => {
      for (let i = 0; i < upgrade.maxLevel; i++) {
        const level = upgrade.levels[i];
        const btn = document.createElement("button");
        btn.classList.add("debug-btn");
        btn.textContent = level.title;
        btn.onclick = () => {
          level.apply(this.player);
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
    const availableEnemies = this.enemies.filter(
      (e) => !(e instanceof ParasiteEnemy)
    );
    for (let i = 0; i < u.count; i++) {
      const target =
        availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
      if (target) {
        this.aoeEffects.push(
          new LightningBolt(
            this,
            target.x + target.width / 2,
            target.y + target.height / 2,
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
    this.damageVignetteOpacity = 0.4;
  }
  triggerShake(duration, magnitude) {
    if (!this.screenShakeEnabled) return;
    this.shakeTimer = duration;
    this.shakeMagnitude = magnitude;
  }
  setGameOver() {
    this.gameState = "gameOver";
    this.gameControls.style.display = "none";
  }
  restart() {
    this.setup();
  }
  enterLevelUpState() {
    if (this.gameState !== "running") return;
    const upgradeChoices = this.getUpgradeChoices(3);
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
      upgrade.levels[currentLevel].apply(this.player);
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
    const availableUpgrades = upgradePool.filter(
      (up) =>
        this.player.upgrades[up.id] &&
        this.player.upgrades[up.id].level < up.maxLevel
    );
    const shuffled = [...availableUpgrades].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  run() {
    let lastTime = 0;
    const animate = (timestamp) => {
      const deltaTime = timestamp - lastTime || 0;
      lastTime = timestamp;

      if (this.gameState === "running") {
        this.update(deltaTime);
      }
      this.draw(this.ctx);

      requestAnimationFrame(animate);
    };
    animate(0);
  }
}
