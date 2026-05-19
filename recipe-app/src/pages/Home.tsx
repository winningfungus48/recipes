import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useRecipes } from '../context/RecipeContext'
import type { Recipe } from '../types'
import RecipeCard from '../components/recipe/RecipeCard'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ImportModal from '../components/import/ImportModal'

export default function Home() {
  const { recipes } = useRecipes()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [fabOpen, setFabOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)

  const allTags = useMemo(() => {
    const s = new Set<string>()
    recipes.forEach((r) =>
      r.tags.forEach((t) => {
        if (t.toLowerCase() !== 'imported') s.add(t)
      })
    )
    return Array.from(s).sort()
  }, [recipes])

  const filtered = useMemo(() => {
    const search = q.trim().toLowerCase()
    return recipes.filter((r) => {
      if (tagFilter && !r.tags.includes(tagFilter)) return false
      if (!search) return true
      const blob = [
        r.title,
        r.cuisine,
        ...r.tags,
        ...r.sections.flatMap((s) => [
          ...s.ingredients.map((i) => `${i.name} ${i.notes || ''}`),
          ...s.instructions,
        ]),
      ]
        .join(' ')
        .toLowerCase()
      return blob.includes(search)
    })
  }, [recipes, q, tagFilter])

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#8B6F47] md:text-3xl">Recipes</h1>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          placeholder="Search title, tags, ingredients, cuisine…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="min-h-[48px] w-full rounded-2xl border border-[#8B6F47]/20 bg-white py-3 pl-12 pr-4 text-base shadow-sm outline-none ring-[#7C9A6E] focus:ring-2"
        />
      </div>

      {allTags.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {allTags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTagFilter(t === tagFilter ? null : t)}
              className={`min-h-[44px] rounded-full px-4 text-sm font-medium ${
                tagFilter === t ? 'bg-[#D47C2E] text-white' : 'bg-[#F0EBE3] text-[#8B6F47]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      ) : null}

      {recipes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#8B6F47]/30 bg-white/80 p-12 text-center">
          <p className="text-lg text-[#8B6F47]">No recipes yet</p>
          <p className="mt-2 text-gray-600">
            Use the + button to import from a URL or add one manually. Your existing library was
            migrated automatically when you opened the app.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#8B6F47]/30 bg-white/80 p-12 text-center">
          <p className="text-lg text-[#8B6F47]">No recipes match your filters yet.</p>
          <p className="mt-2 text-gray-600">Add a recipe with the + button, or try another search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filtered.map((r: Recipe) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setFabOpen(true)}
        className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#D47C2E] text-white shadow-lg md:bottom-8"
        aria-label="Add recipe"
      >
        <Plus className="h-8 w-8" />
      </button>

      <Modal isOpen={fabOpen} onClose={() => setFabOpen(false)} title="Add Recipe" size="sm">
        <div className="flex flex-col gap-3">
          <Button
            className="w-full"
            onClick={() => {
              setFabOpen(false)
              setImportOpen(true)
            }}
          >
            Import from URL
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setFabOpen(false)
              navigate('/recipes/add')
            }}
          >
            Enter Manually
          </Button>
        </div>
      </Modal>

      <ImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  )
}
