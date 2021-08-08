import Phaser from "phaser";
import platform from "../assets/platform.png";
import dude from "../assets/dude.png";
import { gameOptions, gameConfig } from "../gameOptions.js";

class Game extends Phaser.Scene {
  platformPool;
  constructor() {
    super("Game");
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
      gameConfig.height * gameOptions.platformVerticalLimit[1]
    );
    this.player = this.physics.add.sprite(
      gameOptions.playerStartPosition,
      gameConfig.height / 2,
      "dude"
    );
    this.player.setGravityY(gameOptions.playerGravity);

    this.physics.add.collider(
      this.player,
      this.platformGroup,
      () => {
        if (!this.player.anims.isPlaying) {
          this.player.anims.play("run");
        }
      },
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.coinGroup,
      this.collectCoin,
      null,
      this
    );

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 6 }],
      frameRate: 20,
    });

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
    this.addedPlatforms += 1;
    //add from the pool if available or else create a platform and add it to the group
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.y = posY;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
      platform.displayWidth = platformWidth;
    } else {
      platform = this.add.tileSprite(posX, posY, platformWidth, 32, "platform");
      this.physics.add.existing(platform);
      platform.body.setImmovable(true);
      platform.body.setVelocityX(
        Phaser.Math.Between(...gameOptions.platformSpeedRange) * -1
      );
      this.platformGroup.add(platform);
    }
    this.nextPlatformDistance = Phaser.Math.Between(...gameOptions.spawnRange);
    // Adding coin over platform
    if (this.addedPlatforms > 1) {
      if (Phaser.Math.Between(1, 100) <= gameOptions.coinPercent) {
        if (this.coinPool.getLength()) {
          let coin = this.coinPool.getFirst();
          coin.x = posX;
          coin.y = posY - 96;
          coin.alpha = 1;
          coin.active = true;
          coin.visible = true;
          this.coinPool.remove(coin);
        } else {
          let coin = this.physics.add.sprite(posX, posY - 96, "coin");
          coin.setImmovable = true;
          coin.setVelocityX(platform.body.velocity.x);
          coin.anims.play("rotate");
          this.coinGroup.add(coin);
        }
      }
    }
  }
  jump() {
    if (this.playerJumps < gameOptions.jumps) {
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.playerJumps++;
    }
  }
  collectCoin(player, coin) {
    this.tweens.add({
      target: coin,
      y: coin.y - 100,
      alpha: 0,
      duration: 800,
      ease: "Cubic.easeOut",
      callbackScope: this,
      onComplete: () => {
        this.coinGroup.killAndHide(coin);
        this.coinGroup.remove(coin);
      },
    });
  }
}
export default Game;
