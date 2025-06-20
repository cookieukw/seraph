class Camera {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;
  }

  update() {
    this.x = this.game.player.x - this.game.width / 2;
    this.x = Math.max(
      0,
      Math.min(this.x, this.game.terrain.worldWidth - this.game.width)
    );
  }
}
