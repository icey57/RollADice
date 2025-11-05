import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  AmbientLight,
  Clock,
} from 'three';
import { D20, D100, getAllSkinKeys, SkinKey } from './src/index';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const d20 = new D20(1, 0);
d20.initialize();
d20.setSkin('bronze');
d20.getGroup().position.x = -2;
scene.add(d20.getGroup());

const d100 = new D100(1, 32, 32);
d100.initialize();
d100.setSkin('gemstone');
d100.getGroup().position.x = 2;
scene.add(d100.getGroup());

camera.position.z = 5;

const clock = new Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const deltaTime = clock.getDelta();
  
  d20.update(deltaTime);
  d100.update(deltaTime);
  
  renderer.render(scene, camera);
}

animate();

const skins = getAllSkinKeys();
let currentSkinIndex = 0;

document.addEventListener('keypress', (e) => {
  if (e.key === ' ') {
    currentSkinIndex = (currentSkinIndex + 1) % skins.length;
    const skinKey = skins[currentSkinIndex] as SkinKey;
    console.log(`Switching to skin: ${skinKey}`);
    d20.setSkin(skinKey);
    d100.setSkin(skinKey);
  }
  
  if (e.key === 'r') {
    const d20Result = d20.rollD20();
    const d100Result = d100.rollD100();
    console.log(`D20 rolled: ${d20Result}`);
    console.log(`D100 rolled: ${d100Result}`);
  }
  
  if (e.key === 's') {
    d20.stopRoll();
    d100.stopRoll();
  }
});

console.log('Controls:');
console.log('- Press SPACE to cycle through skins');
console.log('- Press R to roll both dice');
console.log('- Press S to stop rolling');
console.log(`Available skins: ${skins.join(', ')}`);
