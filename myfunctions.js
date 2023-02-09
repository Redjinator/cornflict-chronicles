

// Set the properties of a sprite
export function setSpriteProperties(sprite, anchor, scale, positionX, positionY) {
  sprite.anchor.set(anchor);sprite.scale.set(scale);
  sprite.position.set(positionX, positionY);
  return sprite;
}

// Load Progress Handler
export function loadProgressHandler(loader, resource) {
    // Display the file 'url' currently being loaded
    console.log("Loading: " + resource.url);
  
    // Display the precentage of files currently loaded
    console.log("Progress: " + loader.progress + "%");
  }