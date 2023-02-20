import { Container, Text, TextStyle } from 'pixi.js';
import { setup } from './main.js';

export default class GameOver {
    constructor(app) {
        this.app = app;
        this.scene = new Container();

        const gameOverText = new Text('Game Over', new TextStyle({
            fontFamily: 'Arial',
            fontSize: 72,
            fill: 'white'
            }));
        gameOverText.anchor.set(0.5, 0.5);
        gameOverText.position.set(1280 / 2, 720 / 2);

        const restartButton = new Text('Restart', new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 'white'
            }));
        restartButton.anchor.set(0.5, 0.5);
        restartButton.position.set(1280 / 2, 720 / 2 + 100);
        restartButton.interactive = true;
        restartButton.buttonMode = true;
        restartButton.on('pointerdown', () => {
            this.app.stage.removeChild(this.scene);
            // use setup in main.js to start a new game
            setup();
    });

    this.scene.addChild(gameOverText, restartButton);
    }
}