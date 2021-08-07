import Phaser from "phaser";
import platform from "../assets/platform.png";
import dude from "../assets/dude.png";
import { gameOptions, gameConfig } from "../gameOptions.js";

class PreloadGame extends Phaser.Scene {
  platformPool;
  constructor() {
    super("preloadGame");
  }
  preload() {}
  create() {
  }
  update() {}
}
export default Preload;
