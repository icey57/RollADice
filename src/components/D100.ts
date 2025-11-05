import { SphereGeometry, Mesh, Group } from 'three';
import { Dice } from './Dice';

export class D100 extends Dice {
  private readonly radius: number;
  private readonly widthSegments: number;
  private readonly heightSegments: number;

  constructor(radius: number = 1, widthSegments: number = 32, heightSegments: number = 32) {
    super();
    this.radius = radius;
    this.widthSegments = widthSegments;
    this.heightSegments = heightSegments;
  }

  createGeometry(): void {
    const geometry = new SphereGeometry(this.radius, this.widthSegments, this.heightSegments);
    this.mesh = new Mesh(geometry);
    this.group.add(this.mesh);
  }

  rollD100(): number {
    this.roll();
    return Math.floor(Math.random() * 100) + 1;
  }
}
