class BackgroundParticle {
    constructor(game) {
        this.game = game;
        this.x = Math.random() * this.game.width;
        this.y = Math.random() * this.game.height;
        this.size = Math.random() * 2 + 0.5;
        this.speed = Math.random() * 0.5 + 0.2;
        this.opacity = Math.random() * 0.5 + 0.5;
    }
    update() {
        this.y += this.speed;
        if (this.y > this.game.height) {
            this.y = 0;
            this.x = Math.random() * this.game.width;
        }
    }
    draw(c) {
        c.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        c.beginPath();
        c.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        c.fill();
    }
}