# Dice Controls UI System

A comprehensive, accessible, and responsive UI controls system for managing dice rolling configuration.

## Features

- **Responsive Design**: Adapts seamlessly from desktop to mobile (320px+)
- **Accessible**: WCAG 2.1 AA compliant with ARIA labels, keyboard navigation, and screen reader support
- **Real-time State Management**: Observable store pattern for instant updates
- **Input Validation**: Prevents invalid data with helpful error messages
- **Dark Mode Support**: Automatically adapts to user's color scheme preference
- **High Contrast Mode**: Enhanced visibility for users with visual impairments
- **Reduced Motion Support**: Respects prefers-reduced-motion for accessibility

## Installation

The controls system is already included in the package. Import from the main entry point:

```typescript
import { ConfigStore, Controls } from './src/index';
```

## Quick Start

### Basic Setup

```typescript
import { ConfigStore, Controls } from './src/index';

// Create a configuration store
const store = new ConfigStore({
  ruleset: 'DND',
  rollCount: 1,
  targetValue: null,
  skipAnimation: false,
  diceSkin: 'bronze',
});

// Create and render controls
const controls = new Controls({
  container: document.getElementById('controls-container')!,
  store: store,
});

controls.render();

// Subscribe to configuration changes
store.subscribe((config) => {
  console.log('Configuration updated:', config);
  // Update your dice rendering, etc.
});
```

### HTML Setup

Include the CSS file in your HTML:

```html
<link rel="stylesheet" href="src/ui/styles.css">
<div id="controls-container"></div>
```

## ConfigStore API

### Constructor

```typescript
new ConfigStore(initialConfig?: Partial<DiceConfig>)
```

Creates a new configuration store with optional initial values.

### Configuration Interface

```typescript
interface DiceConfig {
  ruleset: 'COC' | 'DND';        // Call of Cthulhu or Dungeons & Dragons
  rollCount: number;              // Positive integer (minimum: 1)
  targetValue: number | null;     // Optional target value for success checks
  skipAnimation: boolean;         // Whether to skip roll animations
  diceSkin: SkinKey;             // Selected dice skin
}
```

### Methods

#### `getConfig(): Readonly<DiceConfig>`
Returns the current configuration as a read-only object.

```typescript
const config = store.getConfig();
console.log(config.ruleset); // 'DND'
```

#### `setRuleset(ruleset: 'COC' | 'DND'): void`
Updates the game ruleset.

```typescript
store.setRuleset('COC');
```

#### `setRollCount(count: number): void`
Updates the number of dice to roll. Must be a positive integer.

```typescript
store.setRollCount(3);
// Throws error if count < 1 or not an integer
```

#### `setTargetValue(value: number | null): void`
Sets the target value for success checks. Use `null` to disable.

```typescript
store.setTargetValue(15);  // Set target to 15
store.setTargetValue(null); // Disable target checking
```

#### `setSkipAnimation(skip: boolean): void`
Toggles animation skipping.

```typescript
store.setSkipAnimation(true);
```

#### `setDiceSkin(skin: SkinKey): void`
Changes the dice skin.

```typescript
store.setDiceSkin('gemstone');
```

#### `updateConfig(updates: Partial<DiceConfig>): void`
Updates multiple configuration values at once.

```typescript
store.updateConfig({
  ruleset: 'DND',
  rollCount: 2,
  diceSkin: 'gold',
});
```

#### `subscribe(listener: (config: DiceConfig) => void): () => void`
Subscribes to configuration changes. Returns an unsubscribe function.

```typescript
const unsubscribe = store.subscribe((config) => {
  console.log('Config changed:', config);
});

// Later, when done:
unsubscribe();
```

## Controls API

### Constructor

```typescript
new Controls(options: ControlsOptions)

interface ControlsOptions {
  container: HTMLElement;  // Parent element for the controls
  store: ConfigStore;      // Configuration store instance
  className?: string;      // Optional additional CSS class
}
```

### Methods

#### `render(): void`
Renders the controls into the container element.

```typescript
controls.render();
```

#### `destroy(): void`
Removes the controls from the DOM and cleans up event listeners.

```typescript
controls.destroy();
```

#### `getElement(): HTMLElement | null`
Returns the root controls element, or null if not rendered.

```typescript
const element = controls.getElement();
```

## Complete Integration Example

