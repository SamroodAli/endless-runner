import Phaser from "phaser";
import platform from "../assets/ground_grass.png";
class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }
  preload() {
    this.load.image("platform", platform);
  }
  create() {
    this.add.image(200, 320, "platform").setScaleX(2).setScaleY(0.5);
  }
}
export default Game;
