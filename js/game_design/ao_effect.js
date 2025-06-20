class AoE_Effect {
  constructor(game, x, y, radius, damage, duration, color) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.baseRadius = radius;
    this.damage = damage;
    this.duration = duration;
    this.color = color;
    this.timer = 0;
    this.markedForDeletion = false;
    this.enemiesHit = new Set();
  }
  update(deltaTime) {
    this.timer += deltaTime;
    if (this.timer > this.duration) this.markedForDeletion = true;
  }
  draw(ctx) {
    const progress = this.timer / this.duration;

    // Pulsação do raio (oscila +-5%)
    const pulse = 1 + 0.05 * Math.sin(progress * Math.PI * 10);

    // Raio atual com pulsação
    const currentRadius = this.baseRadius * pulse;

    ctx.save();

    // Transparência vai de 0.5 no começo pra 0 no fim, com fade smooth
    ctx.globalAlpha = 0.5 * (1 - progress);

    // Sombra glow crescente e decrescente
    const shadowStrength = 20 * (1 - progress);
    ctx.shadowColor = this.color;
    ctx.shadowBlur = shadowStrength;

    // Círculo principal do AoE
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
    ctx.fill();

    // Borda animada: alpha crescente e decrescente e stroke pulsante
    const borderAlpha = 0.8 * (0.5 + 0.5 * Math.sin(progress * Math.PI * 8));
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.color;
    ctx.globalAlpha = borderAlpha * (1 - progress);
    ctx.beginPath();
    ctx.arc(this.x, this.y, currentRadius + 6, 0, Math.PI * 2);
    ctx.stroke();

    // Efeito impacto inicial (burst) no começo
    if (progress < 0.2) {
      const burstRadius = currentRadius + 20 * (0.2 - progress) * 5;
      const burstAlpha = (0.2 - progress) * 5;
      ctx.globalAlpha = burstAlpha;
      ctx.lineWidth = 6;
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, burstRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}
