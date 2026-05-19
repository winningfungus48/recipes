/**
 * Parse data/initial upload/{desserts,drinks,mains,sides}.md into seed-recipes.json
 * Run: npx tsx scripts/import-initial-md.ts
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { parseCollectionFile } from '../src/utils/parseCollectionMarkdown.ts'
import type { Recipe } from '../src/types/index.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const dataDir = join(root, '..', 'data', 'initial upload')

const FILES: { file: string; tag: string }[] = [
  { file: 'desserts.md', tag: 'desserts' },
  { file: 'drinks.md', tag: 'drinks' },
  { file: 'mains.md', tag: 'mains' },
  { file: 'sides.md', tag: 'sides' },
]

const all: Recipe[] = []
const titles = new Set<string>()

for (const { file, tag } of FILES) {
  const path = join(dataDir, file)
  const md = readFileSync(path, 'utf-8')
  const recipes = parseCollectionFile(md, tag)
  console.log(`${file}: ${recipes.length} recipes`)
  for (const r of recipes) {
    const key = r.title.trim().toLowerCase()
    if (titles.has(key)) {
      console.warn(`  duplicate title skipped: ${r.title}`)
      continue
    }
    titles.add(key)
    all.push(r)
  }
}

const outPath = join(root, 'src', 'data', 'seed-recipes.json')
writeFileSync(outPath, JSON.stringify(all, null, 2), 'utf-8')
console.log(`\nWrote ${all.length} recipes to ${outPath}`)
