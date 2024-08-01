import Player from './Player.js';
import Enemy from './Enemy.js';
import constants from '../constants.js';

let platforms;
let player;
let cursors;
let stars;
let score = 0;
let scoreText;
let bombs;
let gameOver;

function createStars(starGroup, count, platforms, offsetX = 12, yRange = [50, 300]) {
    for (let i = 0; i < count; i++) {
        let star;
        let randomY;
        do {
            randomY = Phaser.Math.Between(yRange[0], yRange[1]); // Generate a random Y
        } while (isOverlappingWithPlatforms(randomY, platforms)); // Check for overlap with platforms
        star = starGroup.create(offsetX + (70 * i), randomY, 'star');
        star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    }
}

function createBomb(bombs, player) {
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
}


function isOverlappingWithPlatforms(starY, platforms) {
    let overlapping = false;
    platforms.children.each(platform => {
        if (starY < platform.y && starY > platform.y - platform.displayHeight / 2) {
            overlapping = true;
        }
    });
    return overlapping;
}


function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    if (stars.countActive(true) === 0) {
        createStars(stars, 12, platforms);
        createBomb(bombs, player);
    }
}


function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}

class Game extends Phaser.Scene {
    constructor() {
        super({ key: 'Game' });
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {
        this.add.image(constants.gameScreenSizes.width / 2, constants.gameScreenSizes.height / 2, 'sky');
        platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        player = this.physics.add.sprite(100, 450, 'dude');
        player.body.setGravityY(300);
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.physics.add.collider(player, platforms);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        stars = this.physics.add.group();

        // Create initial stars
        createStars(stars, 12, platforms);

        this.physics.add.collider(stars, platforms);
        this.physics.add.overlap(player, stars, collectStar, null, this);

        bombs = this.physics.add.group();
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(player, bombs, hitBomb, null, this);

        this.time.addEvent({
            delay: 30000, // 30 seconds
            callback: () => createBomb(bombs, player),
            callbackScope: this,
            loop: true
        });

        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (cursors.left.isDown) {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }


}

export default Game;
