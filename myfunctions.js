import Victor from 'victor';

//-----------------------
// Set the properties of a sprite
//-----------------------
export function setSpriteProperties(sprite, anchor, scale, positionX, positionY) {
    sprite.anchor.set(anchor);
    sprite.scale.set(scale);
    sprite.position.set(positionX, positionY);
    sprite.vx = 0;
    sprite.vy = 0;
    return sprite;
}

//-----------------------
// Load Progress Handler
//-----------------------
export function loadProgressHandler(loader, resource) {

    // Display the file 'url' currently being loaded
    console.log("Loading: " + resource.url);

    // Display the precentage of files currently loaded
    console.log("Progress: " + loader.progress + "%");
  }



export function fire(sprite, positionX, positionY) {
    sprite.position.set(positionX, positionY);
    sprite.vx = 0;
    sprite.vy = 0;
    return sprite;
}

export function randomSpawnPoint() {
    let edge = Math.floor(Math.random() * 4);
    let spawnPoint = new Victor(0, Math.random() * 100);
    switch(edge) {
        case 0: // top
        spawnPoint.x = Math.floor(Math.random() * 1280);
        break;
        case 1: // right
        spawnPoint.x = 1280;
        spawnPoint.y = Math.floor(Math.random() * 720);
        break;
        case 2: // bottom
        spawnPoint.x = Math.floor(Math.random() * 1280);
        spawnPoint.y = 720;
        break;
        default: // left
        spawnPoint.x = 0;
        spawnPoint.y = Math.floor(Math.random() * 720);
        break;
    }
    return spawnPoint;
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
  
