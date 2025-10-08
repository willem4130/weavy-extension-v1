# Weavy Template Manager - Design System

Professional dark theme design system for Chrome extension popup (400x600px).

## Quick Start

Import the theme in your CSS:
```css
@import './styles/theme.css';
```

## Color System

### Backgrounds
- `--bg-primary` (#1a1a1a) - Main background
- `--bg-secondary` (#242424) - Cards, inputs
- `--bg-tertiary` (#2d2d2d) - Elevated surfaces
- `--bg-hover` (#353535) - Hover states
- `--bg-active` (#3d3d3d) - Active states

### Accent Colors
- `--accent-primary` (#6366f1) - Primary actions
- `--accent-hover` (#818cf8) - Hover state
- `--accent-active` (#4f46e5) - Active state
- `--accent-subtle` (rgba(99, 102, 241, 0.1)) - Backgrounds

### Semantic Colors
- `--success` (#10b981) + `--success-bg`
- `--danger` (#ef4444) + `--danger-bg`
- `--warning` (#f59e0b) + `--warning-bg`
- `--info` (#3b82f6) + `--info-bg`

### Text Colors
- `--text-primary` (#f5f5f5) - Main text
- `--text-secondary` (#a3a3a3) - Secondary text
- `--text-muted` (#737373) - Muted/disabled text

### Borders
- `--border-color` (#404040)
- `--border-hover` (#525252)
- `--border-focus` (var(--accent-primary))

## Typography

### Font Sizes
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
```

### Font Weights
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Usage Classes
```html
<h1 class="heading-2xl">Page Title</h1>
<h2 class="heading-xl">Section Title</h2>
<h3 class="heading-lg">Subsection</h3>
<p class="text-base">Body text</p>
<span class="text-sm text-secondary">Secondary text</span>
<small class="text-xs text-muted">Small text</small>
```

## Spacing (8px Grid)

```css
--spacing-1: 4px
--spacing-2: 8px
--spacing-3: 12px
--spacing-4: 16px
--spacing-5: 20px
--spacing-6: 24px
--spacing-8: 32px
--spacing-10: 40px
--spacing-12: 48px
```

## Border Radius

```css
--radius-sm: 4px   /* Small elements */
--radius-md: 8px   /* Inputs, cards */
--radius-lg: 12px  /* Large cards */
--radius-xl: 16px  /* Hero elements */
--radius-full: 9999px /* Pills, badges */
```

## Shadows

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.3)
--shadow-md: 0 4px 6px rgba(0,0,0,0.4)
--shadow-lg: 0 10px 15px rgba(0,0,0,0.5)
--shadow-xl: 0 20px 25px rgba(0,0,0,0.6)
```

## Transitions

```css
--transition-fast: 150ms ease
--transition-base: 200ms ease
--transition-slow: 300ms ease
```

## Component Classes

### Buttons

```html
<!-- Primary button -->
<button class="btn btn-primary">Save</button>

<!-- Secondary button -->
<button class="btn btn-secondary">Cancel</button>

<!-- Danger button -->
<button class="btn btn-danger">Delete</button>

<!-- Ghost button -->
<button class="btn btn-ghost">Link</button>

<!-- Icon button -->
<button class="btn btn-icon">
  <svg>...</svg>
</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>
```

### Inputs

```html
<!-- Text input -->
<input type="text" class="input" placeholder="Enter text">

<!-- Textarea -->
<textarea class="textarea" placeholder="Description"></textarea>

<!-- Input with icon -->
<div class="input-group">
  <svg class="input-icon">...</svg>
  <input type="text" class="input" placeholder="Search">
</div>

<!-- Error state -->
<input type="text" class="input form-input-error">
<p class="form-error">Error message</p>
```

### Cards

```html
<!-- Basic card -->
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
  </div>
  <div class="card-body">
    Content
  </div>
  <div class="card-footer">
    Footer actions
  </div>
</div>

<!-- Hoverable card -->
<div class="card card-hover">
  Clickable card
</div>
```

### Tags/Chips

```html
<!-- Basic tag -->
<span class="tag">React</span>

<!-- Colored tags -->
<span class="tag tag-accent">Featured</span>
<span class="tag tag-success">Active</span>
<span class="tag tag-danger">Error</span>

<!-- Removable tag -->
<span class="tag tag-removable">
  React
  <button class="tag-remove">×</button>
</span>
```

### Modal

```html
<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-header">
      <h2 class="modal-title">Title</h2>
      <button class="btn btn-icon">×</button>
    </div>
    <div class="modal-body">
      Content
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary">Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

### Alerts

```html
<div class="alert alert-info">
  <svg class="alert-icon">...</svg>
  <div class="alert-content">
    <h4 class="alert-title">Info</h4>
    <p class="alert-message">Message</p>
  </div>
</div>

<!-- Types: alert-success, alert-warning, alert-danger -->
```

### Loading States

```html
<!-- Spinner -->
<div class="spinner"></div>
<div class="spinner spinner-lg"></div>

<!-- Skeleton -->
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-title"></div>
<div class="skeleton skeleton-card"></div>
```

### Empty State

```html
<div class="empty-state">
  <svg class="empty-state-icon">...</svg>
  <h3 class="empty-state-title">No templates</h3>
  <p class="empty-state-description">Get started by creating one</p>
  <button class="btn btn-primary">Create Template</button>
</div>
```

### Tabs

```html
<div class="tabs">
  <button class="tab active">All</button>
  <button class="tab">Recent</button>
  <button class="tab">Favorites</button>
</div>
```

### Badge

```html
<span class="badge">3</span>
<span class="badge badge-sm">99+</span>
```

## Utility Classes

```html
<!-- Layout -->
<div class="flex">...</div>
<div class="flex flex-col">...</div>
<div class="flex items-center justify-between">...</div>
<div class="flex gap-2">...</div>

<!-- Width -->
<div class="w-full">...</div>

<!-- Text -->
<p class="text-center">...</p>
<p class="truncate">...</p>

<!-- Text colors -->
<span class="text-primary">...</span>
<span class="text-secondary">...</span>
<span class="text-muted">...</span>
```

## Form Example

```html
<form class="template-form">
  <div class="form-group">
    <label class="form-label form-label-required">
      Template Name
    </label>
    <input type="text" class="input" required>
    <span class="form-hint">Choose a unique name</span>
  </div>

  <div class="form-group">
    <label class="form-label">Description</label>
    <textarea class="textarea"></textarea>
  </div>

  <div class="modal-footer">
    <button type="button" class="btn btn-secondary">Cancel</button>
    <button type="submit" class="btn btn-primary">Save</button>
  </div>
</form>
```

## Accessibility Features

- Focus visible styles on all interactive elements
- Proper ARIA support with semantic HTML
- Reduced motion support (`prefers-reduced-motion`)
- High contrast mode support (`prefers-contrast`)
- Keyboard navigation friendly

## Best Practices

1. **Use CSS Variables**: Always use design tokens instead of hardcoded values
2. **Consistent Spacing**: Use the 8px grid system
3. **Semantic Colors**: Use semantic colors (success, danger) for status
4. **Smooth Transitions**: Add transitions to interactive elements
5. **Accessible Focus**: Never remove focus outlines
6. **Mobile-First**: Though fixed width, ensure touch targets are 44px+
7. **Dark Theme**: All colors are optimized for dark backgrounds

## Browser Support

- Chrome 139+ (June 2025+)
- Manifest V3 only
- Modern CSS features (Grid, Flexbox, Custom Properties)
