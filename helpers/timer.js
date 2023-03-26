export class Timer {

  constructor(text, endGame, updateOverlayAlphaCallback) {
    this.endGame = endGame;
    this.text = text;
    this.startTime = 30; // set initial time to 90 seconds
    this.currentTime = this.startTime;
    this.timerId = null; // id of the timer to see if it's running
    this.updateOverlayAlphaCallback = updateOverlayAlphaCallback;
  }

  start() {
    this.timerId = setInterval(() => {
      this.update();
    }, 1000);
  }

  stop() {
    clearInterval(this.timerId);
  }

  reset() {
    this.currentTime = this.startTime;
    this.updateText();
  }

  update() {
    if (this.currentTime > 0) {
      this.currentTime--; // count down instead of up
      this.updateText();
      this.updateOverlayAlphaCallback(this.currentTime);
    } else {
      this.stop();
      this.endGame();
    }
  }

  updateText() {
    this.text.text = `Time: ${this.currentTime}`;
  }


}

