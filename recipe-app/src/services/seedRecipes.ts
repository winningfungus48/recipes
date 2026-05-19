import type { Recipe } from '../types'
import seedRecipes from '../data/seed-recipes.json'
import { isBreakfastMain } from '../utils/mainsBreakfast'
import { loadAppStorage, saveAppStorage } from './storage'

const SEED_FLAG = 'initial-md-recipes-merged-v1'
const BREAKFAST_MAINS_PATCH = 'breakfast-mains-tags-v1'
const REMOVE_IMPORTED_TAG = 'remove-imported-tag-v1'

function stripImportedTagFromStorage(): number {
  if (typeof localStorage === 'undefined') return 0
  if (localStorage.getItem(REMOVE_IMPORTED_TAG) === 'true') return 0

  const cur = loadAppStorage()
  let changed = 0
  const recipes = cur.recipes.map((r) => {
    const nextTags = r.tags.filter((t) => t.toLowerCase() !== 'imported')
    if (nextTags.length === r.tags.length) return r
    changed++
    return { ...r, tags: nextTags, updatedAt: new Date().toISOString() }
  })

  if (changed > 0) {
    saveAppStorage({ ...cur, recipes })
    console.log(`Removed imported tag from ${changed} recipes`)
  }
  localStorage.setItem(REMOVE_IMPORTED_TAG, 'true')
  return changed
}

function patchBreakfastMainsInStorage(): number {
  if (typeof localStorage === 'undefined') return 0
  if (localStorage.getItem(BREAKFAST_MAINS_PATCH) === 'true') return 0

  const cur = loadAppStorage()
  let changed = 0
  const recipes = cur.recipes.map((r) => {
    const fromMainsUpload =
      r.source === 'initial-upload:mains' || r.id.startsWith('seed-mains-')
    if (!fromMainsUpload || !isBreakfastMain(r.title)) return r

    const extra = r.tags.filter((t) => {
      const l = t.toLowerCase()
      return l !== 'mains' && l !== 'breakfast'
    })
    const nextTags = ['breakfast', ...extra]
    const same =
      r.cuisine === 'breakfast' &&
      r.tags.length === nextTags.length &&
      r.tags.every((t, i) => t === nextTags[i])
    if (same) return r

    changed++
    return {
      ...r,
      cuisine: 'breakfast',
      tags: nextTags,
      updatedAt: new Date().toISOString(),
    }
  })

  if (changed > 0) {
    saveAppStorage({ ...cur, recipes })
    console.log(`Retagged ${changed} breakfast mains (mains → breakfast)`)
  }
  localStorage.setItem(BREAKFAST_MAINS_PATCH, 'true')
  return changed
}

export function mergeSeedRecipesIfNeeded(): number {
  stripImportedTagFromStorage()
  patchBreakfastMainsInStorage()
  if (typeof localStorage === 'undefined') return 0
  if (localStorage.getItem(SEED_FLAG) === 'true') return 0

  const seeds = seedRecipes as Recipe[]
  if (!Array.isArray(seeds) || seeds.length === 0) return 0

  const cur = loadAppStorage()
  const existingIds = new Set(cur.recipes.map((r) => r.id))
  const existingTitles = new Set(cur.recipes.map((r) => r.title.trim().toLowerCase()))

  const toAdd = seeds.filter((s) => {
    if (existingIds.has(s.id)) return false
    if (existingTitles.has(s.title.trim().toLowerCase())) return false
    return true
  })

  if (toAdd.length === 0) {
    localStorage.setItem(SEED_FLAG, 'true')
    return 0
  }

  saveAppStorage({
    ...cur,
    recipes: [...cur.recipes, ...toAdd],
  })
  localStorage.setItem(SEED_FLAG, 'true')
  console.log(`Merged ${toAdd.length} seed recipes from initial upload markdown`)
  return toAdd.length
}
