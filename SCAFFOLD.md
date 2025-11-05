# Scaffold Documentation

This document describes the scaffolding setup for this Vite + React + TypeScript project.

## Project Initialization

The project is built with:
- **Vite 7.1.12** - Next-generation frontend build tool
- **React 19.2.0** - Latest React with improved performance
- **TypeScript 5.9.3** - Type-safe JavaScript

## Core Dependencies

### 3D Graphics & Physics
- **three@0.181.0** - Core 3D graphics library
- **@react-three/fiber@9.4.0** - React renderer for Three.js
- **@react-three/drei@10.7.6** - Helper components and abstractions for R3F
- **cannon-es@0.20.0** - Physics engine for 3D simulations

### State Management
- **zustand@5.0.8** - Lightweight state management without boilerplate

### UI Framework
- **react@19.2.0** & **react-dom@19.2.0** - UI rendering

### Styling
- **tailwindcss@4.1.16** - Utility-first CSS framework
- **@tailwindcss/postcss@4.1.16** - PostCSS plugin for Tailwind v4
- **postcss@8.5.6** - CSS transformation
- **autoprefixer@10.4.21** - Automatic vendor prefixes

## Development Tools

### Code Quality
- **eslint@9.39.1** - JavaScript/TypeScript linter
- **@typescript-eslint/parser@8.46.3** - TypeScript parser for ESLint
- **@typescript-eslint/eslint-plugin@8.46.3** - TypeScript-specific linting rules
- **eslint-plugin-react@7.37.5** - React-specific linting rules
- **eslint-plugin-react-hooks@7.0.1** - Rules for React Hooks
- **eslint-plugin-react-refresh@0.4.24** - Rules for React Fast Refresh
- **typescript-eslint@8.46.3** - TypeScript ESLint utilities

### Code Formatting
- **prettier@3.6.2** - Opinionated code formatter
- **eslint-config-prettier@10.1.8** - Disable ESLint rules that conflict with Prettier
- **eslint-plugin-prettier@5.5.4** - Run Prettier as an ESLint rule

### Type Definitions
- **@types/react@19.2.2** - Type definitions for React
- **@types/react-dom@19.2.2** - Type definitions for React DOM
- **@types/three@0.181.0** - Type definitions for Three.js

### Build Tools
- **@vitejs/plugin-react@5.1.0** - Official Vite plugin for React

## Project Structure

```
/
├── src/
│   ├── components/     # React components
│   │   ├── Canvas3D.tsx
│   │   ├── ControlPanel.tsx
│   │   └── ResultsPanel.tsx
│   ├── state/          # State management
│   │   └── store.ts    # Zustand store
│   ├── three/          # Three.js utilities
│   │   └── helpers.ts  # Helper functions for 3D objects
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles and Tailwind imports
├── public/             # Static assets
├── .gitignore          # Git ignore rules
├── .prettierrc         # Prettier configuration
├── .prettierignore     # Prettier ignore rules
├── eslint.config.js    # ESLint configuration (flat config)
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── tsconfig.node.json  # TypeScript config for Node files
└── vite.config.ts      # Vite configuration

## NPM Scripts

### Development
- `npm run dev` - Start development server with hot reload (http://localhost:5173)

### Build
- `npm run build` - Type check with TypeScript, then build for production
- `npm run preview` - Preview the production build locally

### Code Quality
- `npm run lint` - Check code with ESLint (zero warnings policy)
- `npm run lint:fix` - Auto-fix ESLint issues where possible

### Formatting
- `npm run format` - Format all TypeScript/TSX/CSS files with Prettier
- `npm run format:check` - Check if files are formatted correctly

### Testing
- `npm run test` - Run tests (placeholder for future test setup)

## ESLint Configuration

The project uses ESLint 9 with the new flat config format (`eslint.config.js`):

- **Base configs**: JavaScript recommended, TypeScript recommended
- **Plugins**: React, React Hooks, React Refresh, Prettier
- **Special rules**:
  - React JSX runtime (no need to import React)
  - Unused variables warning with `_` prefix exception
  - React Refresh components warning
  - Prettier integration

## Prettier Configuration

Sensible defaults for code formatting:
- Semicolons: Yes
- Single quotes: Yes
- Trailing commas: ES5
- Tab width: 2 spaces
- Print width: 80 characters
- Line endings: LF (Unix-style)

## TypeScript Configuration

- **Strict mode** enabled for maximum type safety
- **Target**: ES2020
- **Module**: ESNext
- **JSX**: react-jsx (automatic runtime)
- **Lib**: ES2020, DOM, DOM.Iterable
- Includes: `src/**/*`
- Path resolution ready for future alias configuration

## Zustand Store

A sample store is provided in `src/state/store.ts` with:
- State for background color, object color, rotation speed, texture URL
- Actions for updating state values
- Results array for activity logging

## Three.js Helpers

Basic helper functions in `src/three/helpers.ts`:
- `createBox()` - Create a box mesh with material
- `createLight()` - Create a directional light
- `createAmbientLight()` - Create ambient lighting

## Git Ignore

Configured to ignore:
- `node_modules/`
- `dist/`
- Build artifacts and logs
- Editor configurations (except VS Code settings)
- Environment files

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Verify linting**:
   ```bash
   npm run lint
   ```

4. **Format code**:
   ```bash
   npm run format
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## Next Steps

The scaffold provides a solid foundation. Consider adding:

1. **Testing**: Configure Vitest or Jest with React Testing Library
2. **E2E Tests**: Add Playwright or Cypress for integration testing
3. **CI/CD**: Set up GitHub Actions or similar for automated testing
4. **Physics**: Integrate cannon-es with React Three Fiber (@react-three/cannon)
5. **3D Controls**: Add OrbitControls, TransformControls from Drei
6. **Performance**: Add monitoring and optimization tools
7. **Documentation**: Expand inline code documentation and guides

## Troubleshooting

### Dev server won't start
- Check if port 5173 is available
- Try `rm -rf node_modules package-lock.json && npm install`

### Linting errors
- Run `npm run lint:fix` to auto-fix many issues
- Check ESLint output for detailed error messages

### Type errors
- Ensure `npm install` completed successfully
- Check `tsconfig.json` for proper configuration
- Verify all type declaration packages are installed

### Build failures
- Run `npm run lint` to catch issues before building
- Check TypeScript errors with `tsc --noEmit`
- Review Vite build output for specific issues
