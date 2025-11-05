# Dice Skins System

A comprehensive dice skins system with dynamic material switching for 3D dice. This system supports d20 and d100 dice with customizable material properties including metalness, roughness, emissive properties, and texture support. Now includes a full-featured, accessible UI controls system for managing dice configuration.

## Features

- **Multiple Skin Presets**: Bronze, Gemstone, Silver, Gold, Crystal, Obsidian, and Jade
- **Dynamic Skin Switching**: Update dice appearance in real-time without rerender glitches
- **Extensible Material System**: Support for normal maps, emissive properties, and custom textures
- **UI Controls System**: Responsive, accessible controls for ruleset, roll count, target value, animation, and skin selection
- **State Management**: Observable store pattern with real-time validation
- **Type-Safe**: Built with TypeScript for robust type checking
- **Performance Optimized**: Texture caching and efficient material updates
- **Accessibility Compliant**: WCAG 2.1 AA with dark mode, high contrast, and keyboard navigation

## Installation

```bash
npm install
npm run build
```

## Quick Start

### Basic Dice Usage

```typescript
import { D20, D100, getSkinDefinition } from './src/index';

// Create a d20 dice
const d20 = new D20(1, 0);
d20.initialize();

// Create a d100 dice
const d100 = new D100(1, 32, 32);
d100.initialize();

// Apply skins
d20.setSkin('bronze');
d100.setSkin('gemstone');

// Switch skins dynamically
d20.setSkin('crystal');
d100.setSkin('gold');

// Roll the dice
const d20Result = d20.rollD20(); // Returns 1-20
const d100Result = d100.rollD100(); // Returns 1-100

// Update animation (call in your render loop)
d20.update(deltaTime);
d100.update(deltaTime);
```

### UI Controls Quick Start

```typescript
import { ConfigStore, Controls } from './src/index';

// Create a configuration store
const store = new ConfigStore({
  ruleset: 'DND',
  rollCount: 1,
  diceSkin: 'bronze',
});

// Create and render controls
const controls = new Controls({
  container: document.getElementById('controls')!,
  store: store,
});
controls.render();

// Subscribe to configuration changes
store.subscribe((config) => {
  console.log('Config updated:', config);
  // Update your dice based on config
});
```

For a complete working example, see `demo.html` or `controls-example.ts`.

For full controls documentation, see [CONTROLS_README.md](./CONTROLS_README.md).

## Available Skins

| Skin Key    | Description                                      | Characteristics                    |
|-------------|--------------------------------------------------|------------------------------------|
| `bronze`    | Classic bronze finish with warm metallic tones   | High metalness, warm color         |
| `gemstone`  | Sparkling gemstone with high reflectivity        | Transparent, bright reflections    |
| `silver`    | Polished silver with high reflectivity           | Very high metalness, cool tone     |
| `gold`      | Luxurious gold finish                            | High metalness, warm gold color    |
| `crystal`   | Transparent crystal with rainbow reflections     | Highly transparent, maximum envMap |
| `obsidian`  | Dark volcanic glass with subtle reflections      | Dark, moderate reflectivity        |
| `jade`      | Smooth jade stone with organic feel              | Green, lower reflectivity          |

## Adding New Skins

### Step 1: Define Your Skin

Open `src/skins/skinDefinitions.ts` and add your new skin to the `skinDefinitions` object:

```typescript
export const skinDefinitions: SkinRegistry = {
  // ... existing skins ...
  
  ruby: {
    name: 'Ruby',
    description: 'Deep red ruby with inner glow',
    materials: {
      color: new Color(0xe0115f),
      metalness: 0.1,
      roughness: 0.2,
      emissive: new Color(0x660000),
      emissiveIntensity: 0.4,
      envMapIntensity: 1.3,
      transparent: true,
      opacity: 0.9,
    },
  },
};
```

### Step 2: Add Type Definition

Update the `SkinKey` type in `src/types/skins.ts` to include your new skin:

```typescript
export type SkinKey = 'bronze' | 'gemstone' | 'silver' | 'gold' | 'crystal' | 'obsidian' | 'jade' | 'ruby';
```

### Step 3: Use Your New Skin

```typescript
dice.setSkin('ruby');
```

## Material Properties Reference

The `MaterialSettings` interface supports the following properties:

### Basic Properties

- **`color`**: Base color of the material (Color, string, or number)
  - Example: `new Color(0xff0000)`, `'#ff0000'`, `0xff0000`

- **`metalness`**: How metallic the material appears (0-1)
  - `0`: Non-metallic (wood, stone, plastic)
  - `1`: Fully metallic (gold, silver, chrome)

- **`roughness`**: Surface roughness (0-1)
  - `0`: Mirror-smooth, sharp reflections
  - `1`: Very rough, diffuse reflections

### Advanced Properties

- **`emissive`**: Color that the material emits (Color, string, or number)
  - Makes the material appear to glow
  - Example: `new Color(0x330033)`

- **`emissiveIntensity`**: Strength of the emissive glow (0-∞)
  - `0`: No emission
  - Higher values create stronger glow

- **`normalMap`**: Texture for surface detail (Texture or null)
  - Adds bumps and surface detail without geometry
  - Load using `loadTexture()` from materialFactory

- **`normalScale`**: Strength of the normal map effect
  - Example: `{ x: 1.0, y: 1.0 }`

- **`envMapIntensity`**: Strength of environment reflections (0-∞)
  - Controls how much the environment is reflected

- **`transparent`**: Enable transparency (boolean)
  - Must be `true` to use opacity values < 1

- **`opacity`**: Material opacity (0-1)
  - `0`: Fully transparent
  - `1`: Fully opaque
  - Requires `transparent: true`

## Working with Textures

The material factory includes utilities for loading and managing textures:

### Async Texture Loading

```typescript
import { loadTexture, createMaterial } from './src/skins/materialFactory';

const normalMap = await loadTexture('/textures/dice-normal.png');

const customMaterial = createMaterial({
  color: 0xffffff,
  normalMap: normalMap,
  normalScale: { x: 1.0, y: 1.0 },
  metalness: 0.5,
  roughness: 0.3,
});
```

### Preloading Multiple Textures

```typescript
import { preloadTextures } from './src/skins/materialFactory';

await preloadTextures([
  '/textures/dice-normal.png',
  '/textures/dice-roughness.png',
  '/textures/dice-metalness.png',
]);
```

### Synchronous Texture Access

```typescript
import { loadTextureSync } from './src/skins/materialFactory';

// Only use after textures have been preloaded
const texture = loadTextureSync('/textures/dice-normal.png');
```

## API Reference

### Dice Class (Base)

#### Methods

- **`initialize()`**: Initialize the dice geometry and apply default skin
- **`applySkin(skinKey: SkinKey)`**: Apply a skin to the dice
- **`setSkin(skinKey: SkinKey)`**: Change the current skin (skips if already applied)
- **`getCurrentSkin()`**: Get the currently applied skin key
- **`getGroup()`**: Get the Three.js Group containing the dice
- **`getMesh()`**: Get the dice Mesh object
- **`roll()`**: Start the rolling animation
- **`stopRoll()`**: Stop the rolling animation
- **`isCurrentlyRolling()`**: Check if dice is currently rolling
- **`update(deltaTime: number)`**: Update animation (call in render loop)
- **`dispose()`**: Clean up resources

### D20 Class

Extends `Dice` class with d20-specific functionality.

#### Constructor

```typescript
new D20(radius?: number, detail?: number)
```

- `radius`: Dice size (default: 1)
- `detail`: Geometry detail level (default: 0)

#### Methods

- **`rollD20()`**: Roll the d20 and return result (1-20)

### D100 Class

Extends `Dice` class with d100-specific functionality.

#### Constructor

```typescript
new D100(radius?: number, widthSegments?: number, heightSegments?: number)
```

- `radius`: Dice size (default: 1)
- `widthSegments`: Horizontal segments (default: 32)
- `heightSegments`: Vertical segments (default: 32)

#### Methods

- **`rollD100()`**: Roll the d100 and return result (1-100)

## Material Factory Functions

### `createMaterial(settings: MaterialSettings)`

Creates a new Three.js MeshStandardMaterial with the specified settings.

### `updateMaterial(material: MeshStandardMaterial, settings: MaterialSettings)`

Updates an existing material with new settings without causing render glitches.

### `loadTexture(url: string): Promise<Texture>`

Asynchronously loads a texture and caches it for future use.

### `loadTextureSync(url: string): Texture | null`

Synchronously retrieves a cached texture (returns null if not loaded).

### `preloadTextures(urls: string[]): Promise<Texture[]>`

Preloads multiple textures asynchronously.

### `clearTextureCache()`

Clears the texture cache and disposes of all cached textures.

## Example: Full Integration

```typescript
import { D20, D100 } from './src/index';
import { Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight, AmbientLight } from 'three';

// Setup scene
const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create dice
const d20 = new D20(1, 0);
d20.initialize();
d20.setSkin('bronze');
scene.add(d20.getGroup());

const d100 = new D100(1, 32, 32);
d100.initialize();
d100.setSkin('gemstone');
d100.getGroup().position.x = 3;
scene.add(d100.getGroup());

// Position camera
camera.position.z = 5;

// Animation loop
let lastTime = 0;
function animate(time: number) {
  requestAnimationFrame(animate);
  
  const deltaTime = (time - lastTime) / 1000;
  lastTime = time;
  
  d20.update(deltaTime);
  d100.update(deltaTime);
  
  renderer.render(scene, camera);
}

animate(0);

// Switch skins dynamically
document.addEventListener('keypress', (e) => {
  if (e.key === '1') d20.setSkin('bronze');
  if (e.key === '2') d20.setSkin('silver');
  if (e.key === '3') d20.setSkin('gold');
  if (e.key === '4') d20.setSkin('crystal');
  
  if (e.key === 'q') d100.setSkin('gemstone');
  if (e.key === 'w') d100.setSkin('obsidian');
  if (e.key === 'e') d100.setSkin('jade');
});

// Roll dice
document.addEventListener('click', () => {
  const d20Result = d20.rollD20();
  const d100Result = d100.rollD100();
  console.log(`D20: ${d20Result}, D100: ${d100Result}`);
});
```

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode (auto-rebuild on changes)
npm run dev
```

## Architecture

```
src/
├── types/
│   └── skins.ts              # Type definitions for skins and materials
├── skins/
│   ├── skinDefinitions.ts    # Skin presets and registry
│   └── materialFactory.ts    # Material creation and management utilities
├── components/
│   ├── Dice.ts               # Base dice class
│   ├── D20.ts                # D20 implementation
│   └── D100.ts               # D100 implementation
├── store/
│   └── ConfigStore.ts        # State management with validation
├── ui/
│   ├── Controls.ts           # UI controls component
│   └── styles.css            # Responsive, accessible styles
└── index.ts                  # Public API exports
```

## Best Practices

1. **Always initialize dice**: Call `initialize()` before using any dice instance
2. **Use setSkin() for updates**: This method optimizes by skipping redundant skin applications
3. **Call update() in render loop**: Required for smooth rolling animations
4. **Preload textures**: Use `preloadTextures()` before creating materials that need them
5. **Dispose resources**: Call `dispose()` on dice objects when no longer needed
6. **Clone colors**: When reusing Color objects across multiple skins, clone them to avoid unintended mutations

## Troubleshooting

### Skin doesn't update

Make sure you called `initialize()` on the dice object before applying skins.

### Textures not loading

Use the async `loadTexture()` function and await the result before creating materials.

### Performance issues

- Use lower detail levels for D20 (0-1 is usually sufficient)
- Reduce segments for D100 (16-32 is usually adequate)
- Call `clearTextureCache()` when switching between different texture sets

### Transparency not working

Make sure both `transparent: true` and an `opacity` value less than 1 are set in your material settings.

## License

MIT
