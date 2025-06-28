// Em js/effects/chain_lightning_segment.js

class ChainLightningSegment {
  constructor(game, source, target, color = '#FFFF99') {
    this.game = game;
    // Pega as posições centrais da fonte e do alvo
    this.source = { x: source.x, y: source.y };
    this.target = {}; // Inicializa o objeto target vazio
    if (target.radius !== undefined) { // Se o target tem 'radius', é o Boss
        this.target.x = target.x;
        this.target.y = target.y;
    } else { // Caso contrário, é um inimigo comum (assume width/height)
        this.target.x = target.x + target.width / 2;
        this.target.y = target.y + target.height / 2;
    } 
    this.timer = 0;
    this.duration = 250; // Duração total do efeito em ms
    this.markedForDeletion = false;

    this.color = color; // Amarelo bem claro (por padrão)

    // Gera os pontos para a forma irregular do raio
    this.segments = this.createJaggedSegments();
  }

  // Gera os pontos que compõem a forma irregular do raio
  createJaggedSegments(segmentCount = 10, randomness = 15) {
    const points = [];
    const dx = this.target.x - this.source.x;
    const dy = this.target.y - this.source.y;

    for (let i = 0; i <= segmentCount; i++) {
      const progress = i / segmentCount;
      let x = this.source.x + dx * progress;
      let y = this.source.y + dy * progress;

      // Não aplica desvio no primeiro e último ponto
      if (i > 0 && i < segmentCount) {
        x += (Math.random() - 0.5) * randomness;
        y += (Math.random() - 0.5) * randomness;
      }
      points.push({ x, y });
    }
    return points;
  }

  update(deltaTime) {
    this.timer += deltaTime;
    if (this.timer >= this.duration) {
      this.markedForDeletion = true;
    }
  }

  // O novo método de desenho cria um efeito muito mais dinâmico
  draw(context) {
    // A opacidade diminui ao longo da vida do raio, criando um efeito de fade-out
    const lifePercent = this.timer / this.duration; // Vai de 0.0 a 1.0
    const alpha = 1 - lifePercent;

    context.save();
    context.lineCap = 'round';
    context.shadowColor = this.color;
    context.shadowBlur = 10;

    // --- Desenha o brilho externo (mais grosso e transparente) ---
    context.strokeStyle = `rgba(255, 255, 150, ${alpha * 0.5})`;
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(this.segments[0].x, this.segments[0].y);
    for (let i = 1; i < this.segments.length; i++) {
      context.lineTo(this.segments[i].x, this.segments[i].y);
    }
    context.stroke();

    // --- Desenha o núcleo do raio (mais fino e opaco) ---
    context.strokeStyle = `rgba(255, 255, 255, ${alpha})`; // Branco
    context.lineWidth = 2;
    context.shadowBlur = 0; // Sem sombra para o núcleo
    context.stroke();

    context.restore();
  }
}