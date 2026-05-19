/** Mains from initial upload that are breakfast — not lunch/dinner. */
const BREAKFAST_MAIN_TITLES = new Set([
  'protein french toast stix',
  'stuffed cinnamon french toast roll ups',
  'waffles',
])

/** Title patterns for breakfast-style mains (applied only to mains collection). */
const BREAKFAST_TITLE_PATTERNS: RegExp[] = [
  /\bfrench toast\b/i,
  /\bwaffl(es)?\b/i,
  /\bpancakes?\b/i,
  /\bomelet(te)?\b/i,
  /\bscrambled eggs?\b/i,
  /\bbreakfast\b/i,
  /\bovernight oats?\b/i,
  /\begg(s)? benedict\b/i,
  /\bhash browns?\b/i,
  /\bfrittata\b/i,
  /\bquiche\b/i,
  /\bcrepes?\b/i,
]

export function isBreakfastMain(title: string): boolean {
  const key = title.trim().toLowerCase()
  if (BREAKFAST_MAIN_TITLES.has(key)) return true
  return BREAKFAST_TITLE_PATTERNS.some((p) => p.test(title))
}

export function applyMainsMealTags(
  title: string,
  categoryTag: string
): { cuisine: string; tags: string[] } {
  if (categoryTag === 'mains' && isBreakfastMain(title)) {
    return { cuisine: 'breakfast', tags: ['breakfast'] }
  }
  return { cuisine: categoryTag, tags: [categoryTag] }
}
