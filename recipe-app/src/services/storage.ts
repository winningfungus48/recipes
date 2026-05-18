import type { AppStorage, Cookbook, MealPlan, Recipe } from '../types'

const STORAGE_KEY = 'myRecipesData'

export function loadAppStorage(): AppStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStorage()
    const parsed = JSON.parse(raw) as unknown
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      (parsed as AppStorage).version === 2 &&
      Array.isArray((parsed as AppStorage).recipes)
    ) {
      const p = parsed as AppStorage
      return {
        version: 2,
        recipes: p.recipes,
        cookbooks: Array.isArray(p.cookbooks) ? p.cookbooks : [],
        mealPlans: Array.isArray(p.mealPlans) ? p.mealPlans : [],
      }
    }
  } catch (e) {
    console.error('loadAppStorage', e)
  }
  return emptyStorage()
}

export function emptyStorage(): AppStorage {
  return { version: 2, recipes: [], cookbooks: [], mealPlans: [] }
}

export function saveAppStorage(data: AppStorage): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('saveAppStorage', e)
  }
}

export function updateRecipes(recipes: Recipe[]): void {
  const cur = loadAppStorage()
  saveAppStorage({ ...cur, recipes })
}

export function upsertRecipe(recipe: Recipe): void {
  const cur = loadAppStorage()
  const idx = cur.recipes.findIndex((r) => r.id === recipe.id)
  const next = [...cur.recipes]
  if (idx >= 0) next[idx] = recipe
  else next.push(recipe)
  saveAppStorage({ ...cur, recipes: next })
}

export function deleteRecipe(id: string): void {
  const cur = loadAppStorage()
  saveAppStorage({
    ...cur,
    recipes: cur.recipes.filter((r) => r.id !== id),
    cookbooks: cur.cookbooks.map((c) => ({
      ...c,
      recipeIds: c.recipeIds.filter((rid) => rid !== id),
    })),
    mealPlans: cur.mealPlans.map((m) => ({
      ...m,
      days: {
        monday: m.days.monday.filter((x) => x !== id),
        tuesday: m.days.tuesday.filter((x) => x !== id),
        wednesday: m.days.wednesday.filter((x) => x !== id),
        thursday: m.days.thursday.filter((x) => x !== id),
        friday: m.days.friday.filter((x) => x !== id),
        saturday: m.days.saturday.filter((x) => x !== id),
        sunday: m.days.sunday.filter((x) => x !== id),
      },
    })),
  })
}

export function saveCookbooks(cookbooks: Cookbook[]): void {
  const cur = loadAppStorage()
  saveAppStorage({ ...cur, cookbooks })
}

export function saveMealPlans(mealPlans: MealPlan[]): void {
  const cur = loadAppStorage()
  saveAppStorage({ ...cur, mealPlans })
}
