class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];
    this.joysticksEnabled = false

    //  Flag para forçar joysticks no desktop (para testes)
    this.forceMobileControlsForTesting = false  // Mude para TRUE para testar joysticks no desktop

    this.moveJoystickDirection = { x: 0, y: 0 };
    this.aimJoystickDirection = { x: 0, y: 0 };
    this.isAimingJoystickActive = false;

    this.moveJoystick = null;
    this.aimJoystick = null;

    this._setupEventListeners();
    this._setupMobileControls();
  }

  _setupEventListeners() {
    // Eventos de teclado (mantidos para desktop ou debug)
    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (
        (key === "a" ||
          key === "d" ||
          key === "w" ||
          key === "s" ||
          key === " ") &&
        !this.keys.includes(key)
      ) {
        this.keys.push(key);
      } else if (this.game.gameState === "gameOver" && key === "enter") {
        this.game.restart();
      } else if (key === "p" || key === "escape") {
        if (this.game.gameState !== "levelUp" && !this.game.isDebugMenuOpen)
          this.game.togglePause();
      } else if (key === "f1") {
        e.preventDefault();
        console.log("Debug menu toggle");
        this.game.toggleDebugMenu();
      }
    });

    window.addEventListener("keyup", (e) => {
      const key = e.key.toLowerCase();
      const index = this.keys.indexOf(key);
      if (index > -1) this.keys.splice(index, 1);
    });

    window.addEventListener("blur", () => {
      this.keys = [];
      this.moveJoystickDirection = { x: 0, y: 0 };
      this.aimJoystickDirection = { x: 0, y: 0 };
      this.isAimingJoystickActive = false;
    });
  }

  _setupMobileControls() {
    const gameCanvas = this.game.ctx.canvas;

    this.joysticksEnabled =
      this.forceMobileControlsForTesting || isMobile

    if (this.joysticksEnabled) {
      const instructions = document.getElementById("instructions-ui");
      if (instructions) instructions.style.display = "none";

      //  Garante que o canvas preencha a tela e ajusta as dimensões
      gameCanvas.style.width = "100vw";
      gameCanvas.style.height = "100vh";
      gameCanvas.width = window.innerWidth;
      gameCanvas.height = window.innerHeight;

      //  Adiciona um listener para redimensionamento da janela
      window.addEventListener("resize", () => {
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
        // Re-inicializa os joysticks com as novas dimensões do canvas
        this._initializeJoysticks(gameCanvas);
      });

      this._initializeJoysticks(gameCanvas);
    } else {
      const mobileControls = document.getElementById("game-controls-mobile");
      if (mobileControls) mobileControls.style.display = "none";
    }
  }

  _initializeJoysticks(canvas) {
    // Oculta os botões do canto superior se joysticks estiverem ativos
    const desktopControls = document.getElementById("game-controls");
    if (desktopControls) desktopControls.style.display = "none";

    // Garante que joysticks antigos sejam limpos se _initializeJoysticks for chamado novamente
    if (this.moveJoystick) this.moveJoystick = null;
    if (this.aimJoystick) this.aimJoystick = null;

    this.moveJoystick = new VirtualJoystick({
      game: this.game,
      canvas: canvas,
      area: "left",
      outerRadius: 70,
      innerRadius: 30,
      outerColor: "rgba(0, 0, 255, 0.27)",
      innerColor: "rgb(255, 255, 255)",
      onMove: (dir) => {
        this.moveJoystickDirection = dir;
      },
      onStart: () => {},
      onEnd: () => {
        this.moveJoystickDirection = { x: 0, y: 0 };
      },
    });

    // IMPORTANTE: Define a área e o centro DEPOIS de criar o objeto, para que ele saiba suas dimensões
    this.moveJoystick.setAreaAndCenter(canvas.width, canvas.height);

    // Cria e posiciona o joystick de mira/ataque (lado direito)
    this.aimJoystick = new VirtualJoystick({
      canvas: canvas,
      area: "right",
      outerRadius: 70,
      innerRadius: 30,
      outerColor: "rgba(255, 0, 0, 0.27)",
      innerColor: "rgba(255, 255, 255, 0.7)",
      onMove: (dir) => {
        this.aimJoystickDirection = dir;
        this.isAimingJoystickActive = true;
        this.game.autoAimActive = false;
      },
      onStart: () => {
        this.isAimingJoystickActive = true;
        this.game.isMouseDown = true; // Simula clique do mouse para atirar
        this.game.autoAimActive = false;
      },
      onEnd: () => {
        this.aimJoystickDirection = { x: 0, y: 0 };
        this.isAimingJoystickActive = false;
        this.game.isMouseDown = false;
      },
    });
    // IMPORTANTE: Define a área e o centro DEPOIS de criar o objeto
    this.aimJoystick.setAreaAndCenter(canvas.width, canvas.height);
  }

  // Método para renderizar os joysticks (chamado pelo game loop)
  renderJoysticks(ctx) {
    if (this.joysticksEnabled) {
      // Apenas renderiza se as instâncias existirem
      if (this.moveJoystick) this.moveJoystick.render(ctx);
      if (this.aimJoystick) this.aimJoystick.render(ctx);
    }
  }
}
