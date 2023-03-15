import { Container, Graphics, Sprite } from 'pixi.js';

export function createHearts(app) {
    const heartsContainer = new Container();
    const maxHearts = 5;
    const graphics = new Graphics();

    graphics.beginFill(0xff0000);
    graphics.moveTo(75, 40);
    graphics.bezierCurveTo(75, 37, 70, 25, 50, 25);
    graphics.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
    graphics.bezierCurveTo(20, 80, 40, 102, 75, 120);
    graphics.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
    graphics.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
    graphics.bezierCurveTo(85, 25, 75, 37, 75, 40);
    graphics.endFill();

    const heartTexture = app.renderer.generateTexture(graphics);

    // Add the hearts to the container
    for (let i = 0; i < maxHearts; i++) {
        const heart = new Sprite(heartTexture);
        heart.scale.set(0.4); // Set the size of the heart
        heart.x = i * (heart.width + 10); // Position each heart
        heartsContainer.addChild(heart); // Add the heart to the container
    }

    return heartsContainer;
}