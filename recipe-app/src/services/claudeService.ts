import type { Ingredient, Recipe } from '../types'

const CLAUDE_API = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

function getApiKey(): string | undefined {
  const k = import.meta.env.VITE_CLAUDE_API_KEY
  return typeof k === 'string' && k.trim() ? k.trim() : undefined
}

export function isClaudeConfigured(): boolean {
  return !!getApiKey()
}

async function callClaude(system: string, user: string): Promise<string> {
  const key = getApiKey()
  if (!key) throw new Error('No API key')

  const res = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  })

  const data = (await res.json()) as {
    content?: { type: string; text?: string }[]
    error?: { message?: string }
  }
  if (!res.ok) {
    throw new Error(data.error?.message || `Claude API ${res.status}`)
  }
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text : ''
  if (!text) throw new Error('Empty Claude response')
  return text
}

function stripJsonFence(s: string): string {
  let t = s.trim()
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  }
  return t.trim()
}

export async function extractRecipeFromMarkdown(
  markdown: string,
  sourceUrl: string
): Promise<Partial<Recipe> | { error: string }> {
  if (!isClaudeConfigured()) return { error: 'No API key' }

  const system = `You are a recipe extraction assistant. Extract the recipe from the content below and return ONLY valid JSON — no markdown fences, no explanation, just the raw JSON object.

Return this exact shape:
{
  "title": string,
  "description": string | null,
  "image": string | null,
  "cookTime": string | null,
  "prepTime": string | null,
  "servings": number,
  "difficulty": "Easy" | "Medium" | "Hard" | null,
  "cuisine": string | null,
  "tags": string[],
  "sections": [
    {
      "label": "Main",
      "ingredients": [
        { "amount": number, "unit": string, "name": string, "notes": string | null }
      ],
      "instructions": string[]
    }
  ]
}

If no recipe is found, return: {"error":"No recipe found"}`

  const user = `Source URL: ${sourceUrl}\n\n---\n\n${markdown.slice(0, 120000)}`

  const raw = await callClaude(system, user)
  const json = stripJsonFence(raw)
  try {
    const parsed = JSON.parse(json) as Record<string, unknown>
    if (parsed && typeof parsed === 'object' && 'error' in parsed) {
      return { error: String(parsed.error) }
    }
    return parsed as Partial<Recipe>
  } catch {
    return { error: 'Invalid JSON from model' }
  }
}

export interface ScalingWarning {
  ingredientName: string
  warning: string
}

export async function fetchScalingWarnings(
  ingredients: Ingredient[],
  recipeTitle: string
): Promise<ScalingWarning[]> {
  if (!isClaudeConfigured()) return []
  const system = `You flag baking/cooking ingredients that do NOT scale linearly when servings change. Return ONLY JSON array: [{"ingredientName":string,"warning":string}]. Empty array if none. Be concise.`
  const user = `Recipe: ${recipeTitle}\nIngredients:\n${JSON.stringify(ingredients)}`
  try {
    const raw = await callClaude(system, user)
    const arr = JSON.parse(stripJsonFence(raw))
    return Array.isArray(arr) ? (arr as ScalingWarning[]) : []
  } catch {
    return []
  }
}

export interface SubstituteItem {
  name: string
  note: string
}

export async function fetchSubstitutes(
  ingredient: Ingredient,
  recipe: Recipe
): Promise<SubstituteItem[]> {
  if (!isClaudeConfigured()) return []
  const system = `Return ONLY JSON: [{"name":string,"note":string}] with 2-3 cooking substitutes for the given ingredient in context of the full recipe. Practical notes only.`
  const user = JSON.stringify({ ingredient, recipe })
  try {
    const raw = await callClaude(system, user)
    const arr = JSON.parse(stripJsonFence(raw))
    return Array.isArray(arr) ? (arr as SubstituteItem[]) : []
  } catch {
    return []
  }
}

export async function fetchMidCookRescue(recipe: Recipe, problem: string): Promise<string> {
  if (!isClaudeConfigured()) return ''
  const system = `You are a cooking coach. Given full recipe JSON and the cook's problem, return short practical troubleshooting steps as plain text (numbered). No preamble.`
  const user = `Problem: ${problem}\n\nRecipe:\n${JSON.stringify(recipe)}`
  return callClaude(system, user)
}

/** Classify ingredient into shopping category — JSON { "category": string } */
export async function classifyIngredientCategory(
  name: string,
  unit: string
): Promise<string> {
  if (!isClaudeConfigured()) return 'Other'
  const system = `Return ONLY JSON {"category":"Produce"|"Dairy"|"Meat/Fish"|"Pantry"|"Spices"|"Other"} for grocery sorting.`
  const user = `${name} (${unit})`
  try {
    const raw = await callClaude(system, user)
    const o = JSON.parse(stripJsonFence(raw)) as { category?: string }
    return o.category || 'Other'
  } catch {
    return 'Other'
  }
}
