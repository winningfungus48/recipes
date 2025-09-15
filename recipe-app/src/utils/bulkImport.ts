import { BulkImportRecipe, ImportPreview, Recipe, Category, Difficulty } from '../types/recipe'

export const parseCSV = (csvContent: string): BulkImportRecipe[] => {
  const lines = csvContent.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const recipes: BulkImportRecipe[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    if (values.length !== headers.length) continue

    const recipe: BulkImportRecipe = {
      title: '',
      ingredients: [],
      instructions: '',
      cookTime: '',
      category: 'Lunch/Dinner',
      tags: [],
      notes: '',
      rating: 0
    }

    headers.forEach((header, index) => {
      const value = values[index]
      switch (header) {
        case 'title':
        case 'name':
          recipe.title = value
          break
        case 'ingredients':
          recipe.ingredients = value.split(';').map(ing => ing.trim()).filter(ing => ing)
          break
        case 'instructions':
        case 'steps':
          recipe.instructions = value
          break
        case 'cooktime':
        case 'cook_time':
          recipe.cookTime = value
          break
        case 'preptime':
        case 'prep_time':
          recipe.prepTime = value
          break
        case 'category':
          recipe.category = (value as Category) || 'Lunch/Dinner'
          break
        case 'tags':
          recipe.tags = value.split(';').map(tag => tag.trim()).filter(tag => tag)
          break
        case 'notes':
          recipe.notes = value
          break
        case 'rating':
          recipe.rating = parseInt(value) || 0
          break
        case 'difficulty':
          recipe.difficulty = (value as Difficulty) || undefined
          break
        case 'source':
          recipe.source = value
          break
        case 'favorite':
        case 'isfavorite':
          recipe.isFavorite = value.toLowerCase() === 'true' || value === '1'
          break
      }
    })

    if (recipe.title) {
      recipes.push(recipe)
    }
  }

  return recipes
}

export const parseJSON = (jsonContent: string): BulkImportRecipe[] => {
  try {
    const data = JSON.parse(jsonContent)
    if (Array.isArray(data)) {
      return data.map(item => ({
        title: item.title || '',
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
        instructions: item.instructions || '',
        cookTime: item.cookTime || '',
        prepTime: item.prepTime || undefined,
        category: (item.category as Category) || 'Lunch/Dinner',
        tags: Array.isArray(item.tags) ? item.tags : [],
        notes: item.notes || '',
        rating: item.rating || 0,
        difficulty: item.difficulty || undefined,
        source: item.source || undefined,
        isFavorite: item.isFavorite || false
      }))
    }
    return []
  } catch (error) {
    console.error('Error parsing JSON:', error)
    return []
  }
}

export const checkDuplicates = (importRecipes: BulkImportRecipe[], existingRecipes: Recipe[]): string[] => {
  const duplicates: string[] = []
  const existingTitles = existingRecipes.map(r => r.title.toLowerCase())

  importRecipes.forEach(recipe => {
    if (existingTitles.includes(recipe.title.toLowerCase())) {
      duplicates.push(recipe.title)
    }
  })

  return duplicates
}

export const validateRecipes = (recipes: BulkImportRecipe[]): string[] => {
  const errors: string[] = []

  recipes.forEach((recipe, index) => {
    if (!recipe.title.trim()) {
      errors.push(`Recipe ${index + 1}: Missing title`)
    }
    if (!recipe.ingredients.length) {
      errors.push(`Recipe ${index + 1}: Missing ingredients`)
    }
    if (!recipe.instructions.trim()) {
      errors.push(`Recipe ${index + 1}: Missing instructions`)
    }
    if (recipe.rating < 0 || recipe.rating > 5) {
      errors.push(`Recipe ${index + 1}: Invalid rating (must be 0-5)`)
    }
  })

  return errors
}

export const createImportPreview = (
  importRecipes: BulkImportRecipe[], 
  existingRecipes: Recipe[]
): ImportPreview => {
  const duplicates = checkDuplicates(importRecipes, existingRecipes)
  const errors = validateRecipes(importRecipes)

  return {
    recipes: importRecipes,
    duplicates,
    errors
  }
}

export const convertToRecipes = (importRecipes: BulkImportRecipe[]): Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>[] => {
  return importRecipes.map(recipe => ({
    ...recipe,
    isFavorite: recipe.isFavorite || false
  }))
}
