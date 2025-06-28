// js/effects/vignette_effect.js

class VignetteEffect {
    constructor(game) {
        this.game = game;
        this.life = 1.0; // Duração em porcentagem
        this.duration = 2000; // Duração total em milissegundos
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        this.life -= (deltaTime / this.duration); // Decai com base no tempo
        if (this.life <= 0) {
            this.life = 0;
            this.markedForDeletion = true;
        }
    }

    draw(c) {
        if (this.life <= 0) return;

        c.save();
        const gradient = c.createRadialGradient(
            this.game.width / 2, this.game.height / 2, this.game.height / 3,
            this.game.width / 2, this.game.height / 2, this.game.width / 1.5
        );
        
        // A cor e opacidade são controladas pela vida do efeito
        gradient.addColorStop(0, `rgba(255, 220, 0, 0)`);
        gradient.addColorStop(1, `rgba(255, 200, 0, ${this.life * 0.4})`);
        
        c.fillStyle = gradient;
        c.fillRect(0, 0, this.game.width, this.game.height);
        c.restore();
    }
}