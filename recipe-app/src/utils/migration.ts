import type { AppStorage, LegacyRecipe, LegacyRecipeSection, Recipe, RecipeSection } from '../types'
import { parseIngredientString } from './ingredientParser'

const STORAGE_KEY = 'myRecipesData'
const BACKUP_KEY = 'myRecipesData-backup'

export { STORAGE_KEY, BACKUP_KEY }

function isAppStorageV2(data: unknown): data is AppStorage {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as AppStorage).version === 2 &&
    Array.isArray((data as AppStorage).recipes)
  )
}

function legacySectionFromFlat(r: LegacyRecipe): LegacyRecipeSection {
  const ingredients = Array.isArray(r.ingredients) ? r.ingredients.filter(Boolean) : []
  const instructions =
    typeof r.instructions === 'string'
      ? r.instructions
          .split(/\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  return { label: 'Main', ingredients, instructions }
}

function normalizeSections(legacy: LegacyRecipe): LegacyRecipeSection[] {
  if (legacy.sections && legacy.sections.length > 0) {
    return legacy.sections.map((s) => ({
      label: s.label || 'Main',
      ingredients: Array.isArray(s.ingredients) ? s.ingredients : [],
      instructions: Array.isArray(s.instructions) ? s.instructions : [],
    }))
  }
  return [legacySectionFromFlat(legacy)]
}

function migrateLegacyRecipe(legacy: LegacyRecipe): Recipe {
  const now = new Date().toISOString()
  const sectionsSrc = normalizeSections(legacy)
  const tags = new Set<string>()
  ;(legacy.tags || []).forEach((t) => tags.add(t))
  if (legacy.category) tags.add(String(legacy.category))

  const sections: RecipeSection[] = sectionsSrc.map((sec) => ({
    label: sec.label || 'Main',
    ingredients: sec.ingredients.map((line) => parseIngredientString(String(line))),
    instructions: sec.instructions.map((s) => String(s)),
  }))

  return {
    id: String(legacy.id),
    title: String(legacy.title || 'Untitled'),
    description: legacy.description || legacy.notes || undefined,
    image: legacy.image,
    rating: typeof legacy.rating === 'number' ? legacy.rating : undefined,
    cookTime: legacy.cookTime,
    prepTime: legacy.prepTime,
    servings: typeof legacy.servings === 'number' && legacy.servings > 0 ? legacy.servings : 4,
    difficulty: legacy.difficulty,
    cuisine: legacy.cuisine ? String(legacy.cuisine) : '',
    source: legacy.source,
    lastCooked: legacy.lastCooked,
    tags: Array.from(tags),
    sections,
    createdAt: legacy.createdAt || now,
    updatedAt: legacy.updatedAt || legacy.createdAt || now,
  }
}

/**
 * Run once at app boot. Backs up raw localStorage before transforming.
 */
export function runMigration(): void {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    console.error('Migration: invalid JSON in myRecipesData')
    return
  }

  if (isAppStorageV2(parsed)) {
    return
  }

  try {
    localStorage.setItem(BACKUP_KEY, raw)
  } catch (e) {
    console.error('Migration: could not write backup', e)
    return
  }

  let recipes: Recipe[] = []
  let cookbooks: AppStorage['cookbooks'] = []
  let mealPlans: AppStorage['mealPlans'] = []

  if (Array.isArray(parsed)) {
    recipes = (parsed as LegacyRecipe[]).map((r) => migrateLegacyRecipe(r))
  } else if (typeof parsed === 'object' && parsed !== null) {
    const obj = parsed as Record<string, unknown>
    if (Array.isArray(obj.recipes)) {
      recipes = (obj.recipes as LegacyRecipe[]).map((r) => migrateLegacyRecipe(r))
    }
    if (Array.isArray(obj.cookbooks)) cookbooks = obj.cookbooks as AppStorage['cookbooks']
    if (Array.isArray(obj.mealPlans)) mealPlans = obj.mealPlans as AppStorage['mealPlans']
  }

  const valid = recipes.every((r) => r.sections && r.sections.length > 0)
  if (!valid) {
    console.error('Migration validation failed — aborting, original data preserved in backup key')
    return
  }

  const newStorage: AppStorage = {
    version: 2,
    recipes,
    cookbooks,
    mealPlans,
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newStorage))
    console.log(`Migration complete: ${recipes.length} recipes converted to v2`)
  } catch (e) {
    console.error('Migration: failed to write v2 storage', e)
  }
}
