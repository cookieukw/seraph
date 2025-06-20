class Enemy {
    constructor(game) {
        this.game = game;
        this.markedForDeletion = false;
        this.health = 1 + Math.floor(this.game.gameTime / 35000);
        this.xpValue = 25;
        this.statusEffects = {
            combustion: { active: false, damage: 0, duration: 0, timer: 0 },
            infection: { active: false },
        };

        this.showOutline = true; // Define se a borda deve ser mostrada
        this.outlineColor = 'rgba(255, 255, 255, 0.8)'; // Cor padrão da borda (branco translúcido)
        this.outlineWidth = 1; // Largura do efeito de brilho/borda
        this.outlineTimer = 0; // Para animação da borda (ex: piscar)
        this.outlineDuration = 200; // Duração de um pulso de borda, se for o caso
    }

    update(deltaTime) {
        if (this.statusEffects.combustion.active) {
            const s = this.statusEffects.combustion;
            s.timer += deltaTime;
            if (s.timer > 1000) {
                this.health -= s.damage;
                if (this.health <= 0) this.markedForDeletion = true;
                s.timer = 0;
                s.duration--;
            }
            if (s.duration <= 0) s.active = false;
        }

        if (this.showOutline) {
            this.outlineTimer += deltaTime;
            // Exemplo de como fazer a borda "piscar" ou "pulsar"
            // Se você quiser que a borda simplesmente apareça por um tempo, use um timer regressivo.
            // Se você quiser que ela pulse, pode usar Math.sin()
        }
    }

    draw(context) {
        context.save(); // Salva o estado atual do contexto

        // Aplica efeitos de status existentes
        if (this.statusEffects.combustion.active) {
            context.shadowColor = "orange";
            context.shadowBlur = 10;
        }
        if (this.statusEffects.infection.active) {
            context.filter = "saturate(0.5) sepia(1)"; // Efeito de infecção
        }

        // NOVO: Lógica para desenhar a borda
        if (this.showOutline) {
            // Calcula o alpha para o efeito de piscar/fade, se desejado.
            // Por exemplo, para um fade simples:
            const outlineAlpha = 1 - (this.outlineTimer / this.outlineDuration); // Fica de 1 a 0
            if (this.outlineTimer >= this.outlineDuration) { // Desativa a borda após a duração
                this.showOutline = false;
                this.outlineTimer = 0;
            }

            // Define a cor da borda (usando shadow para efeito de brilho/aura)
            context.shadowColor = this.outlineColor;
            context.shadowBlur = this.outlineWidth; // A largura do brilho é a largura da borda
            context.globalAlpha = outlineAlpha; // Aplica o alpha calculado para o brilho

            // DESENHA A FORMA DO INIMIGO COM O BRILHO DA BORDA
            this.drawShape(context);
            
            // Redefine globalAlpha e shadowBlur para o desenho normal do inimigo
            context.globalAlpha = 1;
            context.shadowBlur = 1;

        }

        // Desenha a forma base do inimigo (sem a borda, que já foi "desenhada" como um shadow)
        // Certifique-se de que drawShape não redefine context.globalAlpha ou context.shadowBlur
        // ou que ele os restaure após seu próprio desenho se tiver efeitos internos.
        this.drawShape(context); // Chama o método drawShape para desenhar o corpo do inimigo.

        context.restore(); // Restaura o contexto para o estado anterior
    }

    drawShape(context) {
        // Este é um método placeholder. As subclasses de Enemy devem implementá-lo
        // para desenhar a forma específica do inimigo (retângulos, círculos, etc.).
        // Ex: context.fillStyle = this.color; context.fillRect(this.x, this.y, this.width, this.height);
    }

    takeDamage(damage) {
        this.health -= damage;
        
     
        this.showOutline = true;
        this.outlineTimer = 0; // Reseta o timer para iniciar a animação
        this.outlineDuration = 200; // A borda dura 200ms após o dano
        this.outlineColor = 'rgba(255, 255, 255, 0.8)'; // Borda branca ao tomar dano

        if (this.health <= 0) {
            this.markedForDeletion = true;
            if (this.statusEffects.infection.active) {
                this.game.triggerInfectionExplosion(
                    this.x,
                    this.y,
                    this.width,
                    this.height
                );
            }
            if (this.game.player.upgrades.corpseExplosion.level > 0) {
                this.game.triggerCorpseExplosion(
                    this.x + this.width / 2,
                    this.y + this.height / 2
                );
            }
            this.game.createParticles(
                this.x + this.width / 2,
                this.y + this.height / 2,
                this.color
            );
            this.game.player.gainXP(this.xpValue);
            this.game.player.onKill();
        }
    }
}