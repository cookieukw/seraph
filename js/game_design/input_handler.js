class InputHandler {
  constructor(game) {
    this.game = game;
    this.keys = [];

    window.addEventListener("keydown", (e) => {
      const key = e.key.toLowerCase();
      if (
        (key === "a" || key === "d" || key === "w" || key === " ") &&
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
        console.log("aaaa")
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
    });
  }
}
