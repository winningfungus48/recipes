# Mobile Responsiveness System & Detail Page Update

## Overview

This document outlines the mobile responsiveness system implemented for the Recipe App, including reusable components, responsive design patterns, and mobile-specific optimizations.

## Breakpoint Strategy

**Single Breakpoint**: `md = 768px`
- **Mobile**: `< 768px` (phones, small tablets)
- **Desktop/Tablet**: `≥ 768px` (tablets, desktops)

## Reusable Components

### 1. MobileHeader Component

**Purpose**: Displays title, heart, and star rating in a mobile-optimized layout.

**Usage**:
```tsx
import MobileHeader from './MobileHeader'

<MobileHeader
  title={recipe.title}
  rating={recipe.rating}
  isFavorite={recipe.isFavorite}
  onToggleFavorite={() => onToggleFavorite(recipe.id)}
  className="mb-4"
/>
```

**Features**:
- **Line 1**: Title (ellipsis-truncated)
- **Line 2**: Stars (left) and Heart (right)
- **Mobile-only**: Hidden on desktop (`md:hidden`)
- **Event handling**: Prevents navigation when clicking heart

### 2. CardMetaRow Component

**Purpose**: Displays category, difficulty, cook time, and tags with responsive behavior.

**Usage**:
```tsx
import CardMetaRow from './CardMetaRow'

<CardMetaRow
  category={recipe.category}
  difficulty={recipe.difficulty}
  cookTime={recipe.cookTime}
  tags={recipe.tags}
  className="mt-1"
/>
```

**Features**:
- **Category & Difficulty**: Always visible
- **Cook Time**: Mobile-only (`md:hidden`)
- **Tags**: Desktop-only (`hidden md:flex`)
- **Responsive spacing**: Compact on mobile, expanded on desktop

### 3. ActionBar Component

**Purpose**: Provides Edit/Delete buttons with mobile-specific sticky behavior.

**Usage**:
```tsx
import ActionBar from './ActionBar'

<ActionBar
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**Features**:
- **Desktop**: Edit + Delete buttons (top-right)
- **Mobile**: Sticky Edit-only button (bottom)
- **Mobile-only**: Uses `data-mobile-only="true"` with CSS media query

### 4. ResponsivePage Component

**Purpose**: Wrapper component that applies mobile-specific styling and optimizations.

**Usage**:
```tsx
import ResponsivePage from './ResponsivePage'

<ResponsivePage>
  {/* Page content */}
</ResponsivePage>
```

**Features**:
- **Typography scaling**: Mobile-optimized text sizes
- **Spacing**: Mobile-specific padding and margins
- **Touch targets**: Minimum 48px for interactive elements

## Mobile Layout Patterns

### Recipe Detail Page

**Mobile Structure**:
```tsx
<ResponsivePage>
  <MobileHeader title + heart + stars />
  <Desktop Header hidden on mobile />
  <Mobile Category/Difficulty badges />
  <Full-width Image with 16:9 aspect ratio />
  <Tags hidden on mobile />
  <Mobile Details Disclosure />
  <Content Grid />
  <Desktop Metadata hidden on mobile />
  <Mobile Action Bar />
</ResponsivePage>
```

**Key Features**:
- **Title + Heart + Stars** above the fold
- **Category/Difficulty badges** below title
- **Full-width image** with responsive optimization
- **Tags hidden** on mobile
- **Collapsed Details** disclosure for metadata
- **Sticky Edit-only** action bar

### Recipe List Page

**List View**:
```tsx
<Link to={`/recipes/${recipe.id}`} className="flex space-x-4 block">
  <MobileHeader title + heart + stars />
  <Desktop Header hidden on mobile />
  <CardMetaRow category + difficulty + cook time + tags />
</Link>
```

**Grid View**:
```tsx
<Link to={`/recipes/${recipe.id}`} className="block">
  <Image with aspect ratio />
</Link>
<Favorite Toggle with stopPropagation />
<CardMetaRow category + difficulty + cook time + tags />
```

## Image Optimization

### Responsive Images

**Implementation**:
```tsx
<img
  src={recipe.image}
  alt={recipe.title}
  className="w-full h-64 md:h-80 object-cover rounded-lg"
  loading="lazy"
  srcSet={`
    ${recipe.image}?w=320 320w,
    ${recipe.image}?w=640 640w,
    ${recipe.image}?w=960 960w,
    ${recipe.image}?w=1280 1280w
  `}
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

