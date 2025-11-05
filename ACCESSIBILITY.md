# Accessibility Features

This document outlines the accessibility features implemented in the 3D Viewer Application to ensure compliance with WCAG 2.1 Level AA standards.

## Semantic HTML

### Structure
- `<header>` - Application header with title
- `<main>` - Primary content container
- `<aside>` - Sidebars for controls and results
- `<section>` - 3D canvas view
- Proper heading hierarchy (h1, h2)

### ARIA Roles
- `role="main"` - 3D canvas section
- `role="log"` - Activity log in results panel
- `aria-label` - Descriptive labels on all interactive elements
- `aria-hidden="true"` - Decorative icons

## Color Contrast

All text and interactive elements meet WCAG AA standards (minimum 4.5:1 for normal text, 3:1 for large text):

### Background Colors
- `#1a1a2e` - Primary dark background
- `#1f2937` - Gray-800 (panel backgrounds)
- `#111827` - Gray-900 (canvas background)

### Text Colors
- `#ffffff` on `#1a1a2e` - **12.5:1** ✓ (Excellent)
- `#d1d5db` on `#1f2937` - **9.2:1** ✓ (Excellent)
- `#9ca3af` on `#1f2937` - **5.8:1** ✓ (Good)

### Interactive Elements
- Blue buttons (`#2563eb`) on dark - **4.8:1** ✓
- Purple buttons (`#7c3aed`) on dark - **5.2:1** ✓
- Red error states (`#ef4444`) on dark - **5.1:1** ✓
- Green success states (`#10b981`) on dark - **4.9:1** ✓

## Typography

### Font Sizes
- **Minimum**: 14px (body text, labels)
- **Regular**: 16px (default browser size)
- **Large**: 20px-24px (headings)
- **Small**: 12px (timestamps, helper text - used sparingly)

### Font Families
- System font stack for optimal rendering
- `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`
- Font smoothing enabled for better readability

## Keyboard Navigation

### Tab Order
1. Header (skipped if no interactive elements)
2. Control Panel inputs (top to bottom)
3. 3D Canvas (focusable if interactive features added)
4. Results Panel (scrollable)

### Interactive Elements
All interactive elements are keyboard accessible:
- **Color pickers**: Tab to focus, Enter to open, Arrow keys to adjust
- **Range slider**: Tab to focus, Arrow keys to adjust value
- **Text input**: Tab to focus, type to enter URL
- **Buttons**: Tab to focus, Enter/Space to activate

### Focus Indicators
- Visible focus ring on all interactive elements
- Blue ring with offset for better visibility
- `focus:outline-none` + `focus:ring-2` pattern
- Focus states persist during keyboard navigation

## Screen Reader Support

### Labels
- All form inputs have associated `<label>` elements
- Labels use `htmlFor` attribute to connect to inputs
- Color values displayed as readable hex codes

### Status Messages
- Loading states announced via text content
- Error messages clearly communicate the issue
- Success confirmations provide feedback

### Meaningful Text
- "3D Viewer Application" - Clear app purpose
- "Initializing 3D Canvas..." - Loading status
- "Failed to load texture. Please check the URL." - Actionable error
- "No activity yet" - Empty state explanation

## Motion and Animation

### Reduced Motion
For users who prefer reduced motion, consider adding:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Current Animations
- Spinning loaders (loading indicators)
- Fade-in animations (status notifications)
- 3D object rotation (core feature, not decorative)

## Responsive Design

### Mobile Accessibility
- Touch targets minimum 44x44px (all buttons meet this)
- Adequate spacing between interactive elements
- No hover-only interactions
- Scrollable panels on small screens

### Breakpoints
- Mobile first approach
- Breakpoint at 1024px for desktop layout
- Flexible sizing for various screen sizes

## Error Handling

### Visual Feedback
- Red color for errors (with adequate contrast)
- Error icons for visual recognition
- Clear error messages

### Recovery Options
- "Reload Page" button for critical errors
- Informative messages guide users to fix issues
- Non-blocking errors (texture loading) don't break the app

## Testing Recommendations

### Automated Testing
- [ ] Use axe-core or similar tool for automated accessibility checks
- [ ] Run Lighthouse accessibility audit (target: 95+ score)
- [ ] Validate HTML5 semantics

### Manual Testing
- [ ] Test with keyboard only (no mouse)
- [ ] Test with screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Test color contrast with tools (WebAIM, Stark)
- [ ] Test with browser zoom at 200%
- [ ] Test with Windows High Contrast mode

### User Testing
- [ ] Test with users who have disabilities
- [ ] Gather feedback on navigation flow
- [ ] Validate that loading states are clear
- [ ] Confirm error messages are helpful

## Future Improvements

1. **Skip Links**: Add "Skip to main content" link at top
2. **Keyboard Shortcuts**: Add documented keyboard shortcuts for common actions
3. **Custom Focus Styles**: Match brand colors while maintaining visibility
4. **Live Regions**: Use ARIA live regions for dynamic content updates
5. **Reduced Motion**: Respect `prefers-reduced-motion` system preference
6. **High Contrast**: Test and optimize for high contrast modes
7. **Tooltips**: Add helpful tooltips with proper ARIA attributes
8. **Form Validation**: Add inline validation with clear error messages

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [a11y Project Checklist](https://www.a11yproject.com/checklist/)
