import Phaser from "phaser";
import platform from "../assets/platform.png";
import dude from "../assets/dude.png";
import { gameOptions, gameConfig } from "../gameOptions.js";

class Game extends Phaser.Scene {
  platformPool;
  constructor() {
    super("game");
  }
  preload() {
    this.load.image("platform", platform);
    this.load.spritesheet("dude", dude, { frameWidth: 32, frameHeight: 48 });
  }
  create() {
    this.platformGroup = this.add.group({
      // once a platform is removed, it's added to the pool
      removeCallback: function (platform) {
        platform.scene.platformPool.add(platform);
      },
    });

    // pool
    this.platformPool = this.add.group({
      // once a platform is removed from the pool, it's added to the active platforms group
      removeCallback: function (platform) {
        platform.scene.platformGroup.add(platform);
      },
    });
    this.playerJumps = 0;
    this.addPlatform(gameConfig.width, gameConfig.width / 2);
    this.player = this.physics.add.sprite(
      gameOptions.playerStartPosition,
      gameConfig.height / 2,
      "dude"
    );
    this.player.setGravityY(gameOptions.playerGravity);
    this.physics.add.collider(this.player, this.platformGroup);
    this.input.on("pointerdown", this.jump, this);
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
        gameConfig.height * 0.7,
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
  jump() {
    if (
      this.player.body.touching.down ||
      (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)
    ) {
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
      }
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.playerJumps++;
    }
  }
}
export default Game;
