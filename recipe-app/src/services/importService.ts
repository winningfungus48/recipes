import type { Recipe } from '../types'
import { extractRecipeFromMarkdown } from './claudeService'

export async function importFromUrl(url: string): Promise<Partial<Recipe>> {
  const jinaUrl = `https://r.jina.ai/${encodeURIComponent(url)}`
  const res = await fetch(jinaUrl, {
    headers: { Accept: 'text/markdown' },
  })
  if (!res.ok) throw new Error('Could not fetch URL')
  const markdown = await res.text()

  const extracted = await extractRecipeFromMarkdown(markdown, url)
  if ('error' in extracted && extracted.error) {
    throw new Error(extracted.error)
  }
  return extracted as Partial<Recipe>
}
