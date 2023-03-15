export class Timer {

  constructor(text, endGame) {
    this.endGame = endGame;
    this.text = text;
    this.startTime = 125; // set initial time to 90 seconds
    this.currentTime = this.startTime;
    this.timerId = null; // id of the timer to see if it's running
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
    } else {
      this.stop();
      this.endGame();
    }
  }

  updateText() {
    this.text.text = `Time: ${this.currentTime}`;
  }
}

