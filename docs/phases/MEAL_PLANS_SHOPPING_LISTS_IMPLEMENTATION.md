# Meal Plans & Shopping Lists Implementation Plan

**Status**: 📋 **PLANNED**  
**Phase**: Meal Plans & Shopping Lists (Local-only, Account-ready)  
**Focus**: Implementation checklist for meal planning and shopping list functionality

---

## 🎯 **Implementation Overview**

This document provides a comprehensive implementation plan for the Meal Plans & Shopping Lists feature, based on the Phase Spec and mockups created. The implementation will maintain UI consistency with the existing recipe app while adding the new meal planning and shopping list functionality.

### **Key Implementation Goals**
- Implement meal planning with flexible meal slots and templates
- Build shopping list generation with ingredient normalization
- Create category management system with user customization
- Maintain UI consistency with existing app design
- Ensure account-ready architecture for future authentication

---

## 📋 **Implementation Checklist**

### **Phase 1: Foundation & Data Architecture**

#### **1.1 Base Entity & Type Definitions**
- [ ] **Create BaseEntity interface** (`src/types/base.ts`)
  - [ ] Define `id`, `ownerId?`, `createdAt`, `updatedAt`, `schemaVersion` fields
  - [ ] Export type aliases for `EntityId`, `OwnerId`, `Timestamp`
  - [ ] Create utility functions for entity management

- [ ] **Update Recipe interface** (`src/types/recipe.ts`)
  - [ ] Extend Recipe interface to implement BaseEntity
  - [ ] Add `ownerId?` and `schemaVersion` fields
  - [ ] Update RecipeFormData interface accordingly
  - [ ] Create migration utility for existing recipes

- [ ] **Create Meal Plan types** (`src/types/mealPlan.ts`)
  - [ ] Define `MealPlan` interface extending BaseEntity
  - [ ] Define `MealEntry` interface with date, mealSlot, type, recipeId, customTitle, servings, notes
  - [ ] Create meal slot enum: `'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other'`
  - [ ] Create meal type enum: `'recipe' | 'custom'`

- [ ] **Create Shopping List types** (`src/types/shoppingList.ts`)
  - [ ] Define `ShoppingList` interface extending BaseEntity
  - [ ] Define `ShoppingListItem` interface with label, quantity, unit, category, checked, relatedRecipeIds
  - [ ] Define `CategoryProfile` interface extending BaseEntity
  - [ ] Create shopping list status enum: `'active' | 'archived'`

- [ ] **Create DAL interfaces** (`src/types/dal.ts`)
  - [ ] Define `MealPlansDAL` interface with CRUD operations
  - [ ] Define `ShoppingListsDAL` interface with CRUD and generation operations
  - [ ] Define `CategoryProfilesDAL` interface with CRUD operations
  - [ ] Define `SettingsDAL` interface with export/import operations

#### **1.2 Data Access Layer (DAL) Implementation**

- [ ] **Create localUserId management** (`src/utils/localUserId.ts`)
  - [ ] Implement stable localUserId generation and storage
  - [ ] Create `getLocalUserId()` function
  - [ ] Add dev-only reset utility `resetLocalUserId()`
  - [ ] Handle localStorage key management

- [ ] **Implement Recipes DAL Adapter** (`src/dal/RecipesDALAdapter.ts`)
  - [ ] Create adapter class implementing RecipesDAL interface
  - [ ] Wrap existing storage functions (`loadRecipes`, `saveRecipes`, etc.)
  - [ ] Add ownerId and schemaVersion to existing recipes
  - [ ] Maintain backward compatibility with existing data

- [ ] **Implement Meal Plans DAL** (`src/dal/MealPlansDAL.ts`)
  - [ ] Create local storage implementation for meal plans
  - [ ] Implement `listByOwner`, `get`, `create`, `update`, `delete` methods
  - [ ] Add data validation and error handling
  - [ ] Implement storage namespacing with `mealPlansData` key

- [ ] **Implement Shopping Lists DAL** (`src/dal/ShoppingListsDAL.ts`)
  - [ ] Create local storage implementation for shopping lists
  - [ ] Implement `listByOwner`, `get`, `create`, `update`, `delete` methods
  - [ ] Implement `createFromSources` method for generation
  - [ ] Add data validation and error handling
  - [ ] Implement storage namespacing with `shoppingListsData` key

