import Phaser from "phaser";
import PlayScene from "./PlayScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: 0x5691f0,
  physics: {
  },
  scene: [PlayScene]
};

new Phaser.Game(config);
