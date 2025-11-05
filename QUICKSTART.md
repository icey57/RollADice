# Quick Start Guide

Get up and running with the 3D Viewer Application in minutes!

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

## Installation

```bash
# Clone the repository (if not already cloned)
git clone <repository-url>
cd project

# Install dependencies
npm install
```

## Development

```bash
# Start the development server
npm run dev
```

Open your browser to http://localhost:5173

You should see the 3D Viewer Application with:
- A control panel on the left (or top on mobile)
- A rotating 3D cube in the center
- An activity log on the right (or bottom on mobile)

## Basic Usage

### 1. Change Background Color
Click the "Background Color" color picker and select a color. The 3D scene background updates instantly.

### 2. Change Object Color
Click the "Object Color" color picker to change the cube's color.

### 3. Adjust Rotation Speed
Drag the "Rotation Speed" slider to speed up or slow down the cube rotation (0-5x).

### 4. Apply a Texture
Enter an image URL in the "Texture URL" field and click "Apply Texture". Watch the loading indicator appear and the texture apply to the cube.

**Example texture URLs:**
- https://threejs.org/examples/textures/crate.gif
- https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Check_green_icon.svg/200px-Check_green_icon.svg.png

### 5. Randomize Color
Click the "Randomize Color" button to generate a random color for the cube.

### 6. View Activity Log
All your actions are logged in the results panel on the right (or bottom on mobile).

## Testing Responsive Layout

### Desktop View
1. Ensure your browser window is wider than 1024px
2. You should see three columns side by side
3. Control and results panels have fixed widths (320px)
4. Canvas takes the remaining space

### Mobile View
1. Open browser developer tools (F12)
2. Toggle device emulation (Ctrl+Shift+M / Cmd+Shift+M)
3. Select a mobile device or set width < 1024px
4. Layout should stack vertically:
   - Controls at top
   - Canvas in middle
   - Results at bottom

### Test Different Breakpoints
- **Mobile**: 320px, 375px, 414px
- **Tablet**: 768px, 1024px
- **Desktop**: 1280px, 1440px, 1920px

## Testing Loading States

### Canvas Loading
1. Refresh the page
2. Watch for the spinning loader and "Initializing 3D Canvas..." message
3. Loader disappears after ~500ms when canvas is ready

### Texture Loading - Success
1. Enter a valid image URL: `https://threejs.org/examples/textures/crate.gif`
2. Click "Apply Texture"
3. Blue loading badge appears (top-right)
4. Green success badge appears when loaded
5. Texture is applied to the cube

### Texture Loading - Error
1. Enter an invalid URL: `https://invalid-url.com/texture.jpg`
2. Click "Apply Texture"
3. Red error badge appears
4. Error message: "Failed to load texture. Please check the URL."

## Testing Accessibility

### Keyboard Navigation
1. Press Tab to navigate through controls
2. Use Space/Enter to activate buttons
3. Use Arrow keys to adjust the slider
4. Notice the visible focus indicators (blue rings)

### Screen Reader
1. Enable your screen reader (NVDA, JAWS, VoiceOver)
2. Navigate through the page
3. All controls should be announced correctly
4. Labels and descriptions should be clear

### Color Contrast
All text and interactive elements meet WCAG AA standards (4.5:1 minimum contrast ratio).

### Reduced Motion
If your OS has "reduce motion" enabled, animations will be minimized automatically.

## Building for Production

```bash
# Build the application
npm run build
```

This creates optimized files in the `dist/` folder.

```bash
# Preview the production build
npm run preview
```

Open http://localhost:4173 to test the production build.

## Common Issues

### Issue: Canvas doesn't render
**Solution**: Check browser console for WebGL errors. Ensure your browser supports WebGL.

### Issue: Texture doesn't load
**Solution**: 
- Verify the URL is correct and accessible
- Check if the server supports CORS
- Look for errors in browser console

### Issue: Layout looks wrong on mobile
**Solution**: 
- Clear browser cache
- Ensure viewport meta tag is in index.html
- Test in different browsers

### Issue: Build fails
**Solution**:
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (should be 18+)

## Browser Support

### Recommended Browsers
- Chrome 90+ ✓
- Firefox 88+ ✓
- Safari 14+ ✓
- Edge 90+ ✓

### Required Features
- ES2020 JavaScript
- CSS Grid and Flexbox
- WebGL for 3D rendering

## Next Steps

- Read [README.md](./README.md) for detailed documentation
- Check [TESTING.md](./TESTING.md) for testing guidelines
- Review [ACCESSIBILITY.md](./ACCESSIBILITY.md) for accessibility features
- See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for design guidelines

## Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Review the documentation files
3. Verify your environment meets prerequisites
4. Try clearing cache and rebuilding

Enjoy exploring 3D graphics with the 3D Viewer Application! 🎨✨
