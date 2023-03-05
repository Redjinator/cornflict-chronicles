export function fire(sprite, positionX, positionY) {
    sprite.position.set(positionX, positionY);
    sprite.vx = 0;
    sprite.vy = 0;
    return sprite;
}



function resetGame() {
    // Reset variables to initial values
    enemies = [];
    bullets = [];
    score = 0;
    scoreboard.text = "Score:" + score;
    heartsContainer.removeChildren();
    for (let i = 0; i < maxHearts; i++) {
      const heart = new PIXI.Sprite(heartTexture);
      heart.scale.set(0.2); // Set the size of the heart
      heart.x = i * (heart.width + 10); // Position each heart
      heartsContainer.addChild(heart); // Add the heart to the container
    }
    gameScene.addChild(fieldbg);
    gameScene.addChild(farmer);
    state = play;
  }
  
