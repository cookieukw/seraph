class Terrain {
  constructor(game) {
    this.game = game;
    this.tileSize = 16;
    this.cols = Math.ceil(this.game.width / this.tileSize) * 3;
    this.rows = Math.ceil(this.game.height / this.tileSize);
    this.worldWidth = this.cols * this.tileSize;
    this.ground = [];
    this.generate();
  }

  generate() {
    for (let y = 0; y < this.rows; y++) {
      this.ground[y] = [];
      for (let x = 0; x < this.cols; x++) {
        const elevation = Math.floor(
          Math.sin((x + y * 0.5) * 0.5) * 2 + Math.random() * 2
        );
        const type = y > this.rows - 5 - elevation ? 1 : 0;
        this.ground[y][x] = { type };
      }
    }
  }

  draw(context) {
    const startCol = Math.floor(this.game.camera.x / this.tileSize);
    const endCol = startCol + Math.ceil(this.game.width / this.tileSize) + 2;

    for (let y = 0; y < this.rows; y++) {
      for (let x = startCol; x < endCol; x++) {
        if (
          x >= 0 &&
          x < this.cols &&
          this.ground[y][x] &&
          this.ground[y][x].type === 1
        ) {
          const px = x * this.tileSize;
          const py = y * this.tileSize;
          context.fillStyle = y % 2 ? "#222" : "#1B1B1B";
          context.fillRect(px, py, this.tileSize, this.tileSize);
          context.strokeStyle = "#000";
          context.strokeRect(px, py, this.tileSize, this.tileSize);
        }
      }
    }
  }

  getGroundY(x) {
    const tileX = Math.floor(x / this.tileSize);
    if (tileX < 0 || tileX >= this.cols) {
      return this.game.height;
    }
    for (let y = 0; y < this.rows; y++) {
      if (this.ground[y][tileX] && this.ground[y][tileX].type === 1) {
        return y * this.tileSize;
      }
    }
    return this.game.height;
  }
}
