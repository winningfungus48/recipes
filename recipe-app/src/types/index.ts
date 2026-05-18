/** Application data model — v2 storage */

export interface Ingredient {
  amount: number
  unit: string
  name: string
  notes?: string
}

export interface RecipeSection {
  label: string
  ingredients: Ingredient[]
  instructions: string[]
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface Recipe {
  id: string
  title: string
  description?: string
  image?: string
  rating?: number
  cookTime?: string
  prepTime?: string
  servings: number
  difficulty?: Difficulty
  cuisine?: string
  source?: string
  lastCooked?: string
  tags: string[]
  sections: RecipeSection[]
  createdAt: string
  updatedAt: string
}

export interface Cookbook {
  id: string
  name: string
  description?: string
  coverImage?: string
  recipeIds: string[]
  createdAt: string
  updatedAt: string
}

export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export interface MealPlan {
  id: string
  name: string
  days: {
    monday: string[]
    tuesday: string[]
    wednesday: string[]
    thursday: string[]
    friday: string[]
    saturday: string[]
    sunday: string[]
  }
  createdAt: string
}

export interface ShoppingListItem {
  ingredient: Ingredient
  recipeIds: string[]
  checked: boolean
  category?: string
}

export interface AppStorage {
  version: 2
  recipes: Recipe[]
  cookbooks: Cookbook[]
  mealPlans: MealPlan[]
}

/** Legacy array item shape (pre-v2) — flexible for migration */
export interface LegacyRecipeSection {
  label: string
  ingredients: string[]
  instructions: string[]
}

export interface LegacyRecipe {
  id: string
  title: string
  description?: string
  image?: string
  rating?: number
  cookTime?: string
  prepTime?: string
  difficulty?: Difficulty
  source?: string
  lastCooked?: string
  tags?: string[]
  notes?: string
  category?: string
  ingredients?: string[]
  instructions?: string
  sections?: LegacyRecipeSection[]
  createdAt: string
  updatedAt?: string
  isFavorite?: boolean
  servings?: number
  cuisine?: string
  [key: string]: unknown
}
