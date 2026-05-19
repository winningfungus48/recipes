import type { Ingredient, Recipe, RecipeSection } from '../types'
import { applyMainsMealTags } from './mainsBreakfast'
import { parseIngredientString } from './ingredientParser'

export interface ParsedMarkdownRecipe {
  title: string
  ingredients: string[]
  directions: string[]
  notes: string
}

/** Normalize exported markdown that uses literal \\#\\# instead of ## */
export function normalizeMarkdownHeadings(md: string): string {
  return md.replace(/\\#\\#/g, '##').replace(/\r\n/g, '\n')
}

function sectionKind(heading: string): 'ingredients' | 'directions' | 'notes' | null {
  const h = heading.trim()
  if (/^ingredients?$/i.test(h)) return 'ingredients'
  if (/^(directions?|instructions?|steps?)$/i.test(h)) return 'directions'
  if (/^notes?$/i.test(h)) return 'notes'
  return null
}

/** Parse one collection file (many recipes separated by ## Title headings). */
export function parseCollectionMarkdown(md: string): ParsedMarkdownRecipe[] {
  const normalized = normalizeMarkdownHeadings(md)
  const lines = normalized.split('\n')

  const recipes: ParsedMarkdownRecipe[] = []
  let current: ParsedMarkdownRecipe | null = null
  let section: 'ingredients' | 'directions' | 'notes' | null = null

  const flush = () => {
    if (current?.title.trim()) {
      recipes.push({
        title: current.title.trim(),
        ingredients: current.ingredients,
        directions: current.directions,
        notes: current.notes.trim(),
      })
    }
    current = null
    section = null
  }

  const pushLine = (line: string) => {
    if (!current || !section) return
    const t = line.trim()
    if (!t) return
    const cleaned = t.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '').trim()
    if (!cleaned) return
    if (section === 'ingredients') current.ingredients.push(cleaned)
    else if (section === 'directions') current.directions.push(cleaned)
    else if (section === 'notes') {
      current.notes = current.notes ? `${current.notes}\n${cleaned}` : cleaned
    }
  }

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+)$/)
    if (heading) {
      const text = heading[1].trim()
      const kind = sectionKind(text)
      if (kind) {
        section = kind
        continue
      }
      flush()
      current = { title: text, ingredients: [], directions: [], notes: '' }
      section = null
      continue
    }

    if (line.match(/^#\s+/) && !line.match(/^##\s+/)) {
      continue
    }

    pushLine(line)
  }

  flush()
  return recipes
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

export function parsedToRecipe(
  parsed: ParsedMarkdownRecipe,
  categoryTag: string,
  index: number
): Recipe {
  const now = new Date().toISOString()
  const slug = slugify(parsed.title) || `recipe-${index}`
  const id = `seed-${categoryTag}-${slug}`

  const ingredients: Ingredient[] = parsed.ingredients.map((line) => parseIngredientString(line))
  const instructions = parsed.directions.length
    ? parsed.directions
    : ['See notes for preparation details.']

  const section: RecipeSection = {
    label: 'Main',
    ingredients: ingredients.length ? ingredients : [{ amount: 0, unit: '', name: 'See recipe notes', notes: undefined }],
    instructions,
  }

  const meal = applyMainsMealTags(parsed.title, categoryTag)
  const tags = [...meal.tags]

  return {
    id,
    title: parsed.title,
    description: parsed.notes || undefined,
    servings: 4,
    cuisine: meal.cuisine,
    source: `initial-upload:${categoryTag}`,
    tags,
    sections: [section],
    createdAt: now,
    updatedAt: now,
  }
}

export function parseCollectionFile(md: string, categoryTag: string): Recipe[] {
  return parseCollectionMarkdown(md).map((p, i) => parsedToRecipe(p, categoryTag, i))
}
