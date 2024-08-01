import Phaser from 'phaser';
import Game from './components/Game.js';
import constants from './constants.js'


const config = {
    type: Phaser.AUTO,
    width: constants.gameScreenSizes.width,
    height: constants.gameScreenSizes.height,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: Game,
};

const game = new Phaser.Game(config);
