// js/effects/boss_laser_aim.js
class BossLaserAim {
    constructor(game, sourceX, sourceY, targetAngle, duration) {
        this.game = game;
        this.x = sourceX;
        this.y = sourceY;
        this.angle = targetAngle;
        // Garante uma duração mínima para a mira ser visível (ex: 50ms)
        this.duration = Math.max(duration, 50);
        this.timer = this.duration;
        this.markedForDeletion = false;

        this.lineLength = 1000;
    }

    update(deltaTime) {
        this.timer -= deltaTime;
        if (this.timer <= 0) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        if (this.markedForDeletion) return;
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);

        // Calcula a opacidade baseada no tempo restante
        const opacity = Math.max(0, Math.min(1, this.timer / this.duration));
        context.strokeStyle = `rgba(255, 0, 0, ${0.5 * opacity})`; // Mira vermelha com opacidade
        context.lineWidth = 2;
        context.setLineDash([15, 10]); // Linha pontilhada

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(this.lineLength, 0);
        context.stroke();
        context.restore();
    }
}