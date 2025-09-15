import { Recipe, RecipeSection, hasLegacyFormat, hasSections } from '../types/recipe'

const STORAGE_KEY = 'myRecipesData'

export const saveRecipes = (recipes: Recipe[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes))
  } catch (error) {
    console.error('Failed to save recipes to localStorage:', error)
  }
}

export const loadRecipes = (): Recipe[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const parsed = JSON.parse(stored)
    
    // Validate that parsed data is an array
    if (!Array.isArray(parsed)) {
      console.error('Invalid data format in localStorage - expected array, got:', typeof parsed)
      return []
    }
    
    // Validate each recipe has required fields
    const validRecipes = parsed.filter(recipe => {
      if (!recipe || typeof recipe !== 'object') return false
      if (!recipe.id || !recipe.title) return false
      return true
    })
    
    if (validRecipes.length !== parsed.length) {
      console.warn(`Filtered out ${parsed.length - validRecipes.length} invalid recipes`)
    }
    
    return validRecipes
  } catch (error) {
    console.error('Failed to load recipes from localStorage:', error)
    return []
  }
}

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const createRecipe = (formData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Recipe => {
  const now = new Date().toISOString()
  return {
    ...formData,
    id: generateId(),
    createdAt: now,
    updatedAt: now
  }
}

export const updateRecipe = (recipe: Recipe): Recipe => {
  return {
    ...recipe,
    updatedAt: new Date().toISOString()
  }
}

/**
 * Converts a legacy recipe (with ingredients/instructions arrays) to sections format
 */
export const migrateRecipeToSections = (recipe: Recipe): Recipe => {
  // If recipe already has sections, return as-is
  if (hasSections(recipe)) {
    return recipe
  }

  // If recipe has legacy format, convert to sections
  if (hasLegacyFormat(recipe)) {
    const mainSection: RecipeSection = {
      label: 'Main',
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      instructions: typeof recipe.instructions === 'string' 
        ? recipe.instructions.split('\n').filter(step => step.trim()) 
        : []
    }

    return {
      ...recipe,
      sections: [mainSection]
    }
  }

  // If recipe has no legacy data, create empty main section
  return {
    ...recipe,
    sections: [{
      label: 'Main',
      ingredients: [],
      instructions: []
    }]
  }
}

/**
 * Migrates all recipes in storage to sections format
 */
export const migrateAllRecipesToSections = (): Recipe[] => {
  try {
    const recipes = loadRecipes()
    const migratedRecipes = recipes.map(recipe => {
      try {
        return migrateRecipeToSections(recipe)
      } catch (error) {
        console.error('Failed to migrate recipe:', recipe.title, error)
        // Return recipe as-is if migration fails
        return recipe
      }
    })
    
    // Save migrated recipes back to storage
    saveRecipes(migratedRecipes)
    
    return migratedRecipes
  } catch (error) {
    console.error('Failed to migrate recipes:', error)
    // Return empty array if migration completely fails
    return []
  }
}

/**
 * Loads recipes and automatically migrates them if needed
 */
export const loadRecipesWithMigration = (): Recipe[] => {
  const recipes = loadRecipes()
  
  // Check if any recipes need migration
  const needsMigration = recipes.some(recipe => hasLegacyFormat(recipe) && !hasSections(recipe))
  
  if (needsMigration) {
    console.log('Migrating recipes to sections format...')
    return migrateAllRecipesToSections()
  }
  
  return recipes
}

/**
 * Combines ingredients from all sections into a single array
 */
export const getCombinedIngredients = (recipe: Recipe): string[] => {
  // If recipe has sections, combine all section ingredients
  if (hasSections(recipe) && recipe.sections) {
    const sectionIngredients = recipe.sections.flatMap(section => section.ingredients)
    return sectionIngredients.filter(ingredient => ingredient.trim() !== '')
  }
  
  // Fallback to legacy ingredients
  return recipe.ingredients.filter(ingredient => ingredient.trim() !== '')
}

/**
 * Gets all section labels for a recipe
 */
export const getSectionLabels = (recipe: Recipe): string[] => {
  if (hasSections(recipe) && recipe.sections) {
    return recipe.sections.map(section => section.label).filter(label => label.trim() !== '')
  }
  return []
}

/**
 * Gets sectioned instructions for display
 */
export const getSectionedInstructions = (recipe: Recipe): Array<{
  label: string
  instructions: string[]
}> => {
  if (hasSections(recipe) && recipe.sections) {
    return recipe.sections
      .filter(section => section.instructions.length > 0)
      .map(section => ({
        label: section.label || 'Main',
        instructions: section.instructions.filter(instruction => instruction.trim() !== '')
      }))
  }
  
  // Fallback to legacy instructions
  if (recipe.instructions) {
    const instructions = recipe.instructions.split('\n').filter(instruction => instruction.trim() !== '')
    return instructions.length > 0 ? [{ label: 'Main', instructions }] : []
  }
  
  return []
}

/**
 * Searches a recipe for a given query across all searchable content
 */
export const searchRecipe = (recipe: Recipe, query: string): boolean => {
  if (!query.trim()) return true
  
  const searchLower = query.toLowerCase()
  
  // Search in title
  if (recipe.title.toLowerCase().includes(searchLower)) {
    return true
  }
  
  // Search in tags
  if (recipe.tags.some(tag => tag.toLowerCase().includes(searchLower))) {
    return true
  }
  
  // Search in legacy ingredients (for backward compatibility)
  if (recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchLower))) {
    return true
  }
  
  // Search in legacy instructions (for backward compatibility)
  if (recipe.instructions.toLowerCase().includes(searchLower)) {
    return true
  }
  
  // Search in sections
  if (hasSections(recipe) && recipe.sections) {
    return recipe.sections.some(section => {
      // Search in section label
      if (section.label.toLowerCase().includes(searchLower)) {
        return true
      }
      
      // Search in section ingredients
      if (section.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchLower))) {
        return true
      }
      
      // Search in section instructions
      if (section.instructions.some(instruction => instruction.toLowerCase().includes(searchLower))) {
        return true
      }
      
      return false
    })
  }
  
  return false
}

