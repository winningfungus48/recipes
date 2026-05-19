import { describe, expect, it } from 'vitest'
import { applyMainsMealTags, isBreakfastMain } from './utils/mainsBreakfast'

describe('isBreakfastMain', () => {
  it('matches known breakfast mains from initial upload', () => {
    expect(isBreakfastMain('Protein French Toast Stix')).toBe(true)
    expect(isBreakfastMain('Stuffed Cinnamon French Toast Roll Ups')).toBe(true)
    expect(isBreakfastMain('Waffles')).toBe(true)
  })

  it('does not match typical lunch/dinner mains', () => {
    expect(isBreakfastMain('Ahi Tuna Steaks')).toBe(false)
    expect(isBreakfastMain('Buffalo Chicken Sliders')).toBe(false)
    expect(isBreakfastMain('Tacos')).toBe(false)
  })
})

describe('applyMainsMealTags', () => {
  it('uses breakfast tag for breakfast mains', () => {
    expect(applyMainsMealTags('Waffles', 'mains')).toEqual({
      cuisine: 'breakfast',
      tags: ['breakfast'],
    })
  })

  it('uses mains tag for lunch/dinner mains', () => {
    expect(applyMainsMealTags('Teriyaki Chicken', 'mains')).toEqual({
      cuisine: 'mains',
      tags: ['mains'],
    })
  })

  it('leaves non-mains categories unchanged', () => {
    expect(applyMainsMealTags('Brownies', 'desserts')).toEqual({
      cuisine: 'desserts',
      tags: ['desserts'],
    })
  })
})
