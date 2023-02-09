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
