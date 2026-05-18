import type { Ingredient, Recipe, ShoppingListItem } from '../types'
import { scaleIngredient } from '../services/scalingService'

function keyIng(i: Ingredient): string {
  return `${i.name.trim().toLowerCase()}|${i.unit.trim().toLowerCase()}`
}

/** Merge ingredients from multiple recipes (same name+unit → sum amounts). */
export function buildShoppingItems(recipes: Recipe[]): ShoppingListItem[] {
  const map = new Map<string, ShoppingListItem>()

  for (const r of recipes) {
    for (const sec of r.sections) {
      for (const ing of sec.ingredients) {
        const scaled = scaleIngredient(ing, 1)
        const k = keyIng(scaled)
        if (!scaled.name.trim()) continue
        const existing = map.get(k)
        if (existing) {
          existing.ingredient = {
            ...existing.ingredient,
            amount: existing.ingredient.amount + scaled.amount,
          }
          if (!existing.recipeIds.includes(r.id)) existing.recipeIds.push(r.id)
        } else {
          map.set(k, {
            ingredient: { ...scaled },
            recipeIds: [r.id],
            checked: false,
          })
        }
      }
    }
  }

  return Array.from(map.values())
}

const PRODUCE = /lettuce|onion|garlic|tomato|potato|carrot|pepper|herb|basil|cilantro|ginger|apple|banana|lemon|lime|mushroom|spinach|kale|broccoli|celery|cucumber|avocado|fruit|vegetable/i
const DAIRY = /milk|cream|cheese|butter|yogurt|egg|sour cream|ricotta|mozzarella|parmesan/i
const MEAT = /chicken|beef|pork|fish|salmon|shrimp|turkey|bacon|sausage|lamb|meat|steak|ribs/i
const SPICE = /salt|pepper|paprika|cumin|oregano|thyme|spice|cinnamon|nutmeg|clove|curry|chili|seasoning/i

export function heuristicCategory(name: string): string {
  const n = name.toLowerCase()
  if (PRODUCE.test(n)) return '🥬 Produce'
  if (DAIRY.test(n)) return '🥛 Dairy'
  if (MEAT.test(n)) return '🥩 Meat/Fish'
  if (SPICE.test(n)) return '🌿 Spices'
  return '🥫 Pantry'
}
