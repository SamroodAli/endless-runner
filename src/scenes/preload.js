import Phaser from "phaser";
import platform from "../assets/platform.png";
import dude from "../assets/dude.png";
import coin from "../assets/coin.png";
import gold1 from "../assets/gold_1.png";
import gold2 from "../assets/gold_2.png";
import gold3 from "../assets/gold_3.png";
import gold4 from "../assets/gold_4.png";

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
    this.load.spritesheet("gold1", gold1, {
      frameWidth: 100,
      frameHeight: 20,
    });
    this.load.spritesheet("gold2", gold2, {
      frameWidth: 100,
      frameHeight: 20,
    });
    this.load.spritesheet("gold3", gold3, {
      frameWidth: 100,
      frameHeight: 20,
    });
    this.load.spritesheet("gold4", gold4, {
      frameWidth: 100,
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
      frames: [
        { key: "gold1" },
        { key: "gold2" },
        { key: "gold3" },
        { key: "gold4" },
      ],
      frameRate: 8,
      yoyo: true,
      repeat: -1,
    });
    this.scene.start("Game");
  }
  update() {}
}
export default PreloadGame;
