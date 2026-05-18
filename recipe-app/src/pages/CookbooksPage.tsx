import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCookbooks } from '../context/CookbookContext'
import type { Cookbook } from '../types'
import { generateId } from '../utils/id'
import Button from '../components/ui/Button'

export default function CookbooksPage() {
  const { cookbooks, saveAll } = useCookbooks()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [cover, setCover] = useState('')

  const create = () => {
    if (!name.trim()) return
    const now = new Date().toISOString()
    const c: Cookbook = {
      id: generateId(),
      name: name.trim(),
      description: desc.trim() || undefined,
      coverImage: cover.trim() || undefined,
      recipeIds: [],
      createdAt: now,
      updatedAt: now,
    }
    saveAll([...cookbooks, c])
    setName('')
    setDesc('')
    setCover('')
    navigate(`/cookbooks/${c.id}`)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-[#8B6F47]">Cookbooks</h1>
      <div className="mb-10 rounded-2xl border border-[#8B6F47]/15 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-[#7C9A6E]">Create cookbook</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            placeholder="Name *"
            className="min-h-[48px] rounded-xl border px-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Description"
            className="min-h-[48px] rounded-xl border px-3"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <input
            placeholder="Cover image URL (optional)"
            className="min-h-[48px] rounded-xl border px-3 md:col-span-2"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
          />
        </div>
        <Button className="mt-4" onClick={create}>
          <Plus className="mr-2 h-4 w-4" />
          Create
        </Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {cookbooks.map((c) => (
          <Link
            key={c.id}
            to={`/cookbooks/${c.id}`}
            className="overflow-hidden rounded-2xl border border-[#8B6F47]/15 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="h-32 bg-gradient-to-br from-[#7C9A6E]/25 to-[#D47C2E]/20">
              {c.coverImage ? (
                <img src={c.coverImage} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#8B6F47]">{c.name}</h3>
              {c.description ? <p className="mt-1 line-clamp-2 text-sm text-gray-600">{c.description}</p> : null}
              <p className="mt-2 text-sm text-gray-500">{c.recipeIds.length} recipes</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