- [ ] **Implement Category Profiles DAL** (`src/dal/CategoryProfilesDAL.ts`)
  - [ ] Create local storage implementation for category profiles
  - [ ] Implement `listByOwner`, `get`, `create`, `update`, `delete` methods
  - [ ] Add data validation and error handling
  - [ ] Implement storage namespacing with `categoryProfilesData` key

#### **1.3 Ingredient Normalization System**

- [ ] **Create normalization engine** (`src/utils/ingredientNormalizer.ts`)
  - [ ] Implement `IngredientNormalizer` interface
  - [ ] Create unit alias mapping (tbsp → tablespoon, oz → ounce, etc.)
  - [ ] Create ingredient synonym mapping (green onion → scallion, etc.)
  - [ ] Implement basic singularization (onions → onion, tomatoes → tomato)
  - [ ] Create `normalize()` method for ingredient processing
  - [ ] Implement `canMerge()` and `merge()` methods for shopping list items

- [ ] **Create normalization configuration files** (`src/config/normalization.ts`)
  - [ ] Define `UNIT_ALIASES` mapping object
  - [ ] Define `INGREDIENT_SYNONYMS` mapping object
  - [ ] Define `SINGULAR_FORMS` mapping object
  - [ ] Make configuration easily extensible for future updates

---

### **Phase 2: Meal Plan Management**

#### **2.1 Meal Plan Context & State Management**

- [ ] **Create Meal Plans Context** (`src/context/MealPlansContext.tsx`)
  - [ ] Define MealPlansState interface with meal plans, loading, error states
  - [ ] Create MealPlansAction types for CRUD operations
  - [ ] Implement mealPlansReducer with all state management logic
  - [ ] Create MealPlansProvider component
  - [ ] Implement useMealPlans hook for component consumption
  - [ ] Add filtering and sorting capabilities

- [ ] **Create Meal Plan utilities** (`src/utils/mealPlanUtils.ts`)
  - [ ] Implement date range utilities for meal planning
  - [ ] Create meal slot management functions
  - [ ] Add template creation and application utilities
  - [ ] Implement meal plan validation functions

#### **2.2 Meal Plan Components**

- [ ] **Create MealPlanCard component** (`src/components/MealPlanCard.tsx`)
  - [ ] Display meal plan information (title, date range, tags)
  - [ ] Show quick stats (meals planned, recipes used, custom meals)
  - [ ] Add favorite toggle functionality
  - [ ] Implement edit and delete actions
  - [ ] Use consistent styling with existing RecipeCard

- [ ] **Create MealPlanList component** (`src/components/MealPlanList.tsx`)
  - [ ] Display list of meal plans with filtering options
  - [ ] Implement grid/list view toggle
  - [ ] Add search and tag filtering
  - [ ] Show empty state when no meal plans exist
  - [ ] Use consistent styling with existing RecipeList

- [ ] **Create MealPlanDetail component** (`src/components/MealPlanDetail.tsx`)
  - [ ] Display meal plan with calendar/list view toggle
  - [ ] Show meal entries organized by day and meal type
  - [ ] Implement meal entry editing and deletion
  - [ ] Add "Add to Shopping List" functionality
  - [ ] Use consistent styling with existing RecipeDetail

- [ ] **Create MealEntryForm component** (`src/components/MealEntryForm.tsx`)
  - [ ] Form for creating/editing meal entries
  - [ ] Recipe selection dropdown with search
  - [ ] Custom meal input field
  - [ ] Servings adjustment
  - [ ] Notes field for special instructions
  - [ ] Use consistent styling with existing RecipeForm

#### **2.3 Meal Plan Pages**

- [ ] **Create MealPlansListPage** (`src/pages/MealPlansListPage.tsx`)
  - [ ] Display all meal plans with filtering and search
  - [ ] Add "Create New Meal Plan" button
  - [ ] Implement template management
  - [ ] Add navigation to meal plan detail pages
  - [ ] Use ResponsivePage wrapper for consistency

- [ ] **Create CreateMealPlanPage** (`src/pages/CreateMealPlanPage.tsx`)
  - [ ] Multi-step meal plan creation process
  - [ ] Basic information form (title, description, date range, tags)
  - [ ] Days selection interface
  - [ ] Meal planning interface with drag-and-drop or form-based entry
  - [ ] Template selection and application
  - [ ] Use ResponsivePage wrapper for consistency

- [ ] **Create MealPlanDetailPage** (`src/pages/MealPlanDetailPage.tsx`)
  - [ ] Display meal plan details with calendar/list view
  - [ ] Edit meal plan information
  - [ ] Add/edit/remove meal entries
  - [ ] Generate shopping list from meal plan
  - [ ] Save as template functionality
  - [ ] Use ResponsivePage wrapper for consistency

