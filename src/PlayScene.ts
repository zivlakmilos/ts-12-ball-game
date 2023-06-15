import Phaser from "phaser";
import { WIDTH, HEIGHT, Colors } from "./constants";
import { shuffle } from "./utils";

class Ball {
  private radius: number = 25;
  private num: number = 0;

  constructor(private weight: number) {
  }

  create(scene: Phaser.Scene, x: number, y: number, num: number) {
    this.num = num;
    scene.add.circle(x, y, this.radius, Colors.a);
    scene.add.text(x, y, `${this.num}`, { color: Colors.toString(Colors.white), fontSize: 14, fontStyle: 'bold' }).setOrigin(0.5);
    console.log(Colors.white);
    console.log(Colors.toString(Colors.white));
  }
}

class PlayScene extends Phaser.Scene {
  private line: Phaser.GameObjects.Line;
  private balls: Ball[] = [];

  constructor() {
    super('PlayScene');
  }

  preload(): void {
  }

  create(): void {
    this.createScale();
    this.createBalls();
  }

  createScale(): void {
    const screenCenter = [WIDTH / 2, HEIGHT / 2];
    const size = 15;

    this.add.triangle(
      screenCenter[0], screenCenter[1],
      0, 0,
      -size, 2 * size,
      size, 2 * size,
      Colors.b,
    ).setOrigin(0.5, 0);

    this.line = this.add.line(
      screenCenter[0], screenCenter[1],
      -size, 0,
      size * 40, 0,
      Colors.b,
    );
  }

  createBalls(): void {
    this.balls.push(new Ball(Math.random() - 0.5));
    for (let i = 0; i < 11; i++) {
      this.balls.push(new Ball(0));
    }
    shuffle(this.balls);

    const startX = (WIDTH / 2) - 55 * 13 / 2;
    this.balls.forEach((ball, idx) => {
      const x = startX + 55 * (idx + 1);
      const y = 55;
      ball.create(this, x, y, idx + 1);
    });
  }

  update(time: number, delta: number): void {
  }
}

export default PlayScene;
