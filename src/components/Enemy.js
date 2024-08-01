class Enemy {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'enemy');
        this.sprite.setVelocityX(100); // Example velocity
    }

    update() {
        // Simple enemy movement logic
        if (this.sprite.x > 800 || this.sprite.x < 0) {
            this.sprite.setVelocityX(-this.sprite.body.velocity.x);
        }
    }
}

export default Enemy;
