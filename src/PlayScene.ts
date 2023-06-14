import Phaser from "phaser";

class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  preload(): void {
  }

  create(): void {
    this.add.rectangle(100, 100, 50, 50, 0xff0000);
  }

  update(time: number, delta: number): void {
  }
}

export default PlayScene;
