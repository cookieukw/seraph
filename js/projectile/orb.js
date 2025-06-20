class Orb {
    constructor(game, player, angleOffset) {
        this.game = game;
        this.player = player;
        this.angleOffset = angleOffset;
        this.distance = 35; // Distância do orb ao jogador
        this.rotationSpeed = 0.02; // Velocidade de rotação ao redor do jogador
        this.currentAngle = 0; // Ângulo atual na órbita

        this.radius = 8; // Define um raio padrão para o orb (ajuste este valor se desejar)
    }

    update(deltaTime) {
        this.currentAngle += this.rotationSpeed;
        this.x =
            this.player.x +
            Math.cos(this.currentAngle + this.angleOffset) * this.distance;
        this.y =
            this.player.y +
            Math.sin(this.currentAngle + this.angleOffset) * this.distance;
    }

    draw(context) {
        this.drawOrb(context); // Chama o método de desenho específico do orb
    }

    drawOrb(context) {
        // Este método está vazio na classe base, mas será sobrescrito por outra classe
        // para desenhar o orb complexo.
    }
}