# Phase: Meal Plans & Shopping Lists (Local-only, Account-ready)

**Status**: 📋 **PLANNED**  
**Duration**: Enhancement phase  
**Focus**: Meal planning with flexible slots, shopping list generation, and local persistence with account-ready architecture

---

## 🎯 **Phase Overview**

This phase introduces comprehensive meal planning capabilities and intelligent shopping list generation. The system is designed for local-only operation with a clean migration path to account-based synchronization in future phases.

### **Key Objectives**
- Dated meal plans with flexible meal slots and skip days
- Intelligent shopping list generation from meal plans and recipes
- Ingredient normalization and duplicate merging
- Reusable templates and category profiles
- Account-ready data architecture for future authentication
- Seamless integration with existing recipe management

---

## 📋 **Scope (MVP)**

### **Meal Plans**
- **Dated Planning**: Create meal plans with specific dates and flexible meal slots (breakfast, lunch, dinner, snack, other)
- **Flexible Entries**: Add recipe entries or custom meal placeholders (free-text)
- **Skip Days**: Support for days without planned meals
- **Templates**: Save and reuse meal plan templates
- **Favorites**: Mark meal plans as favorites (no ratings system)
- **Tags & Filters**: Organize plans with tags and filtering capabilities
- **View Toggle**: Switch between calendar (week grid) and list views
- **Quick Actions**: "Add to Meal Plan" buttons on recipe cards and detail pages

### **Shopping Lists**
- **Smart Generation**: Generate lists from one or more meal plans or selected recipes
- **Ingredient Merging**: Automatic duplicate detection with simple unit harmonization
- **Scaling Support**: Per-entry servings and plan-level scaling options
- **Inline Editing**: Add, edit, and remove items directly in the list
- **Category Profiles**: User-defined category bucket sets for organization
- **Export Options**: Print-friendly format and copy to clipboard
- **Quick Actions**: "Add to Shopping List" buttons on recipe cards and detail pages

### **Storage Architecture**
- **Local-Only**: All data persisted locally via Data Access Layer (DAL)
- **Account-Ready**: Stable `localUserId` used as `ownerId` for future migration
- **No Backend**: Complete functionality without server dependencies

---

## 🚫 **Out of Scope (for this phase)**

- Authentication and user accounts
- Public sharing and collaboration features
- Nutrition summaries and calculations
- Retailer integrations and price tracking
- Advanced AI suggestions and recommendations
- Cross-device synchronization

---

## 🏗️ **Data Model (Account-ready)**

### **Base Entity Structure**

All entities extend a common base structure for consistency and future migration:

```typescript
interface BaseEntity {
  id: string;
  ownerId?: string;        // Optional for local-only phase, defaults to localUserId
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
  schemaVersion: string;   // For future migration support
}
```

### **Core Entities**

#### **MealPlan**
```typescript
interface MealPlan extends BaseEntity {
  title?: string;
  description?: string;
  isDated: boolean;        // Always true for this phase
  startDate?: string;      // ISO date string
  endDate?: string;        // ISO date string
  entries: MealEntry[];
  favorite: boolean;
  tags: string[];
  template: boolean;       // True if this is a reusable template
}
```

#### **MealEntry**
```typescript
interface MealEntry {
  date: string;            // ISO date string (required for dated plans)
  mealSlot: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  type: 'recipe' | 'custom';
  recipeId?: string;       // Reference to Recipe.id when type='recipe'
  customTitle?: string;    // Free-text meal description when type='custom'
  servings?: number;       // Number of servings
  notes?: string;          // Optional notes for the meal
}
```

#### **ShoppingList**
```typescript
interface ShoppingList extends BaseEntity {
  title?: string;
  status: 'active' | 'archived';
  categoryProfileId: string;  // Reference to CategoryProfile.id
  sourceRefs: {
    mealPlanIds: string[];
    recipeIds: string[];
  };
  items: ShoppingListItem[];
}
```

