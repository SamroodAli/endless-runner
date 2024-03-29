import Phaser from "phaser";
import { gameOptions, gameConfig } from "../gameOptions.js";

class Game extends Phaser.Scene {
  platformPool;
  constructor() {
    super("Game");
  }

  create() {
    this.mountainGroup = this.add.group();

    this.addedPlatforms = 0;
    this.platformGroup = this.add.group({
      removeCallback: (platform) => {
        this.platformPool.add(platform);
      },
    });

    // pool
    this.platformPool = this.add.group({
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

    this.fireGroup = this.add.group({
      removeCallback: (fire) => this.firePool.add(fire),
    });

    this.firePool = this.add.group({
      removeCallback: (fire) => this.fireGroup.add(fire),
    });

    this.dying = false;

    this.addMountains();

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
    this.player.setDepth(2);
    this.player.setGravityY(gameOptions.playerGravity);

    this.platformCollider = this.physics.add.collider(
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
      function (player, coin) {
        this.coinGroup.killAndHide(coin);
        this.coinGroup.remove(coin);
      },
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.fireGroup,
      (player, fire) => {
        this.dying = true;
        this.player.anims.stop();
        this.player.setFrame(3);
        this.player.body.setVelocityY(-200);
        this.physics.world.removeCollider(this.platformCollider);
      },
      null,
      this
    );

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 6 }],
      frameRate: 20,
    });

    this.input.keyboard.on("keydown-SPACE", this.jump, this);
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
      this.time.delayedCall(
        1000,
        () => {
          this.scene.stop();
          this.scene.start("PreloadGame");
        },
        null,
        this
      ); // delay in ms
    }
    this.player.x = gameOptions.playerStartPosition;
    let minDistance = gameConfig.width;
    let rightmostPlatformHeightFromBottom = 0;

    this.platformGroup.getChildren().forEach((platform) => {
      let platformDistance =
        gameConfig.width - (platform.x + platform.displayWidth / 2);

      if (platformDistance < minDistance) {
        minDistance = platformDistance;
        rightmostPlatformHeightFromBottom = platform.y;
      }

      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    this.coinGroup.getChildren().forEach((coin) => {
      if (coin.x < coin.displayWidth / 2) {
        this.coinGroup.killAndHide(coin);
        this.coinGroup.remove(coin);
      }
    });
    this.fireGroup.getChildren().forEach((fire) => {
      if (fire.x < fire.displayWidth / 2) {
        this.fireGroup.killAndHide(fire);
        this.fireGroup.remove(fire);
      }
    });

    if (minDistance > this.nextPlatformDistance) {
      let nextPlatformWidth = Phaser.Math.Between(
        ...gameOptions.platformSizeRange
      );
      let platformRandomHeight =
        gameOptions.platformHeightScale *
        Phaser.Math.Between(...gameOptions.platformHeightRange);
      let nextPlatformGap =
        rightmostPlatformHeightFromBottom + platformRandomHeight;
      let minPlatformHeight =
        gameConfig.height * gameOptions.platformVerticalLimit[0];
      let maxPlatformHeight =
        gameConfig.height * gameOptions.platformVerticalLimit[1];
      let nextPlatformHeight = Phaser.Math.Clamp(
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

    this.mountainGroup.getChildren().forEach((mountain) => {
      if (mountain.x < -mountain.displayWidth) {
        let rightMostMountain = this.getRightMostMountain();
        mountain.x = rightMostMountain + Phaser.Math.Between(100, 350);
        mountain.y = gameConfig.height * Phaser.Math.Between(0, 100);
        mountain.setFrame(Phaser.Math.Between(0, 3));
        if (Phaser.Math.Between(0, 1)) {
          mountain.setDepth(1);
        }
      }
    }, this);

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
      platform.setDepth(2);
    }
    this.nextPlatformDistance = Phaser.Math.Between(...gameOptions.spawnRange);
    // Adding coin over platform
    if (this.addedPlatforms > 1) {
      if (Phaser.Math.Between(1, 100) <= gameOptions.coinPercent) {
        let coin;
        if (this.coinPool.getLength()) {
          coin = this.coinPool.getFirst();
          coin.x = posX;
          coin.y = posY - 96;
          coin.alpha = 1;
          coin.active = true;
          coin.visible = true;
          this.coinPool.remove(coin);
        } else {
          coin = this.physics.add.sprite(posX, posY - 60, "gold1");
          coin.setImmovable = true;
          coin.setVelocityX(platform.body.velocity.x);
          this.coinGroup.add(coin);
        }
        coin.setScale(0.5);
        coin.setDepth(2);
        coin.anims.play("rotate");
      }
    }
    if (Phaser.Math.Between(0, 100) < gameOptions.firePercent) {
      const startPlatform = posX - platformWidth / 2;
      const fireX = startPlatform + Phaser.Math.Between(1, platformWidth);
      const fireY = posY - 46;
      if (this.firePool.getLength()) {
        let fire = this.firePool.getFirst();
        fire.x = fireX;
        fire.y = fireY;
        fire.alpha = 1;
        fire.active = true;
        fire.visible = true;
        this.firePool.remove(fire);
      } else {
        let fire = this.physics.add.sprite(fireX, fireY, "fire").setScale(0.75);
        fire.setImmovable(true);
        fire.setVelocityX(platform.body.velocity.x);
        fire.setSize(8, 2, true);
        fire.anims.play("burn");
        fire.setDepth(2);
        this.fireGroup.add(fire);
      }
    }
  }

  addMountains() {
    let rightMostMountain = this.getRightMostMountain();
    if (rightMostMountain < gameConfig.width * 2) {
      let mountain = this.physics.add.sprite(
        rightMostMountain + Phaser.Math.Between(100, 350),
        gameConfig.height + Phaser.Math.Between(0, 100),
        "mountain"
      );
      mountain.setOrigin(0.5, 1);
      mountain.body.setVelocityX(gameOptions.mountainSpeed * -1);
      this.mountainGroup.add(mountain);
      if (Phaser.Math.Between(0, 1)) {
        mountain.setDepth(1);
      }
      mountain.setFrame(Phaser.Math.Between(0, 3));
      this.addMountains();
    }
  }

  getRightMostMountain() {
    let rightMostMountain = -200;
    this.mountainGroup.getChildren().forEach((mountain) => {
      rightMostMountain = Math.max(rightMostMountain, mountain.x);
    });
    return rightMostMountain;
  }

  jump() {
    if (!this.dying && this.playerJumps < gameOptions.jumps) {
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.playerJumps++;
    }
  }
}

export default Game;
