import { Mesh, MeshStandardMaterial, Group } from 'three';
import { SkinKey } from '../types/skins';
import { getSkinDefinition } from '../skins/skinDefinitions';
import { createMaterial, updateMaterial } from '../skins/materialFactory';

export abstract class Dice {
  protected group: Group;
  protected mesh: Mesh | null = null;
  protected material: MeshStandardMaterial | null = null;
  protected currentSkin: SkinKey = 'bronze';
  protected isRolling: boolean = false;

  constructor() {
    this.group = new Group();
  }

  abstract createGeometry(): void;

  initialize(): void {
    this.createGeometry();
    this.applySkin(this.currentSkin);
  }

  applySkin(skinKey: SkinKey): void {
    const skinDefinition = getSkinDefinition(skinKey);
    
    if (!skinDefinition) {
      console.error(`Skin "${skinKey}" not found`);
      return;
    }

    if (!this.mesh) {
      console.error('Mesh not initialized');
      return;
    }

    if (this.material) {
      updateMaterial(this.material, skinDefinition.materials);
    } else {
      this.material = createMaterial(skinDefinition.materials);
      this.mesh.material = this.material;
    }

    this.currentSkin = skinKey;
  }

  setSkin(skinKey: SkinKey): void {
    if (skinKey === this.currentSkin) {
      return;
    }
    
    this.applySkin(skinKey);
  }

  getCurrentSkin(): SkinKey {
    return this.currentSkin;
  }

  getGroup(): Group {
    return this.group;
  }

  getMesh(): Mesh | null {
    return this.mesh;
  }

  roll(): void {
    this.isRolling = true;
  }

  stopRoll(): void {
    this.isRolling = false;
  }

  isCurrentlyRolling(): boolean {
    return this.isRolling;
  }

  update(deltaTime: number): void {
    if (this.isRolling && this.mesh) {
      this.mesh.rotation.x += deltaTime * 5;
      this.mesh.rotation.y += deltaTime * 3;
      this.mesh.rotation.z += deltaTime * 4;
    }
  }

  dispose(): void {
    if (this.material) {
      this.material.dispose();
    }

    if (this.mesh && this.mesh.geometry) {
      this.mesh.geometry.dispose();
    }

    this.group.clear();
  }
}
