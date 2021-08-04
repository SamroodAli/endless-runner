import Phaser from "phaser";
import platform from "../assets/platform.png";
import dude from "../assets/dude.png";
import { gameOptions } from "../gameOptions.js";

class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }
  preload() {
    this.load.image("platform", platform);
    this.load.spritesheet("dude", dude, { frameWidth: 32, frameHeight: 48 });
  }
  create() {
    this.platformGroup = this.add.group({
      removeCallback: (platform) => this.platformPool.add(platform),
    });
    this.platformpool = this.add.group({
      removeCallback: (platform) => this.platformGroup.add(platform),
    });
    this.playerJumps = 0;
  }

  addPlatform(platformWidth, posX) {
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
    } else {
      platform = this.physics.add.sprite(
        posX,
        game.config.height * 0.8,
        "platform"
      );
      platform.setImmovable(true);
      platform.setVelocityX(gameOptions.platformStartSpeed * -1);
      this.platformGroup.add(platform);
    }
    platform.displayWidth = platformWidth;
    this.nextPlatformDistance = Phaser.Math.Between(
      gameOptions.spawnRange[0],
      gameOptions.spawnRange[1]
    );
  }
}
export default Game;
