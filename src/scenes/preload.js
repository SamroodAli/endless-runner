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
  create() {}
  update() {}
}
export default Preload;
