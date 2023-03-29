export function shoot(farmer, bullets, gameScene) {
  for (let i=0; i<bullets.length; i++) {
    let bullet = bullets[i];
    if (!bullet.parent) {
      bullet.x = farmer.x;
      bullet.y = farmer.y;
      bullet.rotation = (farmer.rotation + Math.PI / 2);
      const speed = 15;
      bullet.vx = Math.cos(farmer.rotation) * speed;
      bullet.vy = Math.sin(farmer.rotation) * speed;
      bullet.zIndex = 0;
      bullet.alpha = 0;
      farmer.zIndex = 1;
      gameScene.addChild(bullet);

      setTimeout(() => {
        bullet.alpha = 1;
      }, 70);

      let instance = new Audio("/audio/shot.mp3");
      instance.volume = 0.1;
      instance.play();
      break;
    }
  }
}