---

### **Phase 3: Shopping List Management**

#### **3.1 Shopping List Context & State Management**

- [ ] **Create Shopping Lists Context** (`src/context/ShoppingListsContext.tsx`)
  - [ ] Define ShoppingListsState interface with lists, loading, error states
  - [ ] Create ShoppingListsAction types for CRUD operations
  - [ ] Implement shoppingListsReducer with all state management logic
  - [ ] Create ShoppingListsProvider component
  - [ ] Implement useShoppingLists hook for component consumption
  - [ ] Add filtering and search capabilities

- [ ] **Create Shopping List utilities** (`src/utils/shoppingListUtils.ts`)
  - [ ] Implement shopping list generation from meal plans
  - [ ] Create ingredient merging and normalization functions
  - [ ] Add scaling functionality for serving adjustments
  - [ ] Implement category organization utilities

#### **3.2 Shopping List Components**

- [ ] **Create ShoppingListCard component** (`src/components/ShoppingListCard.tsx`)
  - [ ] Display shopping list information (title, item count, status)
  - [ ] Show completion progress
  - [ ] Add edit and delete actions
  - [ ] Use consistent styling with existing components

- [ ] **Create ShoppingListDetail component** (`src/components/ShoppingListDetail.tsx`)
  - [ ] Display shopping list with category organization
  - [ ] Show search and filter options
  - [ ] Implement item checking/unchecking
  - [ ] Add inline item editing
  - [ ] Show category profile selector
  - [ ] Use consistent styling with existing components

- [ ] **Create ShoppingListItem component** (`src/components/ShoppingListItem.tsx`)
  - [ ] Display individual shopping list item
  - [ ] Implement checkbox for completion
  - [ ] Show item details (name, quantity, unit)
  - [ ] Add edit and delete actions
  - [ ] Use consistent styling with existing components

- [ ] **Create CategoryProfileManager component** (`src/components/CategoryProfileManager.tsx`)
  - [ ] Display category profiles with selection
  - [ ] Add/edit/delete category profiles
  - [ ] Manage custom categories within profiles
  - [ ] Icon selection for categories
  - [ ] Use modal interface for management

#### **3.3 Shopping List Pages**

- [ ] **Create ShoppingListsListPage** (`src/pages/ShoppingListsListPage.tsx`)
  - [ ] Display all shopping lists with filtering
  - [ ] Add "Generate New List" button
  - [ ] Show list status and completion
  - [ ] Add navigation to shopping list detail pages
  - [ ] Use ResponsivePage wrapper for consistency

- [ ] **Create ShoppingListDetailPage** (`src/pages/ShoppingListDetailPage.tsx`)
  - [ ] Display shopping list with category organization
  - [ ] Implement search and filtering
  - [ ] Add custom items to list
  - [ ] Manage category profiles
  - [ ] Print and export functionality
  - [ ] Use ResponsivePage wrapper for consistency

---

### **Phase 4: Integration & Quick Actions**

#### **4.1 Recipe Integration**

- [ ] **Update RecipeCard component** (`src/components/RecipeCard.tsx`)
  - [ ] Add "Add to Meal Plan" button with modal
  - [ ] Add "Add to Shopping List" button with modal
  - [ ] Implement quick action modals
  - [ ] Maintain existing functionality

- [ ] **Update RecipeDetail component** (`src/components/RecipeDetail.tsx`)
  - [ ] Add "Add to Meal Plan" button with modal
  - [ ] Add "Add to Shopping List" button with modal
  - [ ] Implement quick action modals
  - [ ] Maintain existing functionality

- [ ] **Create AddToMealPlanModal component** (`src/components/AddToMealPlanModal.tsx`)
  - [ ] Modal for adding recipe to meal plan
  - [ ] Date and meal slot selection
  - [ ] Servings adjustment
  - [ ] Create new meal plan option
  - [ ] Use consistent modal styling

- [ ] **Create AddToShoppingListModal component** (`src/components/AddToShoppingListModal.tsx`)
  - [ ] Modal for adding recipe to shopping list
  - [ ] Servings scaling
  - [ ] Category profile selection
  - [ ] Create new shopping list option
  - [ ] Use consistent modal styling

#### **4.2 Navigation Integration**

- [ ] **Update Header component** (`src/components/Header.tsx`)
  - [ ] Add "Meal Plans" navigation link
  - [ ] Add "Shopping Lists" navigation link
  - [ ] Update active state handling
  - [ ] Maintain existing navigation structure

