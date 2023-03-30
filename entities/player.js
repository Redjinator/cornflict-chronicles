import { Container, AnimatedSprite } from "pixi.js";

export default class Player extends Container {
  constructor() {
    super();
    this.previousAnimation = null;
  }

  initAnimations(idle, shoot, run, hurt, death) {
    this.idleAnimation = new PIXI.AnimatedSprite(idle);
    this.runAnimation = new PIXI.AnimatedSprite(run);
    this.hurtAnimation = new PIXI.AnimatedSprite(hurt);
    this.deathAnimation = new PIXI.AnimatedSprite(death);
    this.shootAnimation = new PIXI.AnimatedSprite(shoot);

    this.idleAnimation.anchor.set(0.5);
    this.idleAnimation.scale.set(0.2);
    this.idleAnimation.animationSpeed = 0.3;
    this.idleAnimation.loop = true;
    this.idleAnimation.play();

    this.runAnimation.anchor.set(0.5);
    this.runAnimation.scale.set(0.2);
    this.runAnimation.animationSpeed = 0.2;
    this.runAnimation.loop = true;
    this.runAnimation.play();

    this.hurtAnimation.anchor.set(0.5);
    this.hurtAnimation.scale.set(0.2);
    this.hurtAnimation.animationSpeed = 0.1;
    this.hurtAnimation.loop = false;
    this.hurtAnimation.play();

    this.deathAnimation.anchor.set(0.5);
    this.deathAnimation.scale.set(0.2);
    this.deathAnimation.animationSpeed = 0.1;
    this.deathAnimation.loop = false;
    this.deathAnimation.play();

    this.shootAnimation.anchor.set(0.5);
    this.shootAnimation.scale.set(0.2);
    this.shootAnimation.animationSpeed = 0.3;
    this.shootAnimation.loop = true;
    this.shootAnimation.play();

    this.addChild(this.idleAnimation);
  }

  setAnimation(animation) {
    // Remove all animations
    this.removeChild(this.idleAnimation);
    this.removeChild(this.runAnimation);
    this.removeChild(this.hurtAnimation);
    this.removeChild(this.deathAnimation);
    this.removeChild(this.shootAnimation);

    // Add the animations
    if (animation === "run") {
      this.addChild(this.runAnimation);
    } else if (animation === "idle") {
      this.addChild(this.idleAnimation);
    } else if (animation === "hurt") {
      this.addChild(this.hurtAnimation);
    } else if (animation === "die") {
      this.addChild(this.deathAnimation);
    } else if (animation === "shoot") {
      this.addChild(this.shootAnimation);
    } else console.error("Animation not found:", animation);
  }
}
