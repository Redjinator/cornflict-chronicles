export class Timer {

  constructor(text, app) {
    this.app = app;
    this.text = text;
    this.startTime = 20; // set initial time to 90 seconds
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
      // TODO - add game over state
      this.stop();
    }
  }

  updateText() {
    this.text.text = `Time: ${this.currentTime}`;
  }
}

