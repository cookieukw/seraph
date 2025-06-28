/**
 * Representa o feixe de luz animado e aprimorado disparado pelo chefe.
 */
class BossLaser {
    // Adicione 'laserColor' como um parâmetro no construtor
    constructor(game, boss, delay = 0, angle, laserColor) {
        this.game = game;
        this.boss = boss;
        this.angle = angle; // Agora recebe o ângulo calculado com espalhamento
        
        this.x = boss.x;
        this.y = boss.y;
        
        this.thickness = 40;
        this.active = false;
        this.delay = Math.max(delay, 50)
        this.duration = 1500;
        this.life = this.duration;
        this.markedForDeletion = false;
        this.enemiesHit = new Set();
        
        this.segments = [];
        this.segmentCount = 50;
        this.noiseSpeed = 0.015;
        this.noiseMagnitude = 15;
        this.beamLength = 2000;

        this.laserColor = laserColor;
        this.lifeReset = false; // Flag para garantir que a vida seja resetada uma vez na ativação
    }

    update(deltaTime) {
        // --- Lógica de Delay e Ativação ---
       if (this.delay > 0) {
            this.delay -= deltaTime;
            if (this.delay <= 0 && !this.active) {
                this.active = true;
                this.delay = 0; // Garante que o delay não continue negativo
                // Redefine a vida apenas quando o laser se torna ativo
                this.life = this.duration;
            }
        }

        // --- Lógica de Vida e Deleção (somente se ativo) ---
        if (this.active) {
            // Garante que a vida seja resetada APENAS UMA VEZ no momento da ativação.
            if (!this.lifeReset) {
                this.life = this.duration;
                this.lifeReset = true;
            }

            this.life -= deltaTime;
            if (this.life <= 0) {
                this.markedForDeletion = true;
            }
        } else {
            // Se o laser não está ativo e ainda tem delay, ele não deve fazer nada além de decair o delay
            return;
        }
        
        this.enemiesHit.clear(); 
        this.x = this.boss.x;
        this.y = this.boss.y;

        // --- Lógica da Animação do Feixe ---
        // Recalcula a forma do feixe a cada quadro
        this.segments = [];
        const time = this.game.gameTime;

        for (let i = 0; i <= this.segmentCount; i++) {
            const progress = i / this.segmentCount;
            const xPos = progress * this.beamLength;
            
            const wave1 = Math.sin((progress * 15) + (time * this.noiseSpeed)) * this.noiseMagnitude;
            const wave2 = Math.sin((progress * 8) + (time * this.noiseSpeed * 0.7)) * this.noiseMagnitude * 0.6;
            const yPos = wave1 + wave2;

            this.segments.push({ x: xPos, y: yPos });
        }
    }

    draw(context) {
        if (!this.active || this.life <= 0) return;
        
        const alpha = this.life / this.duration; // Calcula a opacidade baseada na vida restante

        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.lineCap = 'round';

        // --- Camada 1: O Brilho Externo (Glow) ---
        context.beginPath();
        context.moveTo(this.segments[0].x, this.segments[0].y);
        for (let i = 1; i < this.segments.length; i++) {
            context.lineTo(this.segments[i].x, this.segments[i].y);
        }
        // Usa this.laserColor para o brilho
        context.strokeStyle = `rgba(${this.laserColor.r}, ${this.laserColor.g}, ${this.laserColor.b}, ${alpha * 0.2})`;
        context.lineWidth = this.thickness * 1.8;
        context.shadowColor = `rgba(${this.laserColor.r}, ${this.laserColor.g}, ${this.laserColor.b}, 0.8)`;
        context.shadowBlur = 30;
        context.stroke();

        // --- Camada 2: O Corpo do Laser ---
        context.beginPath();
        context.moveTo(this.segments[0].x, this.segments[0].y);
        for (let i = 1; i < this.segments.length; i++) {
            context.lineTo(this.segments[i].x, this.segments[i].y);
        }
        // Usa this.laserColor para o corpo
        context.strokeStyle = `rgba(${this.laserColor.r}, ${this.laserColor.g}, ${this.laserColor.b}, ${alpha * 0.6})`;
        context.lineWidth = this.thickness;
        context.shadowBlur = 15;
        context.stroke();

        // --- Camada 3: O Núcleo Brilhante ---
        context.beginPath();
        context.moveTo(this.segments[0].x, this.segments[0].y);
        for (let i = 1; i < this.segments.length; i++) {
            context.lineTo(this.segments[i].x, this.segments[i].y);
        }
        // O núcleo branco pode permanecer branco para contraste, ou usar o laserColor com mais opacidade
        context.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        context.lineWidth = this.thickness * 0.2;
        context.shadowBlur = 0;
        context.stroke();
        
        context.restore();
    }
}