import Phaser from "phaser";
import platform from "../assets/platform.png";
import dude from "./assets/dude.png";

class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }
  preload() {
    this.load.image("platform", platform);
    this.load.spritesheet("dude", dude, { frameWidth: 32, frameHeight: 48 });
  }
  create() {
    this.add.image(200, 320, "platform").setScaleX(2).setScaleY(0.5);
  }
}
export default Game;
