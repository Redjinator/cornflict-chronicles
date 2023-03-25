import { shoot } from "../entities/shoot.js";

export function autoFire(farmer, bullets, gameScene) {
    setInterval(() => {
      shoot(farmer, bullets, gameScene);
    }, 500); // fire every half second
  }