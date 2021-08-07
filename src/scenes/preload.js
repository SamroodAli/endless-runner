import Phaser from "phaser";
import platform from "../assets/platform.png";
import dude from "../assets/dude.png";
import coin from "../assets/coin.png";
import { gameOptions, gameConfig } from "../gameOptions.js";

class PreloadGame extends Phaser.Scene {
  platformPool;
  constructor() {
    super("preloadGame");
  }
  preload() {
    this.load.image("platform", platform);

    this.load.spritesheet("dude", dude, {
      frameWidth: 24,
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
      frames: this.anims.generateFrameNames("dude", { start: 6, end: 9 }),
      framerate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "rotate",
      frames: this.anims.generateFrameName("coin", {
        start: 0,
        end: 7,
      }),
      frameRate: 15,
      yoyo: true,
      repeat: -1,
    });
    this.scenes.start("game");
  }
  update() {}
}
export default Preload;
