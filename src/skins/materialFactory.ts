import {
  MeshStandardMaterial,
  Color,
  TextureLoader,
  Texture,
  NormalMapTypes,
  TangentSpaceNormalMap,
  Vector2,
} from 'three';
import { MaterialSettings } from '../types/skins';

const textureLoader = new TextureLoader();
const textureCache = new Map<string, Texture>();

export function loadTexture(url: string): Promise<Texture> {
  if (textureCache.has(url)) {
    return Promise.resolve(textureCache.get(url)!);
  }

  return new Promise((resolve, reject) => {
    textureLoader.load(
      url,
      (texture) => {
        textureCache.set(url, texture);
        resolve(texture);
      },
      undefined,
      reject
    );
  });
}

export function loadTextureSync(url: string): Texture | null {
  if (textureCache.has(url)) {
    return textureCache.get(url)!;
  }

  console.warn(`Texture ${url} not preloaded. Use loadTexture() for async loading.`);
  return null;
}

export function createMaterial(settings: MaterialSettings): MeshStandardMaterial {
  const material = new MeshStandardMaterial();

  if (settings.color !== undefined) {
    material.color = settings.color instanceof Color ? settings.color : new Color(settings.color);
  }

  if (settings.metalness !== undefined) {
    material.metalness = settings.metalness;
  }

  if (settings.roughness !== undefined) {
    material.roughness = settings.roughness;
  }

  if (settings.emissive !== undefined) {
    material.emissive = settings.emissive instanceof Color ? settings.emissive : new Color(settings.emissive);
  }

  if (settings.emissiveIntensity !== undefined) {
    material.emissiveIntensity = settings.emissiveIntensity;
  }

  if (settings.normalMap !== undefined) {
    material.normalMap = settings.normalMap;
    material.normalMapType = TangentSpaceNormalMap;
  }

  if (settings.normalScale !== undefined) {
    material.normalScale = new Vector2(settings.normalScale.x, settings.normalScale.y);
  }

  if (settings.envMapIntensity !== undefined) {
    material.envMapIntensity = settings.envMapIntensity;
  }

  if (settings.transparent !== undefined) {
    material.transparent = settings.transparent;
  }

  if (settings.opacity !== undefined) {
    material.opacity = settings.opacity;
  }

  material.needsUpdate = true;

  return material;
}

export function updateMaterial(material: MeshStandardMaterial, settings: MaterialSettings): void {
  if (settings.color !== undefined) {
    material.color = settings.color instanceof Color ? settings.color.clone() : new Color(settings.color);
  }

  if (settings.metalness !== undefined) {
    material.metalness = settings.metalness;
  }

  if (settings.roughness !== undefined) {
    material.roughness = settings.roughness;
  }

  if (settings.emissive !== undefined) {
    material.emissive = settings.emissive instanceof Color ? settings.emissive.clone() : new Color(settings.emissive);
  }

  if (settings.emissiveIntensity !== undefined) {
    material.emissiveIntensity = settings.emissiveIntensity;
  }

  if (settings.normalMap !== undefined) {
    material.normalMap = settings.normalMap;
    material.normalMapType = TangentSpaceNormalMap;
  }

  if (settings.normalScale !== undefined) {
    material.normalScale.set(settings.normalScale.x, settings.normalScale.y);
  }

  if (settings.envMapIntensity !== undefined) {
    material.envMapIntensity = settings.envMapIntensity;
  }

  if (settings.transparent !== undefined) {
    material.transparent = settings.transparent;
  }

  if (settings.opacity !== undefined) {
    material.opacity = settings.opacity;
  }

  material.needsUpdate = true;
}

export function preloadTextures(urls: string[]): Promise<Texture[]> {
  return Promise.all(urls.map(url => loadTexture(url)));
}

export function clearTextureCache(): void {
  textureCache.forEach(texture => texture.dispose());
  textureCache.clear();
}
