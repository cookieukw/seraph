class Particle {
  constructor(game, x, y, color = "#FF0000", speedMultiplier = 1) {
    this.game = game;
    this.x = x;
    this.y = y;

    this.baseColor = color;
    this.color = this.applyShade(this.baseColor);

    this.size = Math.floor(Math.random() * 4) + 2;
    this.speedX = (Math.random() * 4 - 2) * speedMultiplier;
    this.speedY = (Math.random() * -3 - 1) * speedMultiplier;
    this.gravity = 0.15;
    this.lifespan = 60 + Math.floor(Math.random() * 30);
    this.age = 0;

    this.markedForDeletion = false;
  }

  applyShade(hex) {
    // Darkens the input hex a bit for variation (sem lib externa)
    let c = parseInt(hex.replace("#", ""), 16);
    let r = (c >> 16) - Math.floor(Math.random() * 40);
    let g = ((c >> 8) & 0xff) - Math.floor(Math.random() * 40);
    let b = (c & 0xff) - Math.floor(Math.random() * 40);
    r = Math.max(0, r);
    g = Math.max(0, g);
    b = Math.max(0, b);
    return `rgb(${r},${g},${b})`;
  }

  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;

    this.age++;
    if (this.age >= this.lifespan) this.markedForDeletion = true;
  }

  draw(ctx) {
    const alpha = 1 - this.age / this.lifespan;
    const size = this.size * (0.9 + 0.3 * Math.sin(this.age * 0.4));

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), Math.floor(size), Math.floor(size));
    ctx.restore();
  }
}