/**
 * Validates section labels for duplicates within a recipe
 */
export const validateSectionLabels = (sections: RecipeSection[]): {
  isValid: boolean
  errors: string[]
  duplicateLabels: string[]
} => {
  const errors: string[] = []
  const duplicateLabels: string[] = []
  
  if (!sections || sections.length === 0) {
    return { isValid: true, errors, duplicateLabels }
  }
  
  // Track label counts (case-insensitive)
  const labelCounts = new Map<string, number>()
  
  sections.forEach((section) => {
    const label = section.label.trim()
    
    // Skip empty labels (they're allowed)
    if (!label) return
    
    const labelLower = label.toLowerCase()
    const currentCount = labelCounts.get(labelLower) || 0
    labelCounts.set(labelLower, currentCount + 1)
    
    // If this is the second occurrence, it's a duplicate
    if (currentCount === 1) {
      duplicateLabels.push(label)
      errors.push(`Section label "${label}" is used multiple times`)
    }
  })
  
  return {
    isValid: errors.length === 0,
    errors,
    duplicateLabels
  }
}

/**
 * Gets validation errors for a specific section label
 */
export const getSectionLabelValidationError = (
  sections: RecipeSection[], 
  currentSectionIndex: number, 
  newLabel: string
): string | null => {
  if (!newLabel.trim()) return null // Empty labels are allowed
  
  const labelLower = newLabel.toLowerCase()
  
  // Check for duplicates (excluding current section)
  const hasDuplicate = sections.some((section, index) => 
    index !== currentSectionIndex && 
    section.label.toLowerCase() === labelLower
  )
  
  if (hasDuplicate) {
    return `Section label "${newLabel}" is already used`
  }
  
  return null
}
