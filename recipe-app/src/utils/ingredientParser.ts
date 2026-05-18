import type { Ingredient } from '../types'

const UNITS = [
  'tbsp',
  'tablespoon',
  'tablespoons',
  'tsp',
  'teaspoon',
  'teaspoons',
  'cup',
  'cups',
  'oz',
  'lb',
  'lbs',
  'pound',
  'pounds',
  'g',
  'kg',
  'ml',
  'l',
  'clove',
  'cloves',
  'slice',
  'slices',
  'pinch',
  'dash',
  'whole',
  'can',
  'cans',
  'package',
  'packages',
  'stalk',
  'stalks',
] as const

const UNIT_SET = new Set<string>(UNITS as unknown as string[])

function parseLeadingNumber(s: string): { value: number; rest: string } | null {
  const trimmed = s.trim()
  if (!trimmed) return null

  // Mixed: "1 1/2"
  const mixed = trimmed.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)/)
  if (mixed) {
    const whole = parseInt(mixed[1], 10)
    const num = parseInt(mixed[2], 10)
    const den = parseInt(mixed[3], 10)
    if (den === 0) return null
    return { value: whole + num / den, rest: trimmed.slice(mixed[0].length).trim() }
  }

  // Fraction only: "1/2"
  const frac = trimmed.match(/^(\d+)\s*\/\s*(\d+)/)
  if (frac) {
    const num = parseInt(frac[1], 10)
    const den = parseInt(frac[2], 10)
    if (den === 0) return null
    return { value: num / den, rest: trimmed.slice(frac[0].length).trim() }
  }

  // Decimal or integer
  const dec = trimmed.match(/^(\d+\.?\d*)/)
  if (dec) {
    return { value: parseFloat(dec[1]), rest: trimmed.slice(dec[0].length).trim() }
  }

  return null
}

function normalizeUnit(token: string): string {
  const t = token.toLowerCase().replace(/\.$/, '')
  if (t === 'tablespoon' || t === 'tablespoons') return 'tbsp'
  if (t === 'teaspoon' || t === 'teaspoons') return 'tsp'
  if (t === 'pound' || t === 'pounds' || t === 'lbs') return 'lb'
  return t
}

/**
 * Parse a single ingredient line like "2 cups flour, sifted" → Ingredient
 */
export function parseIngredientString(line: string): Ingredient {
  const original = line.trim()
  if (!original) {
    return { amount: 0, unit: '', name: '', notes: undefined }
  }

  const num = parseLeadingNumber(original)
  if (!num) {
    return { amount: 0, unit: '', name: original, notes: undefined }
  }

  let rest = num.rest
  const amount = num.value

  // Optional range "1-2" not in spec — skip

  const tokens = rest.split(/\s+/).filter(Boolean)
  let unit = 'whole'
  let nameStart = 0

  if (tokens.length > 0) {
    const first = normalizeUnit(tokens[0])
    if (UNIT_SET.has(first) || first === 'cup' || first === 'cups') {
      unit = first === 'cup' ? 'cups' : first
      nameStart = 1
    }
  }

  let remainder = tokens.slice(nameStart).join(' ').trim()
  let notes: string | undefined
  let name = remainder

  const comma = remainder.indexOf(',')
  if (comma >= 0) {
    name = remainder.slice(0, comma).trim()
    notes = remainder.slice(comma + 1).trim() || undefined
  }

  if (!name && unit !== 'whole') {
    name = remainder
  }

  if (!name) {
    return { amount, unit, name: original, notes }
  }

  return { amount, unit, name, notes }
}
