export default class HighScore {
    constructor() {
      // Initialize high scores with some default values
      this.highScores = [100, 80, 60, 40, 20];
    }
  
    addScore(newScore) {
      // Check if the new score is higher than the lowest score in the high score list
      if (newScore > this.highScores[this.highScores.length - 1]) {
        // Add the new score to the high score list
        this.highScores.push(newScore);
        // Sort the high score list in descending order
        this.highScores.sort((a, b) => b - a);
        // Remove the lowest score from the high score list
        this.highScores.pop();
      }
    }
  }
  