#### **ShoppingListItem**
```typescript
interface ShoppingListItem {
  label: string;           // Ingredient name (normalized)
  quantity: string;        // String to handle fractions and ranges
  unit?: string;           // Unit of measurement
  category?: string;       // Category from profile
  checked: boolean;        // Completion status
  relatedRecipeIds?: string[]; // Track which recipes contributed this item
}
```

#### **CategoryProfile**
```typescript
interface CategoryProfile extends BaseEntity {
  name: string;
  buckets: string[];       // User-defined category sets (e.g., ["Produce", "Dairy", "Meat"])
}
```

### **Recipe Integration**

The existing `Recipe` interface will be retrofitted to extend `BaseEntity`:

```typescript
interface Recipe extends BaseEntity {
  // Existing fields remain unchanged
  title: string;
  description?: string;
  // ... all existing Recipe fields
}
```

**Migration Note**: Existing recipes will receive `ownerId` (defaulting to `localUserId`) and `schemaVersion` during the first load after this phase deployment.

---

## 🗄️ **Storage & Data Access Layer (DAL)**

### **DAL Architecture**

The UI will call a Data Access Layer exclusively; no direct localStorage usage in components.

#### **DAL Interfaces**

```typescript
// Meal Plans DAL
interface MealPlansDAL {
  listByOwner(ownerId: string): Promise<MealPlan[]>;
  get(id: string): Promise<MealPlan | null>;
  create(payload: Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<MealPlan>;
  update(id: string, patch: Partial<MealPlan>): Promise<MealPlan>;
  delete(id: string): Promise<void>;
}

// Shopping Lists DAL
interface ShoppingListsDAL {
  listByOwner(ownerId: string): Promise<ShoppingList[]>;
  get(id: string): Promise<ShoppingList | null>;
  createFromSources(
    sources: { mealPlanIds?: string[]; recipeIds?: string[] },
    opts?: { scaling?: number; categoryProfileId?: string }
  ): Promise<ShoppingList>;
  update(id: string, patch: Partial<ShoppingList>): Promise<ShoppingList>;
  delete(id: string): Promise<void>;
}

// Category Profiles DAL
interface CategoryProfilesDAL {
  listByOwner(ownerId: string): Promise<CategoryProfile[]>;
  create(payload: Omit<CategoryProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<CategoryProfile>;
  update(id: string, patch: Partial<CategoryProfile>): Promise<CategoryProfile>;
  delete(id: string): Promise<void>;
}

// Settings DAL
interface SettingsDAL {
  exportAll(): Promise<string>;  // JSON export of all user data
  importAll(json: string): Promise<void>;  // Import from JSON
}
```

### **Local User ID Management**

```typescript
// Stable localUserId generation and management
const LOCAL_USER_ID_KEY = 'app.localUserId';

const getLocalUserId = (): string => {
  let localUserId = localStorage.getItem(LOCAL_USER_ID_KEY);
  if (!localUserId) {
    localUserId = generateId(); // Use existing generateId utility
    localStorage.setItem(LOCAL_USER_ID_KEY, localUserId);
  }
  return localUserId;
};

// Dev-only utility for resetting local user ID
const resetLocalUserId = (): void => {
  localStorage.removeItem(LOCAL_USER_ID_KEY);
  // Clear all user data
  localStorage.removeItem('myRecipesData');
  localStorage.removeItem('mealPlansData');
  localStorage.removeItem('shoppingListsData');
  localStorage.removeItem('categoryProfilesData');
};
```

### **Recipes DAL Adapter**

To avoid breaking existing functionality, create an adapter that wraps current storage utilities:

```typescript
class RecipesDALAdapter implements RecipesDAL {
  listByOwner(ownerId: string): Promise<Recipe[]> {
    const recipes = loadRecipesWithMigration();
    // Add ownerId and schemaVersion to existing recipes if missing
    return Promise.resolve(migrateRecipesToAccountReady(recipes, ownerId));
  }
  
  // ... other methods wrap existing storage functions
}
```

### **Storage Namespacing**

- **Recipes**: `myRecipesData` (existing)
- **Meal Plans**: `mealPlansData`
- **Shopping Lists**: `shoppingListsData`
- **Category Profiles**: `categoryProfilesData`
- **Settings**: `appSettings`

