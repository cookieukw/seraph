class Background {
  constructor(game) {
    this.game = game;
    this.tileSize = 16;
    this.rows = Math.ceil(this.game.height / this.tileSize);
    this.cols = this.game.terrain.cols;
    this.bgColors = ["#0e0e1a", "#0c0c18", "#0a0a16"];
    this.bgTiles = [];
    this.generate();
  }

  generate() {
    for (let y = 0; y < this.rows; y++) {
      this.bgTiles[y] = [];
      for (let x = 0; x < this.cols; x++) {
        this.bgTiles[y][x] = Math.random() < 0.04 ? 1 : 0;
      }
    }
  }

  draw(context) {
    context.save();
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.bgTiles[y][x]) {
          const px = x * this.tileSize - this.game.camera.x * 0.2;
          const py = y * this.tileSize;

          if (px + this.tileSize < 0 || px > this.game.width) continue;

          context.fillStyle = this.bgColors[(x + y) % this.bgColors.length];
          context.fillRect(px, py, this.tileSize, this.tileSize);
        }
      }
    }
    context.restore();
  }
}
