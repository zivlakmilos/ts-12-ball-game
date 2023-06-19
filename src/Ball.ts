import { Colors } from "./constants";

class Ball {
  private radius: number = 25;
  private num: number = 0;
  private ballRef: Phaser.GameObjects.Arc;
  private txtRef: Phaser.GameObjects.Text;

  private startX: number;
  private startY: number;

  constructor(private scene: Phaser.Scene, private weight: number) {
  }

  create(x: number, y: number, num: number, type: string = 'draggable'): void {
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

    if (type === 'draggable') {
      this.scene.input.setDraggable(this.ballRef);
    } else if (type === 'interactive') {
      this.ballRef.setInteractive();
    }
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

  getPos() {
    return new Phaser.Math.Vector2(this.ballRef.x, this.ballRef.y);
  }

  getNumber(): number {
    return this.num;
  }

  getWeight(): number {
    return this.weight;
  }

  getSize(): number {
    return this.radius;
  }

  setMouseOver(mouseOver: boolean): void {
    if (mouseOver) {
      this.ballRef.setFillStyle(Colors.b);
    } else {
      this.ballRef.setFillStyle(Colors.a);
    }
  }
}

export default Ball;
