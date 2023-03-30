export function shoot(farmer, bullets, gameScene, shootSound) {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    if (!bullet.parent) {
      bullet.x = 640;
      bullet.y = 360;
      bullet.rotation = farmer.rotation + Math.PI / 2;
      const speed = 25;
      bullet.vx = Math.cos(farmer.rotation) * speed;
      bullet.vy = Math.sin(farmer.rotation) * speed;
      bullet.zIndex = 0;
      bullet.alpha = 0;
      farmer.zIndex = 1;
      gameScene.addChild(bullet);

      setTimeout(() => {
        bullet.alpha = 1;
      }, 50);

      shootSound.play();
      break;
    }
  }
}