### **Schema Versioning**

All entities include `schemaVersion` field for future migration support. Initial version: `"1.0"`.

---

## 🔧 **Ingredient Normalization & Merge Rules**

### **Normalization Engine**

A deterministic normalizer handles ingredient processing during shopping list generation:

```typescript
interface IngredientNormalizer {
  normalize(ingredient: string): {
    label: string;    // Canonical name
    quantity: string; // Normalized quantity
    unit?: string;    // Canonical unit
  };
  
  canMerge(item1: ShoppingListItem, item2: ShoppingListItem): boolean;
  merge(item1: ShoppingListItem, item2: ShoppingListItem): ShoppingListItem;
}
```

### **Normalization Rules**

1. **Basic Singularization**: "onions" → "onion", "tomatoes" → "tomato"
2. **Unit Alias Mapping**: "tbsp" → "tablespoon", "oz" → "ounce"
3. **Synonym Mapping**: "green onion" → "scallion", "ground beef" → "beef, ground"

### **Merge Logic**

- **Same Label + Same Unit**: Merge quantities and combine related recipe IDs
- **Same Label + Different Units**: Keep separate items but group visually
- **Manual Override**: Allow users to manually merge items during list editing

### **Configuration Files**

```typescript
// Normalization maps (easily extensible)
const UNIT_ALIASES = {
  'tbsp': 'tablespoon',
  'tsp': 'teaspoon',
  'oz': 'ounce',
  // ... more mappings
};

const INGREDIENT_SYNONYMS = {
  'green onion': 'scallion',
  'ground beef': 'beef, ground',
  // ... more mappings
};

const SINGULAR_FORMS = {
  'onions': 'onion',
  'tomatoes': 'tomato',
  // ... more mappings
};
```

---

## 🎨 **UX & User Flows**

### **Meal Plan Management**

#### **Main Meal Plan Page**
- **View Toggle**: Calendar (week grid) ↔ List view
- **Date Navigation**: Previous/next week with current week indicator
- **Quick Add**: "Add Meal" button for current day
- **Template Actions**: Save current plan as template, load existing template
- **Filtering**: Filter by tags, favorites, date range

#### **Meal Entry Creation**
- **Recipe Selection**: Browse and search existing recipes
- **Custom Meals**: Free-text input for non-recipe meals
- **Meal Slot Assignment**: Choose from breakfast, lunch, dinner, snack, other
- **Servings**: Adjust serving size for recipe scaling
- **Notes**: Optional notes for meal-specific instructions

#### **Template Management**
- **Save as Template**: Convert any meal plan to reusable template
- **Template Library**: Browse and apply saved templates
- **Template Editing**: Modify template structure and content

### **Shopping List Generation**

#### **Generation Flow**
1. **Source Selection**: Choose meal plans and/or individual recipes
2. **Options Configuration**: Set scaling factor, select category profile
3. **Preview Generation**: Review generated list before saving
4. **Save & Edit**: Create list and allow immediate editing

#### **Shopping List Interface**
- **Category Organization**: Group items by selected category profile
- **Inline Editing**: Click to edit quantity, unit, or label
- **Check Off Items**: Mark items as purchased
- **Add Custom Items**: Insert items not from recipes
- **Search & Filter**: Find specific items or categories

#### **Export Options**
- **Print View**: Clean, print-friendly layout
- **Copy to Clipboard**: Plain text format for external apps
- **Category Grouping**: Optional grouping by store sections

### **Quick Actions Integration**

#### **Recipe Card Actions**
- **"Add to Meal Plan"**: Modal with date/meal slot selection
- **"Add to Shopping List"**: Modal with scaling and category profile options

#### **Recipe Detail Actions**
- **Same modal-based actions** with additional context (recipe servings, cook time)
- **Quick links** to full meal plan and shopping list pages

---

## ⚡ **Caching & Performance**

### **Shopping List Caching**

Cache generated shopping lists using a composite key:

