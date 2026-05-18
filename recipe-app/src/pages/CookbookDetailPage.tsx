import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useCookbooks } from '../context/CookbookContext'
import { useRecipes } from '../context/RecipeContext'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

export default function CookbookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cookbooks, saveAll } = useCookbooks()
  const { recipes } = useRecipes()
  const [picker, setPicker] = useState(false)
  const [q, setQ] = useState('')

  const cb = cookbooks.find((c) => c.id === id)

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return recipes
    return recipes.filter((r) => r.title.toLowerCase().includes(s))
  }, [recipes, q])

  if (!cb) {
    return <p className="p-8 text-center">Cookbook not found.</p>
  }

  const remove = (rid: string) => {
    saveAll(
      cookbooks.map((c) =>
        c.id === cb.id ? { ...c, recipeIds: c.recipeIds.filter((x) => x !== rid), updatedAt: new Date().toISOString() } : c
      )
    )
  }

  const add = (rid: string) => {
    if (cb.recipeIds.includes(rid)) return
    saveAll(
      cookbooks.map((c) =>
        c.id === cb.id
          ? { ...c, recipeIds: [...c.recipeIds, rid], updatedAt: new Date().toISOString() }
          : c
      )
    )
  }

  const delCb = () => {
    if (!window.confirm('Delete this cookbook?')) return
    saveAll(cookbooks.filter((c) => c.id !== cb.id))
    navigate('/cookbooks')
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/cookbooks" className="mb-4 inline-block text-sm font-medium text-[#7C9A6E]">
        ← Cookbooks
      </Link>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#8B6F47]">{cb.name}</h1>
          {cb.description ? <p className="mt-2 text-gray-600">{cb.description}</p> : null}
        </div>
        <Button variant="secondary" onClick={() => setPicker(true)}>
          Add recipes
        </Button>
      </div>
      <ul className="space-y-2">
        {cb.recipeIds.map((rid) => {
          const r = recipes.find((x) => x.id === rid)
          return (
            <li
              key={rid}
              className="flex min-h-[52px] items-center justify-between rounded-xl border bg-white px-4"
            >
              <Link to={`/recipes/${rid}`} className="font-medium text-[#7C9A6E]">
                {r?.title ?? 'Missing recipe'}
              </Link>
              <button type="button" className="p-2 text-red-600" onClick={() => remove(rid)} aria-label="Remove">
                <Trash2 className="h-5 w-5" />
              </button>
            </li>
          )
        })}
      </ul>
      <Button variant="ghost" className="mt-8 text-red-600" onClick={delCb}>
        Delete cookbook
      </Button>

      <Modal isOpen={picker} onClose={() => setPicker(false)} title="Add recipes" size="md">
        <input
          className="mb-3 min-h-[48px] w-full rounded-xl border px-3"
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <ul className="max-h-64 space-y-1 overflow-y-auto">
          {filtered.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                className="min-h-[44px] w-full rounded-xl px-3 text-left hover:bg-[#F0EBE3]"
                onClick={() => add(r.id)}
              >
                {r.title}
              </button>
            </li>
          ))}
        </ul>
      </Modal>
    </div>
  )
}
