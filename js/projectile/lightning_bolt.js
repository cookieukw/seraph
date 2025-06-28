// js/projectile/lightning_bolt.js

class LightningBolt {
  constructor(game, x, y, radius, damage, color) {
    this.game = game;
    this.x = x; // Posição X do impacto
    this.y = y; // Posição Y do impacto
    this.radius = radius;
    this.damage = damage;
    this.color = color;

    // Herda a duração de AoE_Effect ou define uma própria
    this.duration = 250; // Duração total do efeito visual em ms
    this.timer = 0;
    this.markedForDeletion = false;
    
    // Guarda os inimigos já atingidos para não dar dano múltiplo
    this.enemiesHit = new Set();
    
    // Gera os segmentos irregulares do raio
    this.enemiesHit = new Set()
    this.segments = this.createJaggedSegments();
  }

  // NOVO MÉTODO: Cria a forma irregular do raio
  createJaggedSegments() {
    const segments = [];
    const startY = this.game.camera.y; // Topo da visão da câmera
    const endY = this.y;
    const segmentCount = 10; // Número de segmentos do raio
    
    segments.push({ x: this.x, y: startY }); // Ponto inicial no topo da tela

    for (let i = 1; i < segmentCount; i++) {
      const progress = i / segmentCount;
      const currentY = startY + (endY - startY) * progress;
      
      // Adiciona um desvio horizontal aleatório
      const randomOffset = (Math.random() - 0.5) * 25; // Desvio de até 12.5px para cada lado
      segments.push({ x: this.x + randomOffset, y: currentY });
    }

    segments.push({ x: this.x, y: endY }); // Ponto final no alvo
    return segments;
  }

  update(deltaTime) {
    this.timer += deltaTime;
    if (this.timer >= this.duration) {
      this.markedForDeletion = true;
    }
  }

  draw(context) {
    const lifePercent = 1 - (this.timer / this.duration); // Vai de 1.0 a 0.0

    context.save();
    context.lineCap = 'round';

    // 1. Desenha o BRILHO externo do raio
    context.strokeStyle = this.color;
    context.lineWidth = 8;
    context.globalAlpha = 0.5 * lifePercent; // Brilho fica mais fraco com o tempo
    context.shadowColor = this.color;
    context.shadowBlur = 15;
    
    context.beginPath();
    context.moveTo(this.segments[0].x, this.segments[0].y);
    for (let i = 1; i < this.segments.length; i++) {
      context.lineTo(this.segments[i].x, this.segments[i].y);
    }
    context.stroke();

    // 2. Desenha o NÚCLEO branco e fino do raio
    context.strokeStyle = 'white';
    context.lineWidth = 3;
    context.globalAlpha = 0.9 * lifePercent;
    context.shadowBlur = 0; // Sem sombra para o núcleo
    context.stroke(); // Desenha por cima do brilho
    
    // 3. Desenha a explosão no impacto
    context.beginPath();
    context.arc(this.x, this.y, this.radius * lifePercent, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.globalAlpha = 0.6 * lifePercent;
    context.fill();

    context.restore();
  }
}