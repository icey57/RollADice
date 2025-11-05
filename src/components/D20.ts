import { IcosahedronGeometry, Mesh } from 'three';
import { Dice } from './Dice';

export class D20 extends Dice {
  private readonly radius: number;
  private readonly detail: number;

  constructor(radius: number = 1, detail: number = 0) {
    super();
    this.radius = radius;
    this.detail = detail;
  }

  createGeometry(): void {
    const geometry = new IcosahedronGeometry(this.radius, this.detail);
    this.mesh = new Mesh(geometry);
    this.group.add(this.mesh);
  }

  rollD20(): number {
    this.roll();
    return Math.floor(Math.random() * 20) + 1;
  }
}