- [ ] **Update NavigationDrawer component** (`src/components/NavigationDrawer.tsx`)
  - [ ] Add meal plans and shopping lists to mobile navigation
  - [ ] Update navigation structure
  - [ ] Maintain existing functionality

- [ ] **Update App routing** (`src/App.tsx`)
  - [ ] Add meal plan routes (`/meal-plans`, `/meal-plans/new`, `/meal-plans/:id`)
  - [ ] Add shopping list routes (`/shopping-lists`, `/shopping-lists/:id`)
  - [ ] Maintain existing route structure

---

### **Phase 5: UI Consistency & Styling**

#### **5.1 Design System Integration**

- [ ] **Update Tailwind configuration** (`tailwind.config.js`)
  - [ ] Add meal plan specific color variants
  - [ ] Add shopping list specific color variants
  - [ ] Maintain existing color scheme
  - [ ] Add custom spacing for meal planning layouts

- [ ] **Create meal plan specific styles** (`src/styles/mealPlans.css`)
  - [ ] Calendar view styling
  - [ ] Meal slot color coding
  - [ ] Day selection styling
  - [ ] Template styling

- [ ] **Create shopping list specific styles** (`src/styles/shoppingLists.css`)
  - [ ] Category organization styling
  - [ ] Item checking animations
  - [ ] Category profile styling
  - [ ] Print-friendly styles

#### **5.2 Component Styling Consistency**

- [ ] **Ensure consistent button styling**
  - [ ] Use existing button variants and sizes
  - [ ] Maintain hover and focus states
  - [ ] Use consistent icon integration

- [ ] **Ensure consistent form styling**
  - [ ] Use existing input and select styling
  - [ ] Maintain validation styling
  - [ ] Use consistent error handling

- [ ] **Ensure consistent modal styling**
  - [ ] Use existing Modal component
  - [ ] Maintain consistent overlay and animation
  - [ ] Use consistent button placement

- [ ] **Ensure consistent card styling**
  - [ ] Use existing card variants
  - [ ] Maintain consistent spacing and shadows
  - [ ] Use consistent hover effects

---

### **Phase 6: Testing & Quality Assurance**

#### **6.1 Unit Testing**

- [ ] **Test DAL implementations**
  - [ ] Test all CRUD operations
  - [ ] Test error handling and edge cases
  - [ ] Test data validation
  - [ ] Test localStorage integration

- [ ] **Test utility functions**
  - [ ] Test ingredient normalization
  - [ ] Test meal plan utilities
  - [ ] Test shopping list generation
  - [ ] Test date range utilities

- [ ] **Test context providers**
  - [ ] Test state management
  - [ ] Test action dispatching
  - [ ] Test error handling
  - [ ] Test loading states

#### **6.2 Integration Testing**

- [ ] **Test meal plan workflows**
  - [ ] Test meal plan creation
  - [ ] Test meal entry management
  - [ ] Test template functionality
  - [ ] Test shopping list generation

- [ ] **Test shopping list workflows**
  - [ ] Test shopping list generation
  - [ ] Test item management
  - [ ] Test category organization
  - [ ] Test export functionality

- [ ] **Test recipe integration**
  - [ ] Test "Add to Meal Plan" functionality
  - [ ] Test "Add to Shopping List" functionality
  - [ ] Test modal interactions
  - [ ] Test data consistency

#### **6.3 UI Testing**

- [ ] **Test responsive design**
  - [ ] Test mobile layouts
  - [ ] Test tablet layouts
  - [ ] Test desktop layouts
  - [ ] Test touch interactions

- [ ] **Test accessibility**
  - [ ] Test keyboard navigation
  - [ ] Test screen reader compatibility
  - [ ] Test ARIA labels
  - [ ] Test focus management

- [ ] **Test cross-browser compatibility**
  - [ ] Test Chrome compatibility
  - [ ] Test Firefox compatibility
  - [ ] Test Safari compatibility
  - [ ] Test Edge compatibility

---

### **Phase 7: Demo Data & Documentation**

#### **7.1 Demo Data Implementation**

- [ ] **Create sample meal plans** (`src/data/sampleMealPlans.ts`)
  - [ ] Create weekly meal plan examples
  - [ ] Create template examples
  - [ ] Create different meal plan types
  - [ ] Include various meal slot combinations

