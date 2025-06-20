class SpiralEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.scale = 2;
    this.width = 16 * this.scale;
    this.height = 16 * this.scale;

    this.x =
      Math.random() > 0.5
        ? this.game.camera.x - this.width
        : this.game.camera.x + this.game.width;

    this.y = Math.random() * game.height * 0.5;
    this.speedY = 2;
    this.color = "#B10DC9";

    this.direction = this.x < this.game.player.x ? 1 : -1;

    this.rotationSpeed = 0.005 * this.direction;
    this.angle = 0;
  }

  update(deltaTime) {
    super.update(deltaTime);

    this.y += this.speedY;
    this.x += this.direction * 3;
    this.angle += this.rotationSpeed * deltaTime;

    if (this.y > this.game.height) {
      this.markedForDeletion = true;
    }
  }

  drawShape(context) {
    context.save();

    context.translate(this.x + this.width / 2, this.y + this.height / 2);
    context.rotate(this.angle);

    context.fillStyle = this.color;
    context.strokeStyle = "black";
    context.lineWidth = 1;

    const spikes = 5;
    const outerRadius = (16 / 2) * this.scale;
    const innerRadius = outerRadius / 2;

    context.beginPath();
    for (let i = 0; i < spikes; i++) {
      const angleOuter = (i * 2 * Math.PI) / spikes - Math.PI / 2;
      const xOuter = Math.cos(angleOuter) * outerRadius;
      const yOuter = Math.sin(angleOuter) * outerRadius;
      if (i === 0) context.moveTo(xOuter, yOuter);
      else context.lineTo(xOuter, yOuter);

      const angleInner = angleOuter + Math.PI / spikes;
      const xInner = Math.cos(angleInner) * innerRadius;
      const yInner = Math.sin(angleInner) * innerRadius;
      context.lineTo(xInner, yInner);
    }
    context.closePath();
    context.fill();
    context.stroke();

    context.restore();
  }
}
