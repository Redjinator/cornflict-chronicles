import { Container, Text, TextStyle, Graphics} from 'pixi.js';
import Scoreboard from './scoreboard';

export default class GameOver {
  constructor(app, scoreboard) {
    this.app = app;
    this.gameOverScene = new Container();
    this.scoreboard = scoreboard;


    // Display Score
    this.finalScoreText = new PIXI.Text(`Final Score ${this.scoreboard}`, {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xffffff,
      align: 'center'
      });

    // Just a black background for now, will replace later with a cool gameover screen
    const blackBG = new Graphics();
    blackBG.beginFill(0x000000);
    blackBG.drawRect(0, 0, app.view.width, app.view.height);
    blackBG.endFill();
    this.gameOverScene.addChild(blackBG);

    
    this.finalScoreText.anchor.set(0.5);
    this.finalScoreText.x = this.app.screen.width / 2;
    this.finalScoreText.y = this.app.screen.height / 2 - 50;
    this.gameOverScene.addChild(this.finalScoreText);
    



    // * Start Game Button Text
    // *=================================================
    this.restartButton = new Text("RESTART");
    this.restartButton.style = new TextStyle({
      fill: 0xFFFFFF,
      fontSize: 24,
      fontFamily: "Arial",
      align: "center"
    });
    this.restartButton.x = this.app.screen.width / 2;
    this.restartButton.y = this.app.screen.height / 2;
    this.restartButton.anchor.set(0.5, 0.5);
    this.gameOverScene.addChild(this.restartButton);

    // Listener for start button
    this.restartButton.interactive = true;
    this.restartButton.buttonMode = true;

    this.restartButton.on('pointerdown', () => {
      console.log("Restart Button Clicked");
    });

  }


}
