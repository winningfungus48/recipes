import { Recipe, Category } from '../types/recipe'

export interface ParsedRecipe {
  title: string
  ingredients: string[]
  instructions: string
  cookTime: string
  prepTime?: string
  category: Category
  tags: string[]
  notes: string
  rating: number
  difficulty?: string
  source?: string
  isFavorite?: boolean
  image?: string
}

export interface ParseResult {
  recipes: ParsedRecipe[]
  errors: ParseError[]
  duplicates: string[]
}

export interface ParseError {
  row: number
  title: string
  error: string
  data: any
}

// Category mapping from CSV values to our schema
const CATEGORY_MAPPING: Record<string, Category> = {
  'Meals - Breakfast': 'Breakfast',
  'Meals - Lunch/Dinner': 'Lunch/Dinner',
  'Appetizers & Sides': 'Appetizers',
  'Appetizers': 'Appetizers',
  'Drinks': 'Drinks',
  'Desserts': 'Desserts',
  'Archived': 'Other',
  'Other': 'Other'
}

/**
 * Parse a CSV file content into structured recipe data
 * @param content - Raw CSV file content
 * @param filename - Name of the source file for error reporting
 * @returns ParseResult with recipes, errors, and duplicates
 */
export function parseCSVContent(content: string, filename: string): ParseResult {
  const lines = content.split('\n').filter(line => line.trim())
  const recipes: ParsedRecipe[] = []
  const errors: ParseError[] = []
  const duplicates = new Set<string>()
  
  if (lines.length < 2) {
    errors.push({
      row: 0,
      title: 'File',
      error: 'No data found in file',
      data: { filename }
    })
    return { recipes, errors, duplicates: [] }
  }

  // Parse header row
  const headers = parseCSVLine(lines[0])
  const headerMap = createHeaderMap(headers)
  
  // Process each recipe row
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i])
      
      if (values.length !== headers.length) {
        errors.push({
          row: i + 1,
          title: values[0] || 'Unknown',
          error: `Column count mismatch. Expected ${headers.length}, got ${values.length}`,
          data: { values, headers }
        })
        continue
      }

      const recipe = parseRecipeRow(values, headerMap, i + 1)
      
      if (!recipe) {
        continue // Error already logged in parseRecipeRow
      }

      // Check for duplicates
      const titleKey = recipe.title.toLowerCase().trim()
      if (duplicates.has(titleKey)) {
        errors.push({
          row: i + 1,
          title: recipe.title,
          error: 'Duplicate title found',
          data: { filename }
        })
        continue
      }
      
      duplicates.add(titleKey)
      recipes.push(recipe)
      
    } catch (error) {
      errors.push({
        row: i + 1,
        title: 'Parse Error',
        error: error instanceof Error ? error.message : 'Unknown parsing error',
        data: { line: lines[i] }
      })
    }
  }

  return {
    recipes,
    errors,
    duplicates: Array.from(duplicates)
  }
}

/**
 * Parse a single CSV line, handling quoted fields and commas
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"'
        i++ // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  fields.push(current.trim())
  return fields
}

/**
 * Create a mapping from header names to column indices
 */
function createHeaderMap(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {}
  
  headers.forEach((header, index) => {
    const normalized = header.toLowerCase().trim()
    map[normalized] = index
    
    // Handle common variations
    if (normalized.includes('cook') && normalized.includes('time')) {
      map['cooktime'] = index
    }
    if (normalized.includes('prep') && normalized.includes('time')) {
      map['preptime'] = index
    }
  })
  
  return map
}

/**
 * Parse a single recipe row into a ParsedRecipe object
 */
function parseRecipeRow(
  values: string[], 
  headerMap: Record<string, number>, 
  rowNumber: number
): ParsedRecipe | null {
  // Get field values with fallbacks
  const getField = (fieldName: string, required = false): string => {
    const index = headerMap[fieldName.toLowerCase()]
    const value = index !== undefined ? values[index] : ''
    
    if (required && !value.trim()) {
      throw new Error(`Required field '${fieldName}' is missing`)
    }
    
    return value.trim()
  }

  try {
    // Validate required fields
    const title = getField('title', true)
    const ingredients = getField('ingredients', true)
    const instructions = getField('instructions', true)
    
    if (!title || !ingredients || !instructions) {
      throw new Error('Missing required fields: title, ingredients, or instructions')
    }

    // Parse ingredients array
    const ingredientsArray = ingredients
      .split(/[;,\n]/)
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0)

    // Parse tags array
    const tagsString = getField('tags')
    const tagsArray = tagsString
      .split(/[;,\n]/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    // Map category
    const categoryString = getField('category')
    const category = mapCategory(categoryString)

    // Parse rating
    const ratingString = getField('rating')
    const rating = parseFloat(ratingString) || 0

    // Parse cook time
    const cookTime = getField('cooktime') || getField('cook time') || ''

    return {
      title,
      ingredients: ingredientsArray,
      instructions,
      cookTime,
      prepTime: getField('preptime') || getField('prep time') || undefined,
      category,
      tags: tagsArray,
      notes: getField('notes'),
      rating: Math.max(0, Math.min(5, rating)), // Clamp between 0-5
      difficulty: getField('difficulty') || undefined,
      source: getField('source') || undefined,
      isFavorite: getField('favorite') === 'true' || getField('isfavorite') === 'true',
      image: getField('image') || undefined
    }
    
  } catch (error) {
    console.error(`Error parsing row ${rowNumber}:`, error)
    return null
  }
}

/**
 * Map CSV category string to our Category type
 */
function mapCategory(categoryString: string): Category {
  const normalized = categoryString.trim()
  
  // Direct mapping
  if (normalized in CATEGORY_MAPPING) {
    return CATEGORY_MAPPING[normalized]
  }
  
  // Fuzzy matching for common variations
  const lower = normalized.toLowerCase()
  
  if (lower.includes('breakfast') || lower.includes('morning')) {
    return 'Breakfast'
  }
  if (lower.includes('lunch') || lower.includes('dinner') || lower.includes('main')) {
    return 'Lunch/Dinner'
  }
  if (lower.includes('dessert') || lower.includes('sweet')) {
    return 'Desserts'
  }
  if (lower.includes('appetizer') || lower.includes('side') || lower.includes('snack')) {
    return 'Appetizers'
  }
  if (lower.includes('drink') || lower.includes('beverage') || lower.includes('cocktail')) {
    return 'Drinks'
  }
  
  // Default to Other for unmatched categories
  return 'Other'
}

/**
 * Convert ParsedRecipe to Recipe format for storage
 */
export function convertToRecipe(parsedRecipe: ParsedRecipe): Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    title: parsedRecipe.title,
    ingredients: parsedRecipe.ingredients,
    instructions: parsedRecipe.instructions,
    cookTime: parsedRecipe.cookTime,
    prepTime: parsedRecipe.prepTime,
    category: parsedRecipe.category,
    tags: parsedRecipe.tags,
    notes: parsedRecipe.notes,
    rating: parsedRecipe.rating,
    difficulty: parsedRecipe.difficulty as any, // Will be validated by Recipe type
    source: parsedRecipe.source,
    lastCooked: undefined,
    isFavorite: parsedRecipe.isFavorite || false,
    image: parsedRecipe.image
  }
}
