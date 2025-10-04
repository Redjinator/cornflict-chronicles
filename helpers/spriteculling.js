// Simple sprite culling - hide sprites outside viewport
export function cullSprites(sprites, viewport) {
  const { width, height } = viewport;
  const padding = 200; // Extra padding to avoid popping

  for (let i = 0; i < sprites.length; i++) {
    const sprite = sprites[i];
    if (!sprite || !sprite.parent) continue;

    const isVisible =
      sprite.x > -padding &&
      sprite.x < width + padding &&
      sprite.y > -padding &&
      sprite.y < height + padding;

    sprite.visible = isVisible;
    sprite.renderable = isVisible;
  }
}
