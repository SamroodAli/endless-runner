import Phaser from "phaser";
import platform from "../assets/ground_grass.png";
class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }
  preload() {
    this.load.image("platform", GroundGrass);
  }
  create() {}
}
export default Game;
