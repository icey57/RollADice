import * as THREE from 'three';

export function createBox(
  width = 1,
  height = 1,
  depth = 1,
  color = 0x0f4c75
): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({ color });
  return new THREE.Mesh(geometry, material);
}

export function createLight(
  color = 0xffffff,
  intensity = 1
): THREE.DirectionalLight {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(5, 5, 5);
  return light;
}

export function createAmbientLight(
  color = 0xffffff,
  intensity = 0.5
): THREE.AmbientLight {
  return new THREE.AmbientLight(color, intensity);
}
