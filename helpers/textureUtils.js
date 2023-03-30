

export function getTexture(resources, spritesheetKey, textureKey) {
  const spritesheet = resources[spritesheetKey].spritesheet;
  const texture = spritesheet.textures[textureKey];
  return texture;
}

export function getAnimation(resources, spritesheetKey, animationKey) {
  const spritesheet = resources[spritesheetKey].spritesheet;
  const animation = spritesheet.animations[animationKey];
  return animation;
}