import Phaser from "phaser";
import platform from "../assets/platform.png";
import dude from "../assets/dude.png";
import { gameOptions, gameConfig } from "../gameOptions.js";

class Game extends Phaser.Scene {
  platformPool;
  constructor() {
    super("game");
  }

  create() {
    this.addedPlatforms = 0;
    this.platformGroup = this.add.group({
      // once a platform is removed, it's added to the pool
      removeCallback: (platform) => {
        this.platformPool.add(platform);
      },
    });

    // pool
    this.platformPool = this.add.group({
      // once a platform is removed from the pool, it's added to the active platforms group
      removeCallback: (platform) => {
        this.platformGroup.add(platform);
      },
    });
    this.coinGroup = this.add.group({
      removeCallback: (coin) => this.coinPool.add(coin),
    });
    this.coinPool = this.add.group({
      removeCallback: (coin) => this.coinGroup.add(coin),
    });
    this.playerJumps = 0;
    this.addPlatform(
      gameConfig.width,
      gameConfig.width / 2,
      gameConfig.height * gameOptions.platformVerticalLimit[0]
    );
    this.player = this.physics.add.sprite(
      gameOptions.playerStartPosition,
      gameConfig.height / 2,
      "dude"
    );
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNames("dude", { start: 6, end: 9 }),
      framerate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 6 }],
      frameRate: 20,
    });

    this.player.setGravityY(gameOptions.playerGravity);
    this.physics.add.collider(this.player, this.platformGroup);
    this.input.on("pointerdown", this.jump, this);
  }
  update() {
    // game over
    if (this.player.y > gameConfig.height) {
      this.add.text(
        gameConfig.width / 2.5,
        gameConfig.height / 4,
        "Game Over",
        {
          fill: "#000",
          fontSize: "40px",
          alignSelf: "center",
        }
      );
      this.physics.pause();
    }
    this.player.x = gameOptions.playerStartPosition;

    // recycling platforms
    let minDistance = gameConfig.width; //screen Width
    let lastPlatformHeight = 0;
    this.platformGroup.getChildren().forEach((platform) => {
      let platformDistance =
        gameConfig.width - (platform.x + platform.displayWidth / 2); //1050
      minDistance = Math.min(minDistance, platformDistance); // 1050
      lastPlatformHeight = platform.y;
      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);
    // adding new platforms
    if (minDistance > this.nextPlatformDistance) {
      const nextPlatformWidth = Phaser.Math.Between(
        gameOptions.platformSizeRange[0],
        gameOptions.platformSizeRange[1]
      );
      const platformRandomHeight = Phaser.Math.Between(
        ...gameOptions.platformHeightRange
      );
      const nextPlatformGap = lastPlatformHeight + platformRandomHeight;
      const minPlatformHeight =
        gameConfig.height * gameOptions.platformVerticalLimit[0];
      const maxPlatformHeight =
        gameConfig.height * gameOptions.platformVerticalLimit[1];
      const nextPlatformHeight = Phaser.Math.Clamp(
        nextPlatformGap,
        minPlatformHeight,
        maxPlatformHeight
      );
      this.addPlatform(
        nextPlatformWidth,
        gameConfig.width + nextPlatformWidth / 2,
        nextPlatformHeight
      );
    }
    if (this.player.body.touching.down) {
      this.player.anims.play("run", true);
      this.playerJumps = 0;
    } else {
      this.player.anims.play("turn", true);
    }
  }

  addPlatform(platformWidth, posX, posY) {
    //add from the pool if available or else create a platform and add it to the group
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.y = posY;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
    } else {
      platform = this.physics.add.image(posX, posY, "platform");
      platform.setImmovable(true);
      platform.setVelocityX(
        Phaser.Math.Between(...gameOptions.platformSpeedRange) * -1
      );
      this.platformGroup.add(platform);
    }
    platform.displayWidth = platformWidth;
    this.nextPlatformDistance = Phaser.Math.Between(...gameOptions.spawnRange);
  }
  jump() {
    if (this.playerJumps < gameOptions.jumps) {
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.playerJumps++;
    }
  }
}
export default Game;
