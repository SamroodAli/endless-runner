import Phaser from "phaser";
import platform from "../assets/platform.png";
import dude from "../assets/dude.png";
import coin from "../assets/coin.png";

class PreloadGame extends Phaser.Scene {
  platformPool;
  constructor() {
    super("PreloadGame");
  }
  preload() {
    this.load.image("platform", platform);

    this.load.spritesheet("dude", dude, {
      frameWidth: 32,
      frameHeight: 48,
    });

    this.load.spritesheet("coin", coin, {
      frameWidth: 20,
      frameHeight: 20,
    });
  }
  create() {
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNames("dude", { start: 6, end: 8 }),
      framerate: 8,
      repeat: -1,
    });
    this.anims.create({
      key: "rotate",
      frames: this.anims.generateFrameNames("coin", {
        start: 0,
        end: 7,
      }),
      frameRate: 15,
      yoyo: true,
      repeat: -1,
    });
    this.scene.start("Game");
  }
  update() {}
}
export default PreloadGame;