**Features**:
- **Lazy loading** for performance
- **Responsive srcset** with 4 different sizes
- **Smart sizes** attribute for different screen sizes
- **16:9 aspect ratio** with object-fit cover

## Mobile-Specific CSS Classes

### Touch Targets
```css
.mobile-touch-target {
  @apply min-h-[48px] min-w-[48px];
}

.mobile-button {
  @apply mobile-touch-target flex items-center justify-center;
}
```

### Responsive Visibility
```css
.mobile-hidden {
  @apply hidden md:flex;
}

.mobile-visible {
  @apply flex md:hidden;
}
```

### Mobile Action Bar
```css
[data-mobile-only="true"] {
  display: none;
}

@media (max-width: 767px) {
  [data-mobile-only="true"] {
    display: block;
  }
}
```

## Event Handling

### Navigation Prevention

**Interactive Elements**:
```tsx
<button
  onClick={(e) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite(recipe.id)
  }}
  className="mobile-heart-button"
>
  <Heart className="mobile-heart-icon" />
</button>
```

**Key Points**:
- **`e.preventDefault()`**: Prevents default button behavior
- **`e.stopPropagation()`**: Prevents event bubbling to parent Link
- **Consistent pattern**: Applied to all interactive elements

## Testing Guidelines

### Breakpoints to Test
- **360px**: Small mobile devices
- **390px**: Standard mobile devices
- **414px**: Large mobile devices
- **768px**: Tablet breakpoint

### Mobile Checklist
- [ ] No horizontal scroll
- [ ] Icons fit properly
- [ ] Touch targets are ≥48px
- [ ] Sticky action bar appears after scroll
- [ ] Card navigation works
- [ ] Interactive elements don't trigger navigation
- [ ] Desktop layout unchanged

### Desktop Checklist
- [ ] All components visible
- [ ] Proper spacing maintained
- [ ] No mobile-only elements visible
- [ ] Action buttons in correct positions

## Component Integration

### RecipeDetail.tsx
- Uses `MobileHeader`, `ActionBar`, `ResponsivePage`
- Implements collapsed details disclosure
- Image optimization with responsive srcset

### RecipeCard.tsx
- Uses `MobileHeader` for list view
- Uses `CardMetaRow` for both views
- Proper Link wrapping for navigation
- Event handling for interactive elements

## Best Practices

1. **Consistent Breakpoints**: Always use `md = 768px`
2. **Touch Targets**: Minimum 48px for interactive elements
3. **Event Handling**: Always prevent propagation on interactive elements
4. **Link Wrapping**: Wrap entire clickable areas in Link components
5. **Mobile-First**: Design mobile layout first, then enhance for desktop
6. **Performance**: Use lazy loading and responsive images
7. **Accessibility**: Maintain proper ARIA labels and keyboard navigation

## Troubleshooting

### Common Issues

**Card Navigation Not Working**:
- Ensure entire card content is wrapped in Link
- Add `e.stopPropagation()` to interactive elements
- Check for conflicting event handlers

**Mobile Action Bar Showing on Desktop**:
- Use `data-mobile-only="true"` attribute
- Implement CSS media query approach
- Avoid Tailwind's `md:hidden` for complex layouts

**Heart/Star Buttons Not Working**:
- Add `e.preventDefault()` and `e.stopPropagation()`
- Ensure proper event handler binding
- Check for conflicting CSS classes

**Layout Issues on Mobile**:
- Verify responsive classes are applied correctly
- Check for conflicting CSS rules
- Test at actual breakpoints, not just browser dev tools

## Future Enhancements

1. **Swipe Gestures**: Add swipe navigation for mobile
2. **Pull-to-Refresh**: Implement pull-to-refresh functionality
3. **Offline Support**: Add service worker for offline capabilities
4. **Haptic Feedback**: Add vibration feedback for mobile interactions
5. **Advanced Animations**: Implement smooth transitions and micro-interactions