- [ ] **Create sample shopping lists** (`src/data/sampleShoppingLists.ts`)
  - [ ] Create shopping lists from sample meal plans
  - [ ] Create different category profiles
  - [ ] Include various item types
  - [ ] Include custom categories

- [ ] **Create sample category profiles** (`src/data/sampleCategoryProfiles.ts`)
  - [ ] Create default store layout profile
  - [ ] Create organic store profile
  - [ ] Create warehouse store profile
  - [ ] Create custom profiles with user categories

- [ ] **Update sample data loading** (`src/utils/sampleData.ts`)
  - [ ] Add meal plans to sample data loading
  - [ ] Add shopping lists to sample data loading
  - [ ] Add category profiles to sample data loading
  - [ ] Maintain existing recipe sample data

#### **7.2 Documentation Updates**

- [ ] **Update technical documentation** (`docs/technical/`)
  - [ ] Update data model documentation
  - [ ] Document DAL interfaces
  - [ ] Document ingredient normalization system
  - [ ] Document category management system

- [ ] **Update user documentation** (`docs/`)
  - [ ] Create meal planning user guide
  - [ ] Create shopping list user guide
  - [ ] Update feature overview
  - [ ] Update troubleshooting guide

---

## 🎯 **Implementation Priorities**

### **High Priority (Must Have)**
1. **Base Entity & DAL Architecture** - Foundation for all features
2. **Meal Plan CRUD Operations** - Core meal planning functionality
3. **Shopping List Generation** - Core shopping list functionality
4. **Basic UI Components** - Essential user interface elements
5. **Recipe Integration** - Quick actions for existing recipes

### **Medium Priority (Should Have)**
1. **Category Management** - Enhanced shopping list organization
2. **Template System** - Reusable meal plan templates
3. **Advanced Filtering** - Enhanced user experience
4. **Print/Export Functionality** - Practical shopping list features
5. **Demo Data** - Better user onboarding

### **Low Priority (Nice to Have)**
1. **Advanced Animations** - Enhanced user experience
2. **Drag and Drop** - Advanced meal planning interface
3. **Advanced Category Profiles** - Highly customized organization
4. **Bulk Operations** - Advanced management features
5. **Advanced Export Options** - Multiple export formats

---

## 🚀 **Implementation Timeline**

### **Week 1-2: Foundation**
- Complete Phase 1 (Foundation & Data Architecture)
- Set up DAL system and data models
- Implement ingredient normalization

### **Week 3-4: Meal Plans**
- Complete Phase 2 (Meal Plan Management)
- Build core meal planning functionality
- Create meal plan UI components

### **Week 5-6: Shopping Lists**
- Complete Phase 3 (Shopping List Management)
- Build shopping list generation and management
- Create shopping list UI components

### **Week 7: Integration**
- Complete Phase 4 (Integration & Quick Actions)
- Integrate with existing recipe system
- Add navigation and quick actions

### **Week 8: Polish**
- Complete Phase 5 (UI Consistency & Styling)
- Complete Phase 6 (Testing & Quality Assurance)
- Complete Phase 7 (Demo Data & Documentation)

---

## 📝 **Implementation Notes**

### **UI Consistency Requirements**
- Use existing `ResponsivePage` wrapper for all pages
- Use existing `Header` component with updated navigation
- Use existing `Modal` component for all modal dialogs
- Use existing button, input, and card styling
- Maintain existing color scheme and typography
- Use existing icon library (Lucide React)

### **Data Architecture Requirements**
- All entities must extend BaseEntity
- Use stable localUserId for ownerId
- Implement proper schema versioning
- Maintain backward compatibility with existing recipes
- Use localStorage with proper namespacing

### **Performance Requirements**
- Implement proper React optimization (memo, useMemo, useCallback)
- Use virtual scrolling for large lists
- Implement caching for generated shopping lists
- Optimize re-renders and state updates

### **Accessibility Requirements**
- Implement proper ARIA labels
- Ensure keyboard navigation
- Maintain screen reader compatibility
- Use semantic HTML elements

---

## ✅ **Definition of Done**

Each task is considered complete when:
- [ ] Code is implemented and tested
- [ ] UI matches mockup designs
- [ ] Component is responsive across devices
- [ ] Accessibility requirements are met
- [ ] Integration with existing app works correctly
- [ ] No console errors or warnings
- [ ] Code follows existing patterns and conventions
- [ ] Documentation is updated if needed

---

*This implementation plan provides a comprehensive roadmap for building the Meal Plans & Shopping Lists feature while maintaining consistency with the existing recipe app architecture and design.*
