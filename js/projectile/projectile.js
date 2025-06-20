class Projectile {
    constructor(game, x, y, angle, isPlayer, damage) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.angle = angle; // Armazena o ângulo inicial
        this.isPlayer = isPlayer;
        this.damage = damage;
        
        const pUpgrades = this.game.player.upgrades; // Acesso aos upgrades do jogador

        this.isHoming = pUpgrades.hasHomingProjectiles.value;
        this.ricochets = pUpgrades.ricochet.value;
        this.pierce = pUpgrades.pierce.value;
        this.shrapnel = pUpgrades.shrapnel.value;
        this.combustionChance = pUpgrades.combustion.chance;
        this.infectionChance = pUpgrades.infection.chance;
        // Tenta encontrar um alvo no início (se for homing)
        this.target = this.isHoming ? this.game.getClosestEnemy({ x: this.x, y: this.y }) : null;
        
        // MODIFICAÇÃO ESSENCIAL: Velocidade em pixels por MILISSEGUNDO.
        // Se a velocidade original de 7 e 4 era em "pixels por frame" (assumindo 60 FPS),
        // convertemos para pixels por milissegundo.
        // (pixels/frame) / (ms/frame) = pixels/ms
        // 16.67ms por frame a 60 FPS.
        const pxPerMsPlayer = 7 / 16.67; // Aproximadamente 0.42 px/ms
        const pxPerMsEnemy = 4 / 16.67;   // Aproximadamente 0.24 px/ms
        
        this.speed = isPlayer ? pxPerMsPlayer : pxPerMsEnemy; // Agora this.speed é em pixels/milissegundo

        // Calcula a velocidade X e Y baseada nesta nova velocidade
        this.velocityX = Math.cos(this.angle) * this.speed;
        this.velocityY = Math.sin(this.angle) * this.speed;

        // Raio base e raio atual (para pulsação)
        this.baseRadius = isPlayer ? 3 : 5;
        this.radius = this.baseRadius; // Raio atual, pode variar para animação

        // Cores em formato numérico para fácil manipulação (glow, trail)
        this.playerCoreColor = 0x90E0EF; // Ciano claro para o jogador
        this.playerGlowColor = 0xCCF7FF; // Ciano mais claro para o brilho do jogador
        this.enemyCoreColor = 0xFF4136; // Vermelho para o inimigo
        this.enemyGlowColor = 0xFF8880; // Laranja/Vermelho claro para o brilho do inimigo

        this.markedForDeletion = false;

        // Propriedades da trilha
        this.trailLength = isPlayer ? 6 : 10; // Comprimento da trilha (número de segmentos)
        this.trailPoints = []; // Armazena posições passadas para desenhar a trilha
        this.trailDensity = 5; // Quantos updates antes de adicionar um ponto à trilha
        this.trailCounter = 0; // Contador interno para densidade da trilha

        // Propriedades da animação de pulsação
        this.pulseFrequency = isPlayer ? 0.02 : 0.03; // Frequência do pulso (jogador mais lento, inimigo mais rápido)
        this.pulseAmplitude = isPlayer ? 0.5 : 1.0; // Amplitude do pulso (jogador mais sutil, inimigo mais pronunciado)
    }

    update(deltaTime) {
        // Atualiza pontos da trilha
        this.trailCounter++;
        if (this.trailCounter >= this.trailDensity) {
            this.trailPoints.unshift({ x: this.x, y: this.y }); // Adiciona a posição atual ao início
            if (this.trailPoints.length > this.trailLength) {
                this.trailPoints.pop(); // Remove o ponto mais antigo
            }
            this.trailCounter = 0;
        }

        // Lógica de perseguição (Homing)
        // Se o alvo não for válido (sumiu, marcado para deleção), tenta encontrar um novo alvo se isHoming for true
        if (this.isHoming && (!this.target || this.target.markedForDeletion)) {
            this.target = this.game.getClosestEnemy({ x: this.x, y: this.y });
        }

        if (this.isHoming && this.target && !this.target.markedForDeletion) {
            const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
            this.velocityX = Math.cos(angle) * this.speed;
            this.velocityY = Math.sin(angle) * this.speed;
        }

        // MODIFICAÇÃO: Movimento baseado em deltaTime, onde speed é em pixels/milissegundo
        this.x += this.velocityX * deltaTime; // Multiplica diretamente por deltaTime
        this.y += this.velocityY * deltaTime;

        // Atualiza a animação de pulsação do raio
        this.radius = this.baseRadius + Math.sin(this.game.gameTime * this.pulseFrequency) * this.pulseAmplitude;

        // Lógica de ricochete
        let bounced = false;
        if (this.ricochets > 0) {
            // Quica nas bordas do mundo (esquerda/direita)
            // Certifique-se que this.game.terrain.worldWidth está corretamente definido
            const worldWidth = this.game.terrain ? this.game.terrain.worldWidth : this.game.width; // Fallback se terrain não existir ou worldWidth

            if (this.x - this.radius < 0) { // Bateu na parede esquerda
                this.x = this.radius; // Garante que não vá para fora
                this.velocityX *= -1; // Inverte direção X
                bounced = true;
            } else if (this.x + this.radius > worldWidth) { // Bateu na parede direita
                this.x = worldWidth - this.radius; // Garante que não vá para fora
                this.velocityX *= -1; // Inverte direção X
                bounced = true;
            }
            
            // Quica no teto
            if (this.y - this.radius < 0) {
                this.y = this.radius; // Garante que não vá para fora
                this.velocityY *= -1; // Inverte direção Y
                bounced = true;
            }
            // Considerar quicar no chão se a sua lógica de terreno permitir
            // if (this.y + this.radius > this.game.terrain.getGroundY(this.x)) {
            //     this.velocityY *= -1;
            //     bounced = true;
            // }

            if (bounced) {
                this.ricochets--;
                // Opcional: Adicionar um pequeno som ou efeito de partícula ao quicar
                // this.game.createParticles(this.x, this.y, "white", 5);
            }
        }

        // Condições de marcação para deleção (fora da tela)
        // Usar this.game.width/height para limites de tela de visualização
        // Usar this.game.terrain.worldWidth para limites do mundo do jogo
        // Se a câmera se move, a deleção deve ser relativa à câmera
        const cameraX = this.game.camera ? this.game.camera.x : 0; // Fallback
        const cameraY = this.game.camera ? this.game.camera.y : 0; // Fallback

        // MODIFICAÇÃO: Margem para deleção fora da tela (evita que o projétil desapareça "cedo demais")
        const deletionMargin = 100; 

        if (
            this.x + this.radius < cameraX - deletionMargin || // Esquerda da câmera
            this.x - this.radius > cameraX + this.game.width + deletionMargin || // Direita da câmera
            this.y + this.radius < cameraY - deletionMargin || // Acima da câmera
            this.y - this.radius > cameraY + this.game.height + deletionMargin // Abaixo da câmera
        ) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        context.save();
        context.lineCap = 'round'; // Para pontas arredondadas da trilha e brilhos

        // Determina as cores principais e de brilho com base se é do jogador ou inimigo
        const coreColor = this.isPlayer ? this.playerCoreColor : this.enemyCoreColor;
        const glowColor = this.isPlayer ? this.playerGlowColor : this.enemyGlowColor;

        // Converte as cores numéricas para componentes RGB uma única vez por chamada de draw
        const r_core = (coreColor >> 16) & 0xFF;
        const g_core = (coreColor >> 8) & 0xFF;
        const b_core = coreColor & 0xFF;

        const r_glow = (glowColor >> 16) & 0xFF;
        const g_glow = (glowColor >> 8) & 0xFF;
        const b_glow = glowColor & 0xFF;

        // --- Desenha a Trilha ---
        for (let i = 0; i < this.trailPoints.length; i++) {
            const point = this.trailPoints[i];
            const alpha = 1 - (i / this.trailLength); // Opacidade diminui ao longo da trilha
            const trailRadius = this.radius * (1 - (i / (this.trailLength + 2))); // Raio diminui ao longo da trilha
            
            // Desenha a parte de brilho da trilha
            context.beginPath();
            context.arc(point.x, point.y, trailRadius * 1.5, 0, Math.PI * 2); // Maior para o brilho
            context.fillStyle = `rgba(${r_glow}, ${g_glow}, ${b_glow}, ${alpha * 0.4})`; // Brilho translúcido
            context.fill();

            // Desenha a parte central da trilha
            context.beginPath();
            context.arc(point.x, point.y, trailRadius, 0, Math.PI * 2);
            context.fillStyle = `rgba(${r_core}, ${g_core}, ${b_core}, ${alpha * 0.8})`; // Mais opaco que o brilho
            context.fill();
        }

        // --- Desenha o Corpo Principal do Projétil (Posição Atual) ---
        // Desenha o brilho principal do projétil
        context.beginPath();
        context.arc(this.x, this.y, this.radius * 1.2, 0, Math.PI * 2); // Ligeiramente maior para o efeito de brilho
        context.fillStyle = `rgba(${r_glow}, ${g_glow}, ${b_glow}, 0.8)`; // Cor do brilho com boa opacidade
        context.shadowBlur = this.radius * 2; // Brilho mais forte para o projétil principal
        context.shadowColor = `rgb(${r_glow}, ${g_glow}, ${b_glow})`; // Cor do brilho
        context.fill();
        context.shadowBlur = 0; // Reseta shadowBlur para não afetar outros desenhos

        // Desenha o núcleo do projétil
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = `rgb(${r_core}, ${g_core}, ${b_core})`; // Cor sólida do núcleo
        context.fill();

        context.restore();
    }
}