```typescript
import { 
  ConfigStore, 
  Controls, 
  D20, 
  D100 
} from './src/index';
import { 
  Scene, 
  PerspectiveCamera, 
  WebGLRenderer 
} from 'three';

// Initialize Three.js scene
const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight);
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create dice
const d20 = new D20();
d20.initialize();
scene.add(d20.getGroup());

const d100 = new D100();
d100.initialize();
d100.getGroup().position.x = 3;
scene.add(d100.getGroup());

// Create configuration store
const store = new ConfigStore({
  ruleset: 'DND',
  rollCount: 1,
  skipAnimation: false,
  diceSkin: 'bronze',
});

// Create controls
const controls = new Controls({
  container: document.getElementById('controls')!,
  store: store,
});

controls.render();

// React to configuration changes
store.subscribe((config) => {
  // Update dice skins
  d20.setSkin(config.diceSkin);
  d100.setSkin(config.diceSkin);

  // Handle animation preference
  if (config.skipAnimation) {
    d20.stopRoll();
    d100.stopRoll();
  }
});

// Roll dice based on configuration
function rollDice() {
  const config = store.getConfig();
  const dice = config.ruleset === 'DND' ? d20 : d100;
  const results = [];

  for (let i = 0; i < config.rollCount; i++) {
    const result = config.ruleset === 'DND' 
      ? d20.rollD20() 
      : d100.rollD100();
    results.push(result);
  }

  if (!config.skipAnimation) {
    dice.roll();
  }

  // Check against target value if set
  if (config.targetValue !== null) {
    const successes = results.filter(r => r >= config.targetValue!).length;
    console.log(`${successes}/${results.length} succeeded (>= ${config.targetValue})`);
  }

  return results;
}

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

// Cleanup when done
window.addEventListener('beforeunload', () => {
  controls.destroy();
  d20.dispose();
  d100.dispose();
});
```

## Validation

The controls system includes comprehensive input validation:

### Roll Count
- **Required**: Must not be empty
- **Type**: Must be an integer
- **Range**: Must be >= 1
- **Error Messages**: Displayed in real-time below the input

### Target Value
- **Optional**: Can be left empty (null)
- **Type**: Must be a number when provided
- **Range**: Must be >= 0
- **Behavior**: Automatically clears validation when emptied

### All Inputs
- **Real-time**: Validation occurs as user types
- **Visual Feedback**: Invalid inputs show red border
- **Accessibility**: Error messages announced to screen readers
- **Graceful Degradation**: Defaults restored on blur if invalid

## Responsive Breakpoints

The controls adapt to different screen sizes:

| Breakpoint | Width | Adjustments |
|------------|-------|-------------|
| Desktop | > 768px | Full padding, larger fonts |
| Tablet | 481-768px | Reduced padding, slightly smaller fonts |
| Mobile | ≤ 480px | Minimal padding, compact layout, stacked labels |

## Accessibility Features

### Keyboard Navigation
- **Tab**: Move between controls
- **Space/Enter**: Toggle checkboxes and activate buttons
- **Arrow Keys**: Navigate select dropdowns
- **Escape**: Close dropdowns

### Screen Reader Support
- Proper ARIA labels on all inputs
- Required field indicators
- Error messages announced via `role="alert"`
- Help text associated with `aria-describedby`
- Form role with descriptive label

### Visual Accessibility
- High contrast mode support with increased border widths
- Dark mode with adjusted colors and contrast
- Focus indicators with 2px outline
- Minimum touch target size: 44x44px (WCAG 2.1 AA)
- Color is not the only means of conveying information

## Styling Customization

The controls use CSS custom properties for easy theming:

```css
.dice-controls {
  /* Override these in your own CSS */
  --controls-bg: #ffffff;
  --controls-text: #333;
  --controls-border: #e5e7eb;
  --controls-focus: #3b82f6;
  --controls-error: #dc2626;
}
```

### Custom Class

Add a custom class for specific styling:

```typescript
const controls = new Controls({
  container: element,
  store: store,
  className: 'my-custom-controls',
});
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+
- Chrome Android 90+

## Demo

Open `demo.html` in a browser to see the controls in action. The demo includes:

- Live configuration display
- Real-time state updates
- Responsive layout demonstration
- All control types in action

## Best Practices

1. **Always render before use**: Call `controls.render()` before interacting
2. **Subscribe early**: Set up store subscriptions before rendering controls
3. **Handle errors**: Wrap store setters in try-catch blocks
4. **Clean up**: Call `controls.destroy()` when removing from DOM
5. **Validate externally**: While controls validate UI input, validate programmatic updates
6. **Respect user preferences**: The controls automatically respect system-level accessibility settings

## Testing

To test the validation:

```typescript
// Valid inputs
store.setRollCount(1);     // ✓ Minimum value
store.setRollCount(100);   // ✓ Large value
store.setTargetValue(null); // ✓ Optional cleared

// Invalid inputs (throw errors)
try {
  store.setRollCount(0);     // ✗ Too small
  store.setRollCount(-5);    // ✗ Negative
  store.setRollCount(1.5);   // ✗ Not an integer
  store.setTargetValue(-1);  // ✗ Negative target
} catch (error) {
  console.error(error.message);
}
```

## Troubleshooting

### Controls don't appear
- Ensure the container element exists in the DOM
- Check that `controls.render()` has been called
- Verify the CSS file is loaded

### Validation not working
- Check browser console for JavaScript errors
- Ensure the store is properly initialized
- Verify input types match expectations (number vs string)

### State not updating
- Make sure you've subscribed to the store
- Check that store methods are being called (not direct property assignment)
- Verify the values are actually changing (same values won't trigger updates)

### Styling issues on mobile
- Ensure viewport meta tag is present: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Check that CSS file is loaded correctly
- Test in real device, not just browser dev tools

## License

MIT
