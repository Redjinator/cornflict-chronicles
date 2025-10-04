export function shoot(farmer, bullets, gameScene, shootSound, weaponSystem) {
  // Get shot pattern based on weapon level
  const shotPattern = weaponSystem.getShotPattern(farmer);
  const barrelOffset = 40;

  let shotsCreated = 0;
  for (const shot of shotPattern) {
    const bullet = getBullet(bullets);
    if (!bullet) break; // No more bullets available

    // Offset bullet spawn to the front of the gun barrel
    bullet.x = shot.x + Math.cos(farmer.rotation) * barrelOffset;
    bullet.y = shot.y + Math.sin(farmer.rotation) * barrelOffset;

    bullet.rotation = shot.rotation + Math.PI / 2;
    bullet.vx = shot.vx;
    bullet.vy = shot.vy;
    bullet.zIndex = 0;
    bullet.alpha = 1;
    farmer.zIndex = 1;
    gameScene.addChild(bullet);
    shotsCreated++;
  }

  if (shotsCreated > 0) {
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
