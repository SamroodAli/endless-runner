import Phaser from "phaser";
import platform from "../assets/platform.png";
import dude from "../assets/dude.png";
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

    this.load.spritesheet();
  }
  create() {}
  update() {}
}
export default Preload;
