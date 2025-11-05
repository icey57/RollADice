# 3D Dice Roller

## Overview
This application features a fully functional 3D dice roller with realistic physics simulation using @react-three/fiber and cannon-es.

## Features

### Supported Dice Types
- **D20**: 20-sided icosahedron die (commonly used in tabletop RPGs)
- **D100**: 100-sided spherical die

### Roll Options
- **Number of Dice**: Roll 1-5 dice simultaneously
- **Skip Animation**: Toggle to get instant results without physics simulation
- **Physics Simulation**: Realistic rolling with gravity, friction, and collision detection

## Implementation Details

### DiceCanvas Component
The `DiceCanvas` component is the core of the dice rolling system:

- **Physics World**: Uses cannon-es for physics simulation with:
  - Gravity: -30 m/s²
  - Friction: 0.3
  - Restitution (bounciness): 0.4
  - Arena boundaries to keep dice in view

- **Dice Geometry**:
  - D20: Icosahedron with 20 triangular faces
  - D100: Sphere with 100 evenly distributed face points

- **Roll Mechanics**:
  - Randomized impulse forces for realistic rolling
  - Torque application for spinning
  - Settling detection (velocity < 0.1)
  - Face value resolution using normal vectors

### Animation Skip Mode
When "Skip Animation" is enabled:
- Bypasses physics simulation
- Generates random results instantly
- Maintains consistent API and callbacks
- Provides immediate feedback (500ms delay for UX)

### Result Resolution
Face values are determined by:
1. Finding the face normal most aligned with the up vector (0, 1, 0)
2. Applying quaternion transformation to account for die rotation
3. Mapping face index to die value (1-20 for D20, 1-100 for D100)

### Cleanup
Between rolls, the system:
- Removes all physics bodies from the world
- Disposes of Three.js geometries
- Resets rolling state
- Clears dice array

## Usage

1. **Select Dice Type**: Choose between D20 or D100
2. **Set Number of Dice**: Use the slider to select 1-5 dice
3. **Optional - Skip Animation**: Check the box for instant results
4. **Roll**: Click the "🎲 Roll Dice" button
5. **View Results**: Results appear in the Activity Log panel

## Technical Stack
- React 19
- @react-three/fiber (React renderer for Three.js)
- @react-three/drei (helpers and abstractions)
- Three.js (3D rendering)
- cannon-es (physics engine)
- TypeScript

## Performance Considerations
- Dice geometries are created on-demand
- Physics simulation runs at 60 FPS
- Proper cleanup prevents memory leaks
- OrbitControls allow camera manipulation
