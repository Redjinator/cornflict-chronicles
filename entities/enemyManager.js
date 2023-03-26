import Enemy from "./enemy2";
import { Container, Sprite } from 'pixi.js';
import Victor from 'victor';
import { hitTestRectangle} from '../helpers/collisions.js';


 export default class EnemyManager {
    constructor(app, farmer, heartsContainer, gameScene) {
        this.app = app;
        this.farmer = farmer;
        this.heartsContainer = heartsContainer;
        this.gameScene = gameScene;
        this.bgBackground = bgBackground;
        this.enemies = [];
        this.enemy = null;

    }

    spawnEnemies(numWaves, waveDelaySec, enemiesPerWave, speed, gameScene, enemies, id, app, farmer) {
        let enemyCount = 0;
        this.enemies = enemies;


        for (let wave = 0; wave < numWaves; wave++) {
            let waveEnemies = 0;
            let spawnInterval = (waveDelaySec*10000) / enemiesPerWave;

            let spawnEnemy = setInterval(() => {
            if (waveEnemies >= enemiesPerWave) {
                clearInterval(spawnEnemy);
                return;
            }

            enemy = this.createEnemy(id, speed, gameScene);
            const { x, y } = getEnemyPosition(app, farmer);
            enemy.x = x;
            enemy.y = y;

            gameScene.addChild(enemy);
            enemies.push(enemy);
            enemyCount++;
            waveEnemies++;
            }, spawnInterval);
        }
    }

    moveEnemies(farmerDelta) {
        function createRedFlash() {
          const redFlash = new PIXI.Graphics();
          redFlash.beginFill(0xFF0000);
          redFlash.drawRect(0, 0, 1280, 720);
          redFlash.endFill();
          redFlash.alpha = 0.0;
          return redFlash;
        }
      
        function moveEnemy(enemy, farmer, farmerDelta) {
          const e = new Victor(enemy.x, enemy.y);
          const f = new Victor(farmer.x, farmer.y);
          const d = f.subtract(e);
          const v = d.normalize().multiplyScalar(enemy.speed);
          enemy.position.set(enemy.position.x + v.x - farmerDelta.x, enemy.position.y + v.y - farmerDelta.y);
        }
      
        function rotateEnemy(enemy, farmer) {
          const enemyPos = {x: enemy.x, y: enemy.y};
          const playerPos = {x: farmer.x, y: farmer.y};
          const dx = playerPos.x - enemyPos.x;
          const dy = playerPos.y - enemyPos.y;
          const angle = Math.atan2(dy, dx);
          enemy.rotation = angle + Math.PI * 1.5;
        }
      
      
        for (let i = 0; i < enemies.length; i++) {
          const enemy = enemies[i];
          moveEnemy(enemy, farmer, farmerDelta);
          rotateEnemy(enemy, farmer);
          if (hitTestRectangle(farmer, enemy)) {
            playOuchSounds(redFlash);
            gameScene.removeChild(enemy);
            enemies.splice(i, 1);
            heartsContainer.removeChildAt(heartsContainer.children.length - 1);
            break;
          }
        }
      }

    createEnemy(id, speed) {
        const enemy = new Sprite(id['ecorn.png']);
        setSpriteProperties(enemy, 0.5, 0.5, 0, 0);
        enemy.scale.set(0.1);
        enemy.anchor.set(0.5);
        enemy.speed = Math.random() * speed;
        return enemy;
    }
}