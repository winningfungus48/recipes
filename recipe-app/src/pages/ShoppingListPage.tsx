import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ShoppingListItem } from '../types'
import Button from '../components/ui/Button'

const KEY = 'shopping-generated'

type Stored = { generatedAt: string; items: ShoppingListItem[] }

export default function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingListItem[]>([])

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY)
      if (!raw) return
      const p = JSON.parse(raw) as Stored
      if (Array.isArray(p.items)) setItems(p.items)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (!items.length) return
    sessionStorage.setItem(KEY, JSON.stringify({ generatedAt: new Date().toISOString(), items }))
  }, [items])

  const categories = useMemo(() => {
    const s = new Set(items.map((i) => i.category || 'Other'))
    return Array.from(s).sort()
  }, [items])

  const toggle = (idx: number) => {
    setItems((prev) => {
      const n = [...prev]
      if (!n[idx]) return prev
      n[idx] = { ...n[idx], checked: !n[idx].checked }
      return n
    })
  }

  const copy = async () => {
    const lines = items.map((i) => {
      const mark = i.checked ? '[x]' : '[ ]'
      const { amount, unit, name } = i.ingredient
      return `${mark} ${amount} ${unit} ${name}`.trim()
    })
    await navigator.clipboard.writeText(lines.join('\n'))
  }

  const clearChecked = () => setItems((prev) => prev.filter((i) => !i.checked))

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="text-2xl font-bold text-[#8B6F47]">Shopping List</h1>
        <p className="mt-4 text-gray-600">
          Generate a list from the{' '}
          <Link to="/meal-plan" className="text-[#7C9A6E] underline">
            Meal Plan
          </Link>{' '}
          page (button at the top).
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-2xl font-bold text-[#8B6F47]">Shopping List</h1>
      <p className="mb-6 text-sm text-gray-600">From your meal plan. Check items as you shop.</p>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={copy}>
          Copy to clipboard
        </Button>
        <Button variant="ghost" onClick={clearChecked}>
          Clear checked
        </Button>
      </div>
      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat}>
            <h2 className="mb-2 text-lg font-semibold text-[#7C9A6E]">{cat}</h2>
            <ul className="space-y-2">
              {items.map((it, idx) => {
                if ((it.category || 'Other') !== cat) return null
                const { amount, unit, name, notes } = it.ingredient
                return (
                  <li key={`${cat}-${idx}`} className="flex items-start gap-3 rounded-xl border bg-white px-3 py-3">
                    <button
                      type="button"
                      aria-checked={it.checked}
                      className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 ${
                        it.checked ? 'border-[#7C9A6E] bg-[#7C9A6E]/20' : 'border-gray-300'
                      }`}
                      onClick={() => toggle(idx)}
                    >
                      {it.checked ? '✓' : ''}
                    </button>
                    <div className="flex-1 text-sm">
                      <span className={it.checked ? 'text-gray-400 line-through' : 'font-medium text-gray-900'}>
                        {amount} {unit} {name}
                      </span>
                      {notes ? <span className="text-gray-500"> — {notes}</span> : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
