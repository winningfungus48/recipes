export interface RecipeSection {
  label: string
  ingredients: string[]
  instructions: string[]
}

export interface Recipe {
  id: string
  title: string
  ingredients: string[] // DEPRECATED: Use sections[].ingredients instead
  instructions: string // DEPRECATED: Use sections[].instructions instead
  sections?: RecipeSection[] // Optional for backward compatibility
  cookTime: string
  prepTime?: string
  category: Category
  tags: string[]
  notes: string
  rating: number
  difficulty?: Difficulty
  source?: string
  lastCooked?: string
  isFavorite?: boolean
  image?: string
  createdAt: string
  updatedAt?: string
}

export type Category = 'Breakfast' | 'Lunch/Dinner' | 'Desserts' | 'Appetizers' | 'Drinks' | 'Other'
export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface RecipeFormData {
  title: string
  ingredients: string[] // DEPRECATED: Use sections[].ingredients instead
  instructions: string // DEPRECATED: Use sections[].instructions instead
  sections?: RecipeSection[] // Optional for backward compatibility
  cookTime: string
  prepTime?: string
  category: Category
  tags: string[]
  notes: string
  rating: number
  difficulty?: Difficulty
  source?: string
  lastCooked?: string
  isFavorite?: boolean
  image?: string
}

export interface FilterOptions {
  search: string
  category: Category | 'All'
  tags: string[]
  difficulty: Difficulty | 'All'
  rating: number
  hasImage: boolean
  isFavorite: boolean
  recentlyAdded: boolean
  sortBy: 'title' | 'rating' | 'createdAt' | 'cookTime' | 'prepTime'
  sortOrder: 'asc' | 'desc'
}

export interface ViewMode {
  type: 'grid' | 'list'
}

export interface BulkImportRecipe {
  title: string
  ingredients: string[] // DEPRECATED: Use sections[].ingredients instead
  instructions: string // DEPRECATED: Use sections[].instructions instead
  sections?: RecipeSection[] // Optional for backward compatibility
  cookTime: string
  prepTime?: string
  category: Category
  tags: string[]
  notes: string
  rating: number
  difficulty?: Difficulty
  source?: string
  isFavorite?: boolean
}

export interface ImportPreview {
  recipes: BulkImportRecipe[]
  duplicates: string[]
  errors: string[]
}

// Utility types for working with sections
export interface SectionFormData {
  label: string
  ingredients: string[]
  instructions: string[]
}

export interface RecipeWithCombinedIngredients extends Recipe {
  combinedIngredients: string[] // Computed property for display
}

// Type guards for backward compatibility
export function hasLegacyFormat(recipe: Recipe): boolean {
  // Check if recipe has legacy format (ingredients as string array, instructions as string)
  // AND doesn't have sections (which indicates it's already migrated)
  return (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) && 
         (typeof recipe.instructions === 'string') &&
         !hasSections(recipe)
}

export function hasSections(recipe: Recipe): boolean {
  return !!(recipe.sections && recipe.sections.length > 0)
}
