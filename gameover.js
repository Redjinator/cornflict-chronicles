import { Container, Text, TextStyle } from 'pixi.js';


export default class GameOver {
    constructor({app, score, highScores, onGameOver}) {
        this.app = app;
        this.score = score;
        this.highScores = highScores;
        this.onGameOver = onGameOver;

        this.gameOverScene = new Container()
    }
}