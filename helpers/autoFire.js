import { shoot } from "../entities/shoot.js";

export function autoFire(farmer, bullets, gameScene, active, interval) {

  if (active) {
    setInterval(() => {
      shoot(farmer, bullets, gameScene);
    }, interval); // fire every half second
  }
}