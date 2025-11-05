import { Color } from 'three';
import { SkinRegistry } from '../types/skins';

export const skinDefinitions: SkinRegistry = {
  bronze: {
    name: 'Bronze',
    description: 'Classic bronze finish with warm metallic tones',
    materials: {
      color: new Color(0xcd7f32),
      metalness: 0.8,
      roughness: 0.3,
      emissive: new Color(0x331100),
      emissiveIntensity: 0.1,
      envMapIntensity: 1.0,
    },
  },
  gemstone: {
    name: 'Gemstone',
    description: 'Sparkling gemstone appearance with high reflectivity',
    materials: {
      color: new Color(0x4169e1),
      metalness: 0.1,
      roughness: 0.1,
      emissive: new Color(0x001133),
      emissiveIntensity: 0.2,
      envMapIntensity: 1.5,
      transparent: true,
      opacity: 0.95,
    },
  },
  silver: {
    name: 'Silver',
    description: 'Polished silver with high reflectivity',
    materials: {
      color: new Color(0xc0c0c0),
      metalness: 0.95,
      roughness: 0.1,
      emissive: new Color(0x000000),
      emissiveIntensity: 0.0,
      envMapIntensity: 1.2,
    },
  },
  gold: {
    name: 'Gold',
    description: 'Luxurious gold finish',
    materials: {
      color: new Color(0xffd700),
      metalness: 0.9,
      roughness: 0.2,
      emissive: new Color(0x332200),
      emissiveIntensity: 0.15,
      envMapIntensity: 1.0,
    },
  },
  crystal: {
    name: 'Crystal',
    description: 'Transparent crystal with rainbow reflections',
    materials: {
      color: new Color(0xffffff),
      metalness: 0.0,
      roughness: 0.05,
      emissive: new Color(0x111122),
      emissiveIntensity: 0.3,
      envMapIntensity: 2.0,
      transparent: true,
      opacity: 0.85,
    },
  },
  obsidian: {
    name: 'Obsidian',
    description: 'Dark volcanic glass with subtle reflections',
    materials: {
      color: new Color(0x1a1a1a),
      metalness: 0.3,
      roughness: 0.15,
      emissive: new Color(0x330033),
      emissiveIntensity: 0.1,
      envMapIntensity: 0.8,
    },
  },
  jade: {
    name: 'Jade',
    description: 'Smooth jade stone with organic feel',
    materials: {
      color: new Color(0x00a86b),
      metalness: 0.2,
      roughness: 0.4,
      emissive: new Color(0x001100),
      emissiveIntensity: 0.05,
      envMapIntensity: 0.6,
    },
  },
};

export function getSkinDefinition(skinKey: keyof typeof skinDefinitions) {
  return skinDefinitions[skinKey];
}

export function getAllSkinKeys(): string[] {
  return Object.keys(skinDefinitions);
}
