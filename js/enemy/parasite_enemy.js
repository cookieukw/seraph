class ParasiteEnemy extends Enemy {
  constructor(game) {
    super(game);
    this.scale = 0.8;

    this.width = 24 * this.scale;
    this.height = 40 * this.scale;

    this.x =
      Math.random() > 0.5
        ? this.game.camera.x - this.width
        : this.game.camera.x + this.game.width;
    this.y = Math.random() * this.game.height * 0.5;

    this.speed = 2.5;

    this.colorBody = '#36454F';
    this.colorHighlight = '#778899';
    this.colorOutline = 'black';
    this.colorEye = '#FF0000';
    this.colorMouth = '#1A1A1A';
    this.colorTeeth = '#F0F0F0';

    this.animationTime = 0;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.animationTime += deltaTime / 1000;

    const angle = Math.atan2(
      this.game.player.y - this.y,
      this.game.player.x - this.x
    );
    this.x += Math.cos(angle) * this.speed;
    this.y += Math.sin(angle) * this.speed;
  }

  drawShape(ctx) {
    const scale = this.scale;
    const centerX = this.x + (24 * scale) / 2;
    const centerY = this.y + (40 * scale) / 2;

    const pulse = 1 + 0.05 * Math.sin(this.animationTime * 6);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.scale(pulse, pulse);
    ctx.translate(-centerX, -centerY);

    ctx.lineWidth = 2;
    ctx.strokeStyle = this.colorOutline;

    const drawSegment = (x, y, w, h, color, outline = true) => {
      ctx.fillStyle = color;
      ctx.fillRect(this.x + x * scale, this.y + y * scale, w * scale, h * scale);
      if (outline) ctx.strokeRect(this.x + x * scale, this.y + y * scale, w * scale, h * scale);
    };

    const bodySegmentData = [
      { w: 12, h: 2, offset: 0.0 },
      { w: 14, h: 2, offset: 0.5 + 0.3 * Math.sin(this.animationTime * 8) },
      { w: 13, h: 2, offset: -0.5 - 0.3 * Math.sin(this.animationTime * 7) },
      { w: 15, h: 2, offset: 0.2 + 0.3 * Math.sin(this.animationTime * 9) },
      { w: 14, h: 2, offset: -0.3 - 0.3 * Math.sin(this.animationTime * 6) },
      { w: 16, h: 2, offset: 0.1 + 0.3 * Math.sin(this.animationTime * 7.5) },
      { w: 15, h: 2, offset: -0.2 - 0.3 * Math.sin(this.animationTime * 8.5) },
      { w: 13, h: 2, offset: 0.4 + 0.3 * Math.sin(this.animationTime * 10) },
      { w: 11, h: 2, offset: -0.1 - 0.3 * Math.sin(this.animationTime * 6.5) },
      { w: 9, h: 2, offset: 0.0 },
    ];
    const internalSegmentHeight = 1.5;

    let currentY = 6;

    drawSegment(12 - 1.5, 0, 3, 2, this.colorBody);
    drawSegment(12 - 3, 2, 6, 2, this.colorBody);
    drawSegment(12 - 5, 4, 10, 2, this.colorBody);

    const eyeOpen = Math.sin(this.animationTime * 5) > 0;
    ctx.fillStyle = this.colorEye;
    if (eyeOpen) {
      drawSegment(12 - 4.5, 0, 2, 2, this.colorEye, false);
      drawSegment(12 + 2.5, 0, 2, 2, this.colorEye, false);
    } else {
      ctx.strokeStyle = this.colorEye;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x + (12 - 4.5) * scale, this.y + 1 * scale);
      ctx.lineTo(this.x + (12 - 2.5) * scale, this.y + 1 * scale);
      ctx.moveTo(this.x + (12 + 2.5) * scale, this.y + 1 * scale);
      ctx.lineTo(this.x + (12 + 4.5) * scale, this.y + 1 * scale);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.colorOutline;
    }

    const mouthOpen = Math.sin(this.animationTime * 7) > 0;
    ctx.fillStyle = this.colorMouth;
    ctx.fillRect(this.x + 9 * scale, this.y + 3.5 * scale, 8 * scale, 2 * scale);
    ctx.strokeStyle = this.colorMouth;
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x + 9 * scale, this.y + 3.5 * scale, 8 * scale, 2 * scale);

    if (mouthOpen) {
      ctx.fillStyle = this.colorTeeth;
      [8.5, 10.5, 12.5, 14.5].forEach(xPos => {
        ctx.fillRect(this.x + xPos * scale, this.y + 3.5 * scale, 1 * scale, 0.5 * scale);
        ctx.fillRect(this.x + xPos * scale, this.y + 4.5 * scale, 1 * scale, 0.5 * scale);
      });
    }

    for (const segment of bodySegmentData) {
      drawSegment(12 - segment.w / 2 + segment.offset, currentY, segment.w, segment.h, this.colorBody);
      drawSegment(12 - segment.w / 2 + segment.offset + 1, currentY + 0.25, segment.w - 2, internalSegmentHeight, this.colorHighlight, false);
      drawSegment(12 - segment.w / 2 + segment.offset - 1, currentY + 0.5, 0.5, 1, this.colorHighlight);
      drawSegment(12 + segment.w / 2 + segment.offset + 0.5, currentY + 0.5, 0.5, 1, this.colorHighlight);
      currentY += segment.h;
    }

    drawSegment(12 - 3, currentY, 6, 2, this.colorBody);
    currentY += 2;
    drawSegment(12 - 2, currentY, 4, 2, this.colorBody);
    currentY += 2;
    drawSegment(12 - 1, currentY, 2, 2, this.colorBody);
    currentY += 2;
    drawSegment(12 - 0.5, currentY, 1, 1, this.colorBody);

    ctx.restore();
  }
}
