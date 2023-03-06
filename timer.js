export class Timer {
    constructor(timerText) {
      this.time = 0;
      this.interval = null;
      this.timerText = timerText;
    }

    start() {
      this.interval = setInterval(() => {
        this.time++;
        this.timerText.text = `Time: ${this.time}`;
      }, 1000);
    }

    stop() {
      clearInterval(this.interval);
    }
  }
  