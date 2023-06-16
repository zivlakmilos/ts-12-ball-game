import Phaser from "phaser";
import { WIDTH, HEIGHT, Colors } from "./constants";
import { shuffle } from "./utils";

class Ball {
  private radius: number = 25;
  private num: number = 0;
  private ballRef: Phaser.GameObjects.Arc;
  private txtRef: Phaser.GameObjects.Text;

  private startX: number;
  private startY: number;

  constructor(private scene: Phaser.Scene, private weight: number) {
  }

  create(x: number, y: number, num: number): void {
    this.startX = x;
    this.startY = y;

    this.num = num;

    this.ballRef = this.scene.add.circle(x, y, this.radius, Colors.a)
      .setInteractive()
      .setData('ball', this);

    this.txtRef = this.scene.add.text(x, y, `${this.num}`, {
      color: Colors.toString(Colors.white),
      fontSize: 14,
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.scene.input.setDraggable(this.ballRef);
  }

  updatePos(x: number, y: number): void {
    this.ballRef.x = x;
    this.ballRef.y = y;
    this.txtRef.x = x;
    this.txtRef.y = y;
  }

  resetPos(): void {
    this.updatePos(this.startX, this.startY);
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
    this.createEventHandlers();
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
    this.balls.push(new Ball(this, Math.random() - 0.5));
    for (let i = 0; i < 11; i++) {
      this.balls.push(new Ball(this, 0));
    }
    shuffle(this.balls);

    const startX = (WIDTH / 2) - 55 * 13 / 2;
    this.balls.forEach((ball, idx) => {
      const x = startX + 55 * (idx + 1);
      const y = 55;
      ball.create(x, y, idx + 1);
    });
  }

  createEventHandlers(): void {
    this.input.on('drag', (pointer: any, obj: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
      const ball = obj.getData('ball') as Ball | undefined;
      if (ball) {
        ball.updatePos(dragX, dragY);
      }
    }, this);

    this.input.on('dragend', (pointer: any, obj: Phaser.GameObjects.GameObject, dragX: number, dragY: number) => {
      const ball = obj.getData('ball') as Ball | undefined;
      if (ball) {
        ball.resetPos();
      }
    }, this);
  }

  update(time: number, delta: number): void {
  }
}

export default PlayScene;
