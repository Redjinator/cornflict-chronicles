// High Score Manager using localStorage
export class HighScoreManager {
  constructor() {
    this.storageKey = 'cornflict-chronicles-highscore';
  }

  getHighScore() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? parseInt(stored, 10) : 0;
  }

  setHighScore(score) {
    const currentHigh = this.getHighScore();
    if (score > currentHigh) {
      localStorage.setItem(this.storageKey, score.toString());
      return true; // New high score!
    }
    return false; // Not a new high score
  }

  resetHighScore() {
    localStorage.removeItem(this.storageKey);
  }
}
