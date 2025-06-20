class Particle {
  constructor(game, x, y, color, speedMultiplier = 1) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * 4 + 1;
    this.speedX = (Math.random() * 4 - 2) * speedMultiplier;
    this.speedY = Math.random() * -4 * speedMultiplier;
    this.gravity = 0.1;
    this.lifespan = 100;
    this.markedForDeletion = false;
  }
  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.lifespan--;
    if (this.lifespan < 0) this.markedForDeletion = true;
  }
  draw(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
  }
}
