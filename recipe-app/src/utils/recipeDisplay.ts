import type { Recipe } from '../types'

/** Tags for UI lists — omits any tag that duplicates `cuisine` (case-insensitive). */
export function getDisplayTags(recipe: Pick<Recipe, 'cuisine' | 'tags'>): string[] {
  const cuisineKey = recipe.cuisine?.trim().toLowerCase()
  return recipe.tags.filter((tag) => {
    const t = tag.trim()
    if (!t) return false
    if (cuisineKey && t.toLowerCase() === cuisineKey) return false
    return true
  })
}
