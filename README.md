# 3D Viewer Application

A responsive 3D visualization application built with React, TypeScript, Three.js, and Tailwind CSS.

## Features

- **Responsive Layout**: Three distinct panels (Controls, 3D View, Results) that adapt gracefully across desktop, tablet, and mobile breakpoints
- **3D Rendering**: Interactive 3D cube with customizable properties using Three.js
- **Loading States**: Visual feedback for canvas initialization and texture loading
- **Error Handling**: Clear error messages and recovery options for rendering and texture loading failures
- **Accessibility**: High contrast colors, proper ARIA labels, and keyboard navigation support
- **Modern Styling**: Tailwind CSS v4 with custom color schemes and responsive utilities

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Helper components for React Three Fiber
- **Cannon-es** - Physics engine for 3D simulations
- **Zustand** - Lightweight state management
- **Tailwind CSS v4** - Utility-first CSS framework
- **ESLint + Prettier** - Code quality and formatting

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

### Formatting

```bash
npm run format         # Format all files
npm run format:check   # Check formatting
```

### Testing

```bash
npm run test
```

## Project Structure

```
src/
├── components/
│   ├── ControlPanel.tsx    # Left panel with controls
│   ├── Canvas3D.tsx        # Center 3D view with loading/error states
│   └── ResultsPanel.tsx    # Right panel activity log
├── state/
│   └── store.ts            # Zustand state management
├── three/
│   └── helpers.ts          # Three.js utility functions
├── App.tsx                 # Main app component with layout
├── main.tsx                # Entry point
└── index.css               # Global styles with Tailwind
```

## Controls

- **Background Color**: Change the 3D scene background color
- **Object Color**: Customize the 3D cube color
- **Rotation Speed**: Adjust the rotation speed (0-5x)
- **Texture URL**: Apply an image texture to the cube
- **Randomize**: Generate a random color for the object

## Responsive Breakpoints

- **Mobile**: < 1024px - Stacked vertical layout
- **Desktop**: >= 1024px - Three-column layout with fixed-width sidebars

## Accessibility

- Semantic HTML elements (header, main, aside, section)
- ARIA labels for interactive elements
- High contrast color scheme (WCAG AA compliant)
- Keyboard navigation support
- Focus indicators on interactive elements
- Readable font sizes (14px-20px)

## Browser Support

Tested and verified in:
- Chrome (latest)
- Firefox (latest)

## Future Enhancements

- Additional 3D shapes
- Camera controls (zoom, pan, rotate)
- Multiple objects support
- Export/screenshot functionality
- Animation presets
