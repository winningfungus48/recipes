import { describe, it, expect } from 'vitest'
import { parseIngredientString } from './utils/ingredientParser'

describe('ingredientParser', () => {
  it('parses amount unit name', () => {
    const i = parseIngredientString('2 cups flour')
    expect(i.amount).toBe(2)
    expect(i.unit).toBe('cups')
    expect(i.name).toBe('flour')
  })

  it('parses fraction', () => {
    const i = parseIngredientString('1/2 tsp salt')
    expect(i.amount).toBeCloseTo(0.5)
    expect(i.name).toContain('salt')
  })
})
