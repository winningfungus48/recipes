import { describe, it, expect } from 'vitest'
import { parseCollectionMarkdown, normalizeMarkdownHeadings } from './utils/parseCollectionMarkdown'

describe('parseCollectionMarkdown', () => {
  it('parses escaped headings format', () => {
    const md = normalizeMarkdownHeadings(`\\#\\# Test Recipe
\\#\\# Ingredients
2 cups flour
salt
\\#\\# Directions
Mix and bake
\\#\\# Notes
Serve warm`)

    const recipes = parseCollectionMarkdown(md)
    expect(recipes).toHaveLength(1)
    expect(recipes[0].title).toBe('Test Recipe')
    expect(recipes[0].ingredients).toContain('2 cups flour')
    expect(recipes[0].directions[0]).toMatch(/Mix/)
  })
})
