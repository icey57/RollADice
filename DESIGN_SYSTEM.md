# Design System

## Color Palette

### Primary Colors
```css
Background: #1a1a2e (Navy Dark)
Panel BG:   #1f2937 (Gray-800)
Canvas BG:  #111827 (Gray-900)
```

### Text Colors
```css
Primary:    #ffffff (White)
Secondary:  #d1d5db (Gray-300)
Muted:      #9ca3af (Gray-400)
Disabled:   #6b7280 (Gray-500)
```

### Accent Colors
```css
Blue:       #3b82f6 (Primary actions)
Blue Dark:  #2563eb (Hover states)
Purple:     #7c3aed (Secondary actions)
Purple Drk: #6d28d9 (Hover states)
```

### Status Colors
```css
Success:    #10b981 (Green-500)
Error:      #ef4444 (Red-500)
Warning:    #f59e0b (Amber-500)
Info:       #3b82f6 (Blue-500)
```

### Border Colors
```css
Default:    #374151 (Gray-700)
Focus:      #3b82f6 (Blue-500)
Error:      #ef4444 (Red-500)
```

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;
```

### Font Sizes
```css
xs:   12px  (Timestamps, helper text)
sm:   14px  (Body text, labels)
base: 16px  (Default)
lg:   18px  (Large text)
xl:   20px  (Small headings)
2xl:  24px  (Main headings)
```

### Font Weights
```css
normal:   400  (Body text)
medium:   500  (Emphasized text, buttons)
semibold: 600  (Sub-headings)
bold:     700  (Main headings)
```

### Line Heights
```css
tight:  1.25  (Headings)
normal: 1.5   (Body text)
relaxed: 1.75 (Long-form content)
```

## Spacing Scale

Based on 4px base unit:
```css
1:  4px
2:  8px
3:  12px
4:  16px   (Default padding)
5:  20px
6:  24px
8:  32px
12: 48px
16: 64px
```

## Components

### Buttons

#### Primary Button
```css
Background: #2563eb
Hover: #1e40af
Text: #ffffff
Padding: 8px 16px
Border Radius: 6px
Font Weight: 500
Focus Ring: 2px #3b82f6 with 2px offset
```

#### Secondary Button
```css
Background: #7c3aed
Hover: #6d28d9
Text: #ffffff
Padding: 8px 16px
Border Radius: 6px
Font Weight: 500
Focus Ring: 2px #7c3aed with 2px offset
```

### Form Inputs

#### Text Input
```css
Background: #374151
Border: 1px #4b5563
Text: #ffffff
Padding: 8px 12px
Border Radius: 6px
Focus Ring: 2px #3b82f6
Placeholder: #6b7280
```

#### Color Picker
```css
Height: 40px
Width: 64px
Border: 2px #4b5563
Border Radius: 6px
Cursor: pointer
```

#### Range Slider
```css
Height: 8px
Background: #374151
Border Radius: 9999px
Accent Color: #3b82f6
Cursor: pointer
```

### Panels

#### Sidebar Panel
```css
Width: 320px (desktop)
Width: 100% (mobile)
Background: #1f2937
Border: 1px #374151
Padding: 16px
Overflow: auto
```

#### Canvas Panel
```css
Flex: 1
Background: #111827
Min Height: 300px (mobile)
```

### Cards

#### Log Entry Card
```css
Background: #374151
Border: 1px #4b5563
Border Radius: 6px
Padding: 12px
Hover: #3f4956
Transition: 200ms
```

### Loading States

#### Spinner
```css
Size: 64px (large), 20px (small)
Border: 4px
Color: #3b82f6
Animation: spin 1s linear infinite
```

#### Status Badge
```css
Background: rgba(color, 0.9)
Backdrop Filter: blur(4px)
Padding: 8px 16px
Border Radius: 8px
Position: absolute top-4 right-4
```

### Icons

#### Size Scale
```css
xs: 12px
sm: 16px
md: 20px
lg: 24px
xl: 32px
```

#### Usage
- Always use `aria-hidden="true"` for decorative icons
- Provide text alternatives for meaningful icons
- Use consistent stroke width (2px)

## Animations

### Duration
```css
fast:   150ms
normal: 200ms
slow:   300ms
```

### Easing
```css
ease-out: cubic-bezier(0, 0, 0.2, 1)
ease-in:  cubic-bezier(0.4, 0, 1, 1)
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

### Common Animations

#### Fade In
```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
animation: fade-in 0.3s ease-out;
```

#### Spin
```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
animation: spin 1s linear infinite;
```

## Responsive Breakpoints

```css
Mobile:  < 768px
Tablet:  768px - 1023px
Desktop: >= 1024px
```

### Layout Behavior

#### Mobile (< 1024px)
- Stacked vertical layout
- Full-width panels
- Max-height: 50vh for sidebars
- Touch-friendly controls (min 44px)

#### Desktop (>= 1024px)
- Three-column layout
- Fixed sidebar widths (320px)
- Full-height panels
- Hover states active

## Accessibility

### Focus Indicators
```css
outline: none;
ring: 2px solid #3b82f6;
ring-offset: 2px;
ring-offset-color: #1f2937;
```

### Min Contrast Ratios
- Normal text: 4.5:1
- Large text (18px+): 3:1
- UI components: 3:1

### Min Touch Targets
- Buttons: 44x44px
- Form inputs: 44px height
- Links: 44px height (or larger click area)

### Screen Reader Only
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

## Best Practices

### Color Usage
- Never rely on color alone to convey information
- Provide text alternatives
- Ensure adequate contrast
- Test with color blindness simulators

### Typography
- Maintain clear hierarchy
- Use consistent sizing scale
- Ensure readability at all sizes
- Allow user font size changes

### Spacing
- Use consistent spacing scale
- Ensure adequate white space
- Align elements to grid
- Maintain rhythm and flow

### Interactions
- Provide clear hover states
- Show loading indicators
- Display error messages clearly
- Give feedback for all actions

### Responsiveness
- Mobile-first approach
- Test at multiple breakpoints
- Ensure touch-friendly on mobile
- Optimize for common screen sizes
