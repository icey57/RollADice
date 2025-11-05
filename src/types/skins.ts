import { Color, Texture } from 'three';

export interface MaterialSettings {
  color: Color | string | number;
  metalness?: number;
  roughness?: number;
  emissive?: Color | string | number;
  emissiveIntensity?: number;
  normalMap?: Texture | null;
  normalScale?: { x: number; y: number };
  envMapIntensity?: number;
  opacity?: number;
  transparent?: boolean;
}

export interface SkinDefinition {
  name: string;
  description: string;
  materials: MaterialSettings;
}

export type SkinKey = 'bronze' | 'gemstone' | 'silver' | 'gold' | 'crystal' | 'obsidian' | 'jade';

export type SkinRegistry = Record<SkinKey, SkinDefinition>;