```typescript
interface CacheKey {
  sourceIds: string[];           // Meal plan IDs + recipe IDs
  scaling: number;               // Scaling factor
  categoryProfileId: string;     // Selected category profile
}

const generateCacheKey = (sources: SourceRefs, scaling: number, categoryProfileId: string): string => {
  const keyData = {
    sourceIds: [...sources.mealPlanIds, ...sources.recipeIds].sort(),
    scaling,
    categoryProfileId
  };
  return btoa(JSON.stringify(keyData)); // Simple base64 encoding
};
```

### **Cache Invalidation**

- **Recipe Updates**: Invalidate lists containing modified recipes
- **Meal Plan Changes**: Invalidate lists generated from modified plans
- **Category Profile Updates**: Invalidate lists using modified profiles
- **Manual Refresh**: User-triggered cache clearing

### **Performance Optimizations**

- **Lazy Loading**: Load meal plans and shopping lists on demand
- **Virtual Scrolling**: For large shopping lists
- **Debounced Search**: Real-time filtering with debounced input
- **Memoized Calculations**: Cache ingredient normalization results

---

## 🛡️ **Error Handling**

### **Data Integrity**

- **Missing Recipe References**: Surface non-blocking warnings when meal entries reference deleted recipes
- **Malformed Quantities**: Gracefully handle invalid quantity strings without crashing
- **Storage Failures**: Provide clear error messages and fallback options

### **User Experience**

- **Graceful Degradation**: App remains functional even with data inconsistencies
- **Clear Error Messages**: User-friendly error descriptions with suggested actions
- **Recovery Options**: Allow users to fix or skip problematic entries

### **Error Scenarios**

```typescript
interface ErrorHandling {
  missingRecipe: (recipeId: string) => {
    showWarning: true;
    message: `Recipe "${recipeId}" not found. This meal entry will be skipped.`;
    action: 'skip' | 'remove' | 'replace';
  };
  
  invalidQuantity: (quantity: string) => {
    fallback: '1'; // Default to quantity of 1
    logError: true;
  };
  
  storageError: (operation: string) => {
    message: `Failed to ${operation}. Please try again.`;
    retryable: true;
  };
}
```

---

## ♿ **Accessibility**

### **Keyboard Navigation**

- **Tab Order**: Logical tab sequence through all interactive elements
- **Keyboard Shortcuts**: Quick access to common actions
- **Focus Management**: Clear focus indicators and logical focus flow

### **Screen Reader Support**

- **ARIA Labels**: Descriptive labels for all form controls and interactive elements
- **Live Regions**: Announce dynamic content changes (list updates, errors)
- **Semantic HTML**: Proper heading structure and landmark elements

### **Modal Accessibility**

- **Focus Trap**: Keep focus within modal dialogs
- **Escape Key**: Close modals with Escape key
- **Focus Return**: Return focus to trigger element when modal closes

---

## ⚠️ **Risks & Mitigations**

### **Technical Risks**

| Risk | Impact | Mitigation |
|------|--------|------------|
| Ingredient parsing ambiguity | Medium | Keep normalizer transparent and allow manual overrides |
| Category profile sprawl | Low | Provide default profiles and template/cloning features |
| DAL/API signature drift | High | Lock DAL interfaces and use TypeScript for enforcement |
| Performance with large datasets | Medium | Implement pagination and virtual scrolling |

### **User Experience Risks**

| Risk | Impact | Mitigation |
|------|--------|------------|
| Complex meal planning workflow | Medium | Provide templates and guided setup |
| Shopping list generation confusion | Low | Clear preview and editing capabilities |
| Data migration complexity | High | Comprehensive testing and rollback procedures |

### **Data Migration Risks**

| Risk | Impact | Mitigation |
|------|--------|------------|
| Account migration failures | High | Robust validation and error recovery |
| Data loss during migration | Critical | Backup procedures and rollback capabilities |
| ID collision handling | Medium | Collision detection and resolution strategies |

---

## 🧪 **Testing & Quality Assurance**

### **Unit Tests**

- **Ingredient Normalizer**: Test normalization rules and edge cases
- **Merge Logic**: Verify duplicate detection and merging behavior
- **DAL Operations**: Test all CRUD operations and error scenarios
- **Cache Management**: Validate cache key generation and invalidation

