import type { Ingredient } from '../types'

/** Scale a single ingredient amount by ratio (pure math). */
export function scaleIngredient(ing: Ingredient, ratio: number): Ingredient {
  if (!Number.isFinite(ratio) || ratio <= 0) return { ...ing }
  const amount = ing.amount * ratio
  const rounded = Math.round(amount * 1000) / 1000
  return { ...ing, amount: rounded }
}

export const NON_LINEAR_HINTS = [
  'baking powder',
  'baking soda',
  'yeast',
  'salt',
  'egg',
  'spice',
  'extract',
  'vanilla',
]

export function mightBeNonLinear(name: string): boolean {
  const n = name.toLowerCase()
  return NON_LINEAR_HINTS.some((h) => n.includes(h))
}
