import { Container, Graphics, Sprite } from 'pixi.js';

export function createHearts(app) {
    const heartsContainer = new Container();
    const maxHearts = 5;
    const graphics = new Graphics();

    graphics.beginFill(0xffffff);
    graphics.moveTo(75, 40);
    graphics.bezierCurveTo(75, 37, 70, 25, 50, 25);
    graphics.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
    graphics.bezierCurveTo(20, 80, 40, 102, 75, 120);
    graphics.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
    graphics.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
    graphics.bezierCurveTo(85, 25, 75, 37, 75, 40);
    graphics.endFill();

    const heartTexture = app.renderer.generateTexture(graphics);




    const graphics2 = new Graphics();

    graphics2.beginFill(0xf00000);
    graphics2.moveTo(75, 40);
    graphics2.bezierCurveTo(75, 37, 70, 25, 50, 25);
    graphics2.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
    graphics2.bezierCurveTo(20, 80, 40, 102, 75, 120);
    graphics2.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
    graphics2.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
    graphics2.bezierCurveTo(85, 25, 75, 37, 75, 40);
    graphics2.endFill();
    const heartTextureInner = app.renderer.generateTexture(graphics2);

    // Add the hearts to the container
    for (let i = 0; i < maxHearts; i++) {
        const heart = new Sprite(heartTexture);
        heart.scale.set(0.4);
        heart.x = i * (heart.width + 10);

        const heartInner = new Sprite(heartTextureInner);
        heartInner.scale.set(0.35);
        heartInner.x = heart.x + 3.3;
        heartInner.y = heart.y + 3.3;

        heartsContainer.addChild(heart);
        heartsContainer.addChild(heartInner);
    }

    return heartsContainer;
}