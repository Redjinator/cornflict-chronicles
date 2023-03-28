import { Container, Graphics, Sprite } from 'pixi.js';

export function createHearts(app, heartTexture) {
    const heartsContainer = new Container();
    const maxHearts = 5;




    // Add the hearts to the container
    for (let i = 0; i < maxHearts; i++) {
        const heart = new Sprite(heartTexture);
        heart.scale.set(0.3);
        heart.x = i * (heart.width + 10);

        heartsContainer.addChild(heart);

    }

    return heartsContainer;
}