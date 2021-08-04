import Phaser from "phaser";
import platform from "../assets/platform.png";
import dude from "../assets/dude.png";

class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }
  preload() {
    this.load.image("platform", platform);
    this.load.spritesheet("dude", dude, { frameWidth: 32, frameHeight: 48 });
  }
  create() {
    // this.platform = this.physics.add.staticImage(200, 320, "platform");
    // this.player = this.physics.add.sprite(100, 0, "dude");
    // this.physics.add.collider(this.player, this.platform);
    this.platformGroup = this.add.group({
      removeCallback: (platform) => this.platformPool.add(platform),
    });
    this.platformpool = this.add.group({
      removeCallback: (platform) => this.platformGroup.add(platform),
    });
  }
}
export default Game;