### **Integration Tests**

- **End-to-End Flows**: Complete meal plan creation and shopping list generation
- **Data Migration**: Test recipe retrofitting and new entity creation
- **Cross-Browser**: Verify functionality across Chrome, Firefox, Safari, Edge

### **Demo Data & Fixtures**

```typescript
// Development flag for demo data
const DEMO_DATA_FLAG = 'enableDemoData';

const loadDemoData = () => {
  if (process.env.NODE_ENV === 'development' && localStorage.getItem(DEMO_DATA_FLAG)) {
    // Load sample meal plans, shopping lists, and category profiles
    loadSampleMealPlans();
    loadSampleShoppingLists();
    loadSampleCategoryProfiles();
  }
};
```

### **Test Scenarios**

1. **Basic Meal Planning**: Create plan, add meals, save template
2. **Shopping List Generation**: Generate from meal plan, edit items, export
3. **Data Migration**: Verify existing recipes work with new architecture
4. **Error Handling**: Test missing recipes, invalid data, storage failures
5. **Performance**: Large meal plans, extensive shopping lists

---

## 🔄 **Migration Posture (Future Authentication)**

### **Account Integration Strategy**

When authentication is implemented in future phases:

#### **Local User ID Replacement**
- Replace `localUserId` with authenticated `userId` in place
- Update all entity `ownerId` fields atomically
- Maintain data integrity throughout the process

#### **Import/Merge Workflow**
1. **Account Creation**: New user creates account
2. **Local Data Detection**: System detects existing local data
3. **Import Prompt**: Offer to import local data into account
4. **Conflict Resolution**: Handle ID collisions gracefully
5. **Data Migration**: Transfer all local data to account ownership

#### **DAL Evolution**
```typescript
// Future Remote DAL implementation
class RemoteDAL implements MealPlansDAL {
  constructor(private apiClient: ApiClient) {}
  
  async listByOwner(ownerId: string): Promise<MealPlan[]> {
    return this.apiClient.get(`/meal-plans?ownerId=${ownerId}`);
  }
  
  // ... other methods use API calls instead of localStorage
}
```

#### **Migration Considerations**
- **One-Time Import**: Local data import only happens once during first login
- **Server + Local Merge**: Handle merging server data with local changes
- **Rollback Capability**: Allow reverting to local-only mode if needed
- **Data Validation**: Comprehensive validation before and after migration

---

## 📋 **Implementation Checklist**

### **Foundation & Architecture**
- [ ] Create `BaseEntity` interface and update existing `Recipe` interface
- [ ] Implement DAL abstraction with local storage adapters
- [ ] Create `localUserId` generation and management system
- [ ] Set up storage namespacing and schema versioning
- [ ] Create Recipes DAL adapter to wrap existing storage functions

### **Data Models & Types**
- [ ] Define `MealPlan`, `MealEntry`, `ShoppingList`, `ShoppingListItem`, `CategoryProfile` interfaces
- [ ] Create TypeScript types for all DAL interfaces
- [ ] Implement data validation schemas for all entities
- [ ] Create utility functions for entity operations

### **Ingredient Normalization**
- [ ] Implement ingredient normalizer with basic rules
- [ ] Create unit alias and synonym mapping files
- [ ] Build merge logic for shopping list items
- [ ] Add manual override capabilities for edge cases

### **Meal Plan Management**
- [ ] Create meal plan list and detail views
- [ ] Implement calendar and list view toggles
- [ ] Build meal entry creation and editing forms
- [ ] Add template save/load functionality
- [ ] Implement tagging and filtering for meal plans

### **Shopping List Generation**
- [ ] Build shopping list generation engine
- [ ] Create source selection interface (meal plans + recipes)
- [ ] Implement scaling and category profile options
- [ ] Add preview and editing capabilities
- [ ] Create export functionality (print, clipboard)

### **Category Profile Management**
- [ ] Build category profile creation and editing
- [ ] Implement default category profiles
- [ ] Add profile template and cloning features
- [ ] Create profile selection interface

