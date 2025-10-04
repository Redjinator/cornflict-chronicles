export function shoot(farmer, bullets, gameScene, shootSound) {
  const bullet = getBullet(bullets);
  if (bullet) {
    const { x, y, rotation } = farmer;

    // Offset bullet spawn to the front of the gun barrel
    const barrelOffset = 40; // Distance from center to gun barrel
    bullet.x = x + Math.cos(rotation) * barrelOffset;
    bullet.y = y + Math.sin(rotation) * barrelOffset;

    bullet.rotation = rotation + Math.PI / 2;
    const speed = 25;
    bullet.vx = Math.cos(rotation) * speed;
    bullet.vy = Math.sin(rotation) * speed;
    bullet.zIndex = 0;
    bullet.alpha = 1;
    farmer.zIndex = 1;
    gameScene.addChild(bullet);

    shootSound.volume = 0.2;
    shootSound.play();
  }
}

function getBullet(bullets) {
  for (let i = 0; i < bullets.length; i++) {
    let bullet = bullets[i];
    if (!bullet.parent) {
      return bullet;
    }
  }
}
