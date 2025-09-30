# 📝 New Recipe Page Guidelines

This document outlines the implementation and usage guidelines for the `/newrecipe` page and its associated navigation updates.

---

## 🎯 **Overview**

The `/newrecipe` page provides a centralized hub for adding recipes to the collection through multiple methods. It replaces the old import dropdown with a more prominent and user-friendly interface.

---

## 🧭 **Navigation Entry Points**

### **Desktop Navigation**
- **Location**: Top navigation bar
- **Button**: Prominent "**+ New Recipe**" button with sage green styling
- **Behavior**: Routes to `/newrecipe` page
- **Styling**: Distinguished from other nav items with primary button styling

### **Mobile Navigation**
- **Location**: Hamburger menu drawer
- **Link**: "**+ New Recipe**" as a top-level menu item
- **Behavior**: Routes to `/newrecipe` page
- **Accessibility**: Full keyboard navigation and screen reader support

---

## 🎨 **Option Card Design Pattern**

### **Card Structure**
Each option card follows this consistent pattern:

```typescript
interface OptionCardProps {
  title: string           // Clear, descriptive title
  description: string     // Brief explanation of functionality
  icon: LucideIcon       // Relevant icon from Lucide React
  onClick: () => void    // Click handler
  className?: string     // Optional additional styling
}
```

### **Visual Design**
- **Size**: Minimum 120px height, responsive width
- **Styling**: White background, rounded corners, subtle border
- **Hover States**: Border color change, shadow enhancement, icon background change
- **Focus States**: Ring outline for keyboard navigation
- **Accessibility**: ARIA labels, proper semantic structure

### **Grid Layout**
- **Desktop**: 3 columns (lg:grid-cols-3)
- **Tablet**: 2 columns (md:grid-cols-2)
- **Mobile**: 1 column (grid-cols-1)
- **Spacing**: 6-unit gap between cards

---

## 🔧 **Modal Behaviors**

### **Modal Component**
- **Backdrop**: Semi-transparent black overlay
- **Close Methods**: ESC key, backdrop click, close button
- **Body Scroll**: Prevented when modal is open
- **Accessibility**: Focus management, ARIA attributes

### **Modal Sizes**
- **sm**: `max-w-md` - Small forms, confirmations
- **md**: `max-w-2xl` - Standard forms, single recipe entry
- **lg**: `max-w-4xl` - Complex forms, recipe editing
- **xl**: `max-w-6xl` - Large data tables, bulk operations
- **full**: `max-w-full h-full` - Full-screen on mobile

### **Modal Content**
Each modal contains the appropriate form component:
- **Manual Entry**: `RecipeForm` component
- **URL Import**: `UrlImportForm` component
- **CSV/Bulk Import**: `BulkImportForm` component
- **Image Upload**: Placeholder with "Coming Soon" message

---

## 📱 **Responsive Design**

### **Mobile-First Approach**
- **ResponsivePage**: Wraps all content for consistent mobile behavior
- **Tap Targets**: Minimum 48px for all interactive elements
- **Typography**: Scaled appropriately for mobile screens
- **Spacing**: Compact but readable on small screens

### **Breakpoints**
- **Mobile**: < 768px - Single column, full-width modals
- **Tablet**: 768px - 1024px - Two-column grid
- **Desktop**: > 1024px - Three-column grid

---

## 🔄 **Adding Future Recipe Entry Methods**

### **Step 1: Add Option Card**
```typescript
const optionCards = [
  // ... existing options
  {
    id: 'new-method',
    title: 'New Method Name',
    description: 'Brief description of the new method',
    icon: NewMethodIcon,
    onClick: () => setActiveModal('new-method')
  }
]
```

### **Step 2: Create Modal**
```typescript
<Modal
  isOpen={activeModal === 'new-method'}
  onClose={handleCancel}
  title="New Method Title"
  size="lg" // Choose appropriate size
>
  <NewMethodComponent
    onSubmit={handleNewMethodSubmit}
    onCancel={handleCancel}
  />
</Modal>
```

### **Step 3: Implement Handler**
```typescript
const handleNewMethodSubmit = (data: any) => {
  // Process the data
  // Add to recipes collection
  setActiveModal(null)
  navigate('/recipes')
}
```

### **Step 4: Update Documentation**
- Add the new method to this guidelines document
- Update any relevant technical documentation
- Test across all device sizes

---

## 🧪 **Testing Guidelines**

### **Desktop Testing**
- [ ] All option cards are clickable and open correct modals
- [ ] Modals open/close properly with all methods
- [ ] Forms submit correctly and navigate to recipes page
- [ ] Navigation button is prominent and functional
- [ ] Keyboard navigation works throughout

### **Mobile Testing**
- [ ] Hamburger menu opens and contains + New Recipe link
- [ ] Option cards are properly sized for touch interaction
- [ ] Modals are full-screen or appropriately sized
- [ ] All forms are usable on mobile devices
- [ ] Touch targets meet minimum 48px requirement

### **Accessibility Testing**
- [ ] Screen reader can navigate all elements
- [ ] Keyboard-only navigation works
- [ ] ARIA labels are present and descriptive
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG standards

---

## 🎨 **Design System Integration**

### **Colors**
- **Primary**: Sage green (`sage-600`, `sage-100`, `sage-200`)
- **Background**: Cream (`cream-50`)
- **Text**: Gray scale (`gray-900`, `gray-600`, `gray-700`)
- **Borders**: Light gray (`gray-200`, `gray-300`)

### **Typography**
- **Headings**: `font-display font-bold`
- **Body**: Default font stack
- **Sizes**: Responsive scaling with mobile-first approach

### **Spacing**
- **Cards**: 6-unit gap in grid
- **Padding**: 6-unit internal padding
- **Margins**: 8-unit between sections

---

## 🔧 **Technical Implementation**

### **Key Components**
- `NewRecipePage` - Main page component
- `OptionCard` - Reusable card component
- `Modal` - Reusable modal component
- `UrlImportForm` - URL import functionality
- `BulkImportForm` - Bulk import functionality
- `MobileNavigationDrawer` - Mobile navigation

### **State Management**
- Uses existing `RecipesContext` for recipe operations
- Local state for modal management
- No additional global state required

### **Routing**
- `/newrecipe` - New recipe options page
- `/new` - Traditional manual entry page (preserved for backward compatibility)

---

## 📊 **Performance Considerations**

### **Code Splitting**
- Modals are loaded on-demand
- Form components are imported as needed
- No unnecessary bundle size increase

### **Memory Management**
- Modals clean up event listeners on unmount
- Form state is reset when modals close
- No memory leaks from event handlers

---

## 🚀 **Future Enhancements**

### **Planned Features**
- **Image Upload**: AI-powered recipe extraction from photos
- **Voice Input**: Speech-to-text for recipe entry
- **Template Library**: Pre-built recipe templates
- **Batch Operations**: Multiple recipe operations at once

### **Extension Points**
- Plugin system for custom import methods
- API integration for external recipe sources
- Advanced validation and error handling
- Real-time collaboration features

---

*Last Updated: 2025-01-15*  
*Version: 1.0*
