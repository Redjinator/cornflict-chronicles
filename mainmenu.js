

export default class MainMenu {
    constructor({app, state, gameScene, highScoresScene, gameOverScene}) {
        this.app = app;
        this.state = state;
        this.gameScene = gameScene;
        this.menuScene = new PIXI.Container();


        // * Start Game Button Text
        // *=================================================
        this.startButton = new PIXI.Text("START GAME");
        this.startButton.style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontSize: 24,
            fontFamily: "Arial",
            align: "center"
        });
        this.startButton.x = this.app.screen.width / 2;
        this.startButton.y = this.app.screen.height / 2;
        this.startButton.anchor.set(0.5, 0.5);
        this.menuScene.addChild(this.startButton);

        // Listener for start button
        this.startButton.interactive = true;
        this.startButton.buttonMode = true;
        this.startButton.on('pointerdown', () => {
            this.app.stage.removeChild(this.menuScene);
            this.app.stage.addChild(this.gameScene);
            this.state = app.play;
        });


        // *High Score Button Text
        // *=================================================
        this.highScoresButton = new PIXI.Text("HIGH SCORES");
        this.highScoresButton.style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontSize: 24,
            fontFamily: "Arial",
            align: "center"
        });
        this.highScoresButton.x = this.app.screen.width / 2;
        this.highScoresButton.y = this.app.screen.height / 2 + 50;
        this.highScoresButton.anchor.set(0.5, 0.5);
        this.menuScene.addChild(this.highScoresButton);

        // Listener for high scores button
        this.highScoresButton.interactive = true;
        this.highScoresButton.buttonMode = true;
        this.highScoresButton.on('pointerdown', () => {
            this.app.stage.removeChild(this.menuScene);
            this.app.stage.addChild(this.highScoresScene);
        });

        // *Game Over Button Text
        // *=================================================
        this.gameOverButton = new PIXI.Text("GAME OVER TEST");
        this.gameOverButton.style = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontSize: 24,
            fontFamily: "Arial",
            align: "center"
        });
        this.gameOverButton.x = this.app.screen.width / 2;
        this.gameOverButton.y = this.app.screen.height / 2 + 100;
        this.gameOverButton.anchor.set(0.5, 0.5);
        this.menuScene.addChild(this.gameOverButton);

        // Listener for high scores button
        this.gameOverButton.interactive = true;
        this.gameOverButton.buttonMode = true;
        this.gameOverButton.on('pointerdown', () => {
            this.app.stage.removeChild(this.menuScene);
            this.app.stage.addChild(this.highScoresScene);
        });
    }
}