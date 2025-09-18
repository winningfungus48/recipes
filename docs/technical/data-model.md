# 📋 Recipe Data Model

This document defines the canonical data structure for recipes in the recipe app, including the new sub-recipe sections support.

---

## 🏗️ **Core Recipe Schema**

### **Base Recipe Structure**

```typescript
interface Recipe {
  id: string;
  title: string;
  description?: string;
  image?: string;
  rating?: number;
  cookTime?: string;
  prepTime?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  source?: string;
  lastCooked?: string; // ISO date string
  tags: string[];
  sections: RecipeSection[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
```

### **Sub-Recipe Sections Structure**

```typescript
interface RecipeSection {
  label: string;           // Section name (e.g., "Crust", "Filling", "Main")
  ingredients: string[];   // Array of ingredient strings
  instructions: string[];  // Array of instruction steps
}
```

---

## 🔄 **Data Migration & Compatibility**

### **Legacy Recipe Conversion**

All existing recipes will be automatically converted to the sections format:

```typescript
// Before (legacy format)
{
  id: "recipe-1",
  title: "Chocolate Cake",
  ingredients: ["flour", "sugar", "eggs"],
  instructions: ["Mix ingredients", "Bake at 350°F"]
}

// After (sections format)
{
  id: "recipe-1",
  title: "Chocolate Cake",
  sections: [
    {
      label: "Main",
      ingredients: ["flour", "sugar", "eggs"],
      instructions: ["Mix ingredients", "Bake at 350°F"]
    }
  ]
}
```

### **Default Section Behavior**

- **Single Section**: If a recipe has only one section with label "Main", the label is hidden in the UI
- **Multiple Sections**: All section labels are displayed in the instructions area
- **Empty Sections**: Sections with empty ingredients/instructions arrays are allowed but should be handled gracefully

---

## 🎯 **UI/UX Behavior Specifications**

### **Display Logic**

1. **Combined Ingredient Summary**
   - Merge all section ingredients into a single list at the top of recipe view
   - No section labels shown in the summary
   - Maintain original order from sections

2. **Sectioned Instructions Display**
   - Show each section with its label as a heading
   - Display section-specific ingredients below the label
   - Show section-specific instructions below ingredients
   - Stack sections vertically in order

3. **Search Behavior**
   - Search across all section content (ingredients, instructions, labels)
   - Full-text matching within all sections
   - Recipe-level tags remain searchable

### **Editing Interface**

1. **Section Management**
   - "Add Section" button to create new sections
   - "Remove Section" button for each section (except when only one remains)
   - Inline editing of section labels, ingredients, and instructions
   - Dynamic reordering (future feature)

2. **Validation Rules**
   - Section labels are optional (default to "Main")
   - No duplicate labels within a single recipe
   - No character limits on labels (unless layout requires)
   - At least one section must exist per recipe

---

## 🔍 **Search & Filtering**

### **Search Scope**

The search functionality includes:

- ✅ **Section Labels**: "crust", "filling", "topping"
- ✅ **Section Ingredients**: All ingredients from all sections
- ✅ **Section Instructions**: All instruction steps from all sections
- ✅ **Recipe Tags**: Existing tag-based search
- ✅ **Recipe Title**: Main recipe title

### **Search Implementation**

```typescript
interface SearchableRecipe extends Recipe {
  searchableContent: string; // Combined text from all sections
}

// Search function should include:
// - title
// - all section labels
// - all section ingredients (joined)
// - all section instructions (joined)
// - tags (joined)
```

---

## 📊 **Data Persistence**

### **LocalStorage Structure**

```typescript
// LocalStorage key: "recipe-app-recipes"
interface StoredRecipes {
  recipes: Recipe[];
  lastUpdated: string;
  version: string; // For future migration support
}
```

### **Migration Strategy**

1. **Version 1.0**: Legacy single-section recipes
2. **Version 2.0**: Multi-section recipes with auto-conversion
3. **Future**: Additional schema enhancements

---

## 🧪 **Testing Considerations**

### **Test Cases**

1. **Data Migration**
   - Convert legacy recipes to sections format
   - Preserve all existing data
   - Handle edge cases (empty fields, malformed data)

2. **UI Display**
   - Single "Main" section hides label
   - Multiple sections show all labels
   - Combined ingredient summary works correctly
   - Sectioned instructions display properly

3. **Search Functionality**
   - Search finds content in all sections
   - Search results highlight relevant sections
   - Empty sections don't break search

4. **Validation**
   - Duplicate section labels are prevented
   - At least one section exists per recipe
   - Section labels are properly validated

---

## 🔮 **Future Enhancements**

### **Planned Features**

- **Collapsible Sections**: Expand/collapse individual sections
- **Section Reordering**: Drag-and-drop section ordering
- **Section-Level Metadata**: Individual timers, ratings per section
- **Section Templates**: Reusable section patterns
- **Bulk Import Support**: Multi-section recipe imports

### **Schema Extensions**

```typescript
// Future section enhancements
interface EnhancedRecipeSection extends RecipeSection {
  timer?: number;        // Section-specific cook time
  difficulty?: string;   // Section-specific difficulty
  notes?: string;       // Section-specific notes
  order?: number;       // Display order
}
```

---

*This document will be updated as the recipe data model evolves.*