### **Quick Actions Integration**
- [ ] Add "Add to Meal Plan" modals to recipe cards and detail pages
- [ ] Add "Add to Shopping List" modals to recipe cards and detail pages
- [ ] Implement modal form validation and submission
- [ ] Add quick links to full meal plan and shopping list pages

### **Caching & Performance**
- [ ] Implement shopping list caching system
- [ ] Add cache invalidation logic
- [ ] Create performance monitoring and optimization
- [ ] Add virtual scrolling for large lists

### **Error Handling & Validation**
- [ ] Implement comprehensive error handling for all DAL operations
- [ ] Add data validation for all entity operations
- [ ] Create user-friendly error messages and recovery options
- [ ] Add logging and monitoring for debugging

### **Accessibility & UX**
- [ ] Ensure keyboard navigation for all interfaces
- [ ] Add ARIA labels and screen reader support
- [ ] Implement focus management for modals
- [ ] Test responsive design across devices

### **Testing & Demo Data**
- [ ] Create comprehensive unit tests for core functionality
- [ ] Add integration tests for complete user flows
- [ ] Implement demo data loading with development flag
- [ ] Test cross-browser compatibility

### **Documentation & Migration**
- [ ] Update data model documentation
- [ ] Create migration procedures for future authentication
- [ ] Document DAL interfaces and usage patterns
- [ ] Add troubleshooting guides for common issues

---

## 🔗 **Dependencies & Follow-ups**

### **Immediate Dependencies**
- Existing recipe management system (Phase 1 & 2)
- LocalStorage-based data persistence
- React Context API for state management
- Tailwind CSS for styling

### **Future Phase Integration**
- **Phase 3: AI Assistant Foundation** - Can leverage meal plan data for suggestions
- **Phase 4: Accounts & Sync** - Will use the account-ready data architecture
- **Phase 5: Sharing & Collaboration** - Can extend meal plan sharing capabilities

### **Documentation Updates Required**
- Update `/docs/roadmap.md` to include this phase and future planned phases:
  - Phase 2: Quality & Templates
  - Phase 3: Accounts & Sync  
  - Phase 4: Sharing & Collaboration
  - Phase 5: Integrations & AI
- Create or update `/docs/technical/data-models/meal-plans-and-lists.md` to ensure consistency with this spec

---

## 📊 **Success Metrics**

### **Functionality Metrics**
- ✅ Complete meal plan creation and management
- ✅ Successful shopping list generation from multiple sources
- ✅ Ingredient normalization and merging working correctly
- ✅ Template system functional with save/load capabilities
- ✅ Quick actions integrated seamlessly with existing recipe interface

### **Performance Metrics**
- ✅ Shopping list generation completes within 2 seconds for typical meal plans
- ✅ Large meal plans (30+ entries) render smoothly with virtual scrolling
- ✅ Cache hit rate >80% for repeated shopping list generations
- ✅ No memory leaks during extended usage sessions

### **User Experience Metrics**
- ✅ Intuitive meal planning workflow with minimal learning curve
- ✅ Shopping list editing feels natural and responsive
- ✅ Error handling provides clear guidance for issue resolution
- ✅ Accessibility compliance meets WCAG 2.1 AA standards

### **Technical Metrics**
- ✅ All DAL operations complete successfully with proper error handling
- ✅ Data migration from existing recipes works without data loss
- ✅ Account-ready architecture supports future authentication integration
- ✅ Cross-browser compatibility maintained across all major browsers

---

## 📝 **Changelog**

### **2025-01-15 - Phase Spec Creation**
- Created comprehensive Phase Spec for Meal Plans & Shopping Lists
- Defined account-ready data architecture with BaseEntity pattern
- Specified DAL abstraction with local storage adapters
- Detailed ingredient normalization and shopping list generation requirements
- Outlined UX flows for meal planning and shopping list management
- Documented migration strategy for future authentication integration
- Included comprehensive testing and quality assurance requirements

---

*This document serves as the definitive specification for the Meal Plans & Shopping Lists phase implementation.*  
*Last Updated: 2025-01-15*  
*Status: 📋 PLANNED*
