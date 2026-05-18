import type { Recipe, RecipeSection } from '../types'
import { generateId } from '../utils/id'

export function normalizeImportedRecipe(partial: Partial<Recipe>): Recipe {
  const now = new Date().toISOString()
  const sections: RecipeSection[] =
    partial.sections && partial.sections.length > 0
      ? partial.sections.map((s) => ({
          label: s.label || 'Main',
          ingredients: (s.ingredients || []).map((i) => ({
            amount: typeof i.amount === 'number' ? i.amount : 0,
            unit: i.unit ?? '',
            name: i.name ?? '',
            notes: i.notes ?? undefined,
          })),
          instructions: (s.instructions || []).map(String),
        }))
      : [
          {
            label: 'Main',
            ingredients: [],
            instructions: [],
          },
        ]

  return {
    id: partial.id || generateId(),
    title: partial.title || 'Untitled',
    description: partial.description,
    image: partial.image,
    rating: partial.rating,
    cookTime: partial.cookTime,
    prepTime: partial.prepTime,
    servings: partial.servings && partial.servings > 0 ? partial.servings : 4,
    difficulty: partial.difficulty,
    cuisine: partial.cuisine || '',
    source: partial.source,
    lastCooked: partial.lastCooked,
    tags: Array.isArray(partial.tags) ? partial.tags : [],
    sections,
    createdAt: partial.createdAt || now,
    updatedAt: now,
  }
}
