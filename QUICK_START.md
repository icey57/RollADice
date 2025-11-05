# Quick Start Guide

## Installation

```bash
npm install
npm run build
```

## Basic Usage

```typescript
import { D20, D100 } from './dist/index';

// Create and initialize dice
const d20 = new D20(1, 0);
d20.initialize();

const d100 = new D100(1, 32, 32);
d100.initialize();

// Apply skins
d20.setSkin('bronze');
d100.setSkin('gemstone');

// Roll dice
const result20 = d20.rollD20();   // 1-20
const result100 = d100.rollD100(); // 1-100

// Switch skins (even during rolls!)
d20.setSkin('crystal');
d100.setSkin('gold');

// Update in your render loop
function animate(deltaTime) {
  d20.update(deltaTime);
  d100.update(deltaTime);
}
```

## Available Skins

- `bronze` - Warm metallic finish
- `gemstone` - Sparkling blue gem
- `silver` - Polished silver
- `gold` - Luxurious gold
- `crystal` - Transparent crystal
- `obsidian` - Dark volcanic glass
- `jade` - Smooth green stone

## Testing

```bash
# Run comprehensive tests
npm run build && node dist/test.js

# Run rolling skin tests
npm run build && node dist/rollingSkinTest.js
```

## Adding New Skins

See [README.md](README.md#adding-new-skins) for detailed instructions.

Quick steps:
1. Add skin to `src/skins/skinDefinitions.ts`
2. Update `SkinKey` type in `src/types/skins.ts`
3. Use it: `dice.setSkin('yourSkin')`
