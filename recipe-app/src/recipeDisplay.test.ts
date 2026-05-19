import { describe, it, expect } from 'vitest'
import { getDisplayTags } from './utils/recipeDisplay'

describe('getDisplayTags', () => {
  it('removes tag that duplicates cuisine', () => {
    expect(
      getDisplayTags({ cuisine: 'sides', tags: ['sides', 'quick', 'Sides'] })
    ).toEqual(['quick'])
  })

  it('returns all tags when cuisine is empty', () => {
    expect(getDisplayTags({ cuisine: '', tags: ['desserts', 'sweet'] })).toEqual([
      'desserts',
      'sweet',
    ])
  })
})
