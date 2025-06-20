// =========================================================================
// CLASSE ShootingOrb - VERSÃO OTIMIZADA FINAL
// (Substitua sua classe ShootingOrb inteira por esta)
// =========================================================================
class ShootingOrb extends Orb {
    constructor(game, player, angleOffset) {
        super(game, player, angleOffset);
        this.shootCooldown = 500; // ms entre disparos
        this.radius = 6
        this.shootTimer = Math.random() * this.shootCooldown; // Inicia com tempo aleatório para variedade

        // Propriedades para a animação de Pulso (quando atira)
        this.pulseDuration = 100; // Duração do pulso em ms
        this.pulseTimer = 0;
        this.isPulsing = false;

        // Cores do Orb para feedback visual (em formato numérico, ex: 0xRRGGBB)
        this.baseColor = 0x00BFFF; // Deep Sky Blue (base)
        this.readyColor = 0x87CEEB; // Sky Blue (quase pronto para atirar)
        this.glowColor = 0xADD8E6; // Light Blue (cor do brilho ao disparar)

        // Propriedades para a animação de Flutuação/Respiração
        this.breathingAmplitude = 2; // Pixels de movimento vertical
        this.breathingFrequency = 0.005; // Velocidade da respiração (ajuste este valor)
        this.breathingOffset = Math.random() * Math.PI * 2; // Offset inicial para variar entre orbs

        // Propriedades para forma e design (raios das camadas)
        this.innerRadius = this.radius * 0.7; // Raio do núcleo interno
        this.outerRadius = this.radius * 1.1; // Raio da camada externa (base)

    
    }

    update(deltaTime) {
        super.update(deltaTime); // Atualiza a posição base do orb (herdada da classe Orb)

        // Lógica de disparo
        if (this.game.gameState === "running") { // Só dispara se o jogo estiver rodando
            this.shootTimer += deltaTime;
            if (this.shootTimer >= this.shootCooldown) {
                this.game.projectiles.push(
                    new Projectile(
                        this.game,
                        this.x,
                        this.y,
                        this.player.staffAngle, // Dispara na direção do staff do player
                        true, // É um projétil do jogador
                        1 // Dano (exemplo)
                    )
                );
                this.shootTimer = 0; // Reseta o timer de disparo
                this.isPulsing = true; // Inicia o pulso visual
                this.pulseTimer = this.pulseDuration; // Inicia o timer do pulso
            }
        }

        // Atualiza animação de pulso (decai o timer)
        if (this.isPulsing) {
            this.pulseTimer -= deltaTime;
            if (this.pulseTimer <= 0) {
                this.isPulsing = false; // Pulso terminou
                this.pulseTimer = 0;
            }
        }
    }

  draw(context) {
        context.save(); // Salva o estado do contexto para transformações locais

        // NOVO: Define pulseProgress aqui, antes de ser usado
        // Ele será 0 se não estiver pulsando, ou o valor real se estiver.
        let pulseProgress = this.isPulsing ? this.pulseTimer / this.pulseDuration : 0;

        // Aplica a animação de flutuação/respiração
        const breathOffset = Math.sin((this.game.gameTime * this.breathingFrequency) + this.breathingOffset) * this.breathingAmplitude;
        context.translate(this.x, this.y + breathOffset); // Translada para a posição do orb + offset de respiração

        // Calcula o progresso de carga (0 = vazio, 1 = pronto para atirar)
        const chargeProgress = 1 - (this.shootTimer / this.shootCooldown);
        let currentNumericalColor = this.baseColor;
        if (chargeProgress > 0.5) {
            const lerpAmount = Math.pow((chargeProgress - 0.5) * 2, 2);
            currentNumericalColor = lerpColor(this.baseColor, this.readyColor, lerpAmount);
        }

        let currentOrbRadius = this.radius;
        let currentAlpha = 1;
        let finalOrbNumericalColor = currentNumericalColor; // Cor final para o corpo principal do orb

        if (this.isPulsing) {
            // pulseProgress já está definido acima, apenas usamos aqui
            currentOrbRadius = this.radius + (this.radius * 0.5 * Math.sin(pulseProgress * Math.PI));
            currentAlpha = pulseProgress * 0.7; // Para o brilho externo
            finalOrbNumericalColor = this.glowColor; // Cor principal do orb vira a cor de brilho durante o pulso
        }
        
        // OTIMIZAÇÃO: Converte cores numéricas para componentes RGB UMA VEZ
        const r_main = (finalOrbNumericalColor >> 16) & 0xFF;
        const g_main = (finalOrbNumericalColor >> 8) & 0xFF;
        const b_main = finalOrbNumericalColor & 0xFF;

        // --- Desenha o GLOW externo (com alpha) ---
        if (this.isPulsing) {
            const r_glow = (this.glowColor >> 16) & 0xFF;
            const g_glow = (this.glowColor >> 8) & 0xFF;
            const b_glow = this.glowColor & 0xFF;

            context.beginPath();
            context.arc(0, 0, currentOrbRadius * 1.5, 0, Math.PI * 2);
            context.fillStyle = `rgba(${r_glow}, ${g_glow}, ${b_glow}, ${currentAlpha})`;
            context.fill();
        }

        // --- Desenha a CAMADA EXTERNA do orb ---
        context.beginPath();
        context.arc(0, 0, currentOrbRadius, 0, Math.PI * 2);
        context.fillStyle = `rgb(${r_main}, ${g_main}, ${b_main})`; // Usa cor RGB já convertida
        context.fill();
        context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        context.lineWidth = 1.5;
        context.stroke();

        // --- Desenha a CAMADA INTERNA/NÚCLEO do orb ---
        context.beginPath();
        // O núcleo também pode pulsar ligeiramente
        // pulseProgress agora está sempre definido!
        const innerRadiusAdjusted = this.innerRadius * (1 + (this.isPulsing ? 0.2 * Math.sin(pulseProgress * Math.PI) : 0));
        context.arc(0, 0, innerRadiusAdjusted, 0, Math.PI * 2);
        context.fillStyle = 'white'; // Núcleo sempre brilhante
        context.fill();
        context.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        context.lineWidth = 1;
        context.stroke();

        context.restore(); // Restaura o estado do contexto
    }
}