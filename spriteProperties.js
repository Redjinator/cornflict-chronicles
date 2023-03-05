export function setSpriteProperties(sprite, anchor, scale, positionX, positionY) {
    sprite.anchor.set(anchor);
    sprite.scale.set(scale);
    sprite.position.set(positionX, positionY);
    sprite.vx = 0;
    sprite.vy = 0;
    return sprite;
}