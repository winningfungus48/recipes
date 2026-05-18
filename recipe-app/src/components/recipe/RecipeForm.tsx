import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { Ingredient, Recipe, RecipeSection } from '../../types'
import { generateId } from '../../utils/id'
import Button from '../ui/Button'

const emptyIng = (): Ingredient => ({ amount: 0, unit: '', name: '', notes: undefined })
const emptySection = (): RecipeSection => ({
  label: 'Main',
  ingredients: [emptyIng()],
  instructions: [''],
})

interface Props {
  initial?: Recipe
  onSave: (recipe: Recipe) => void
  onCancel: () => void
}

export default function RecipeForm({ initial, onSave, onCancel }: Props) {
  const now = new Date().toISOString()
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [image, setImage] = useState(initial?.image ?? '')
  const [cookTime, setCookTime] = useState(initial?.cookTime ?? '')
  const [prepTime, setPrepTime] = useState(initial?.prepTime ?? '')
  const [servings, setServings] = useState(initial?.servings ?? 4)
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? '')
  const [cuisine, setCuisine] = useState(initial?.cuisine ?? '')
  const [source, setSource] = useState(initial?.source ?? '')
  const [tagsStr, setTagsStr] = useState((initial?.tags ?? []).join(', '))
  const [sections, setSections] = useState<RecipeSection[]>(
    initial?.sections?.length ? structuredClone(initial.sections) : [emptySection()]
  )

  const updateIng = (si: number, ii: number, patch: Partial<Ingredient>) => {
    setSections((prev) => {
      const n = structuredClone(prev)
      n[si].ingredients[ii] = { ...n[si].ingredients[ii], ...patch }
      return n
    })
  }

  const addIng = (si: number) => {
    setSections((prev) => {
      const n = structuredClone(prev)
      n[si].ingredients.push(emptyIng())
      return n
    })
  }

  const removeIng = (si: number, ii: number) => {
    setSections((prev) => {
      const n = structuredClone(prev)
      if (n[si].ingredients.length <= 1) return prev
      n[si].ingredients.splice(ii, 1)
      return n
    })
  }

  const updateInst = (si: number, ii: number, v: string) => {
    setSections((prev) => {
      const n = structuredClone(prev)
      n[si].instructions[ii] = v
      return n
    })
  }

  const addInst = (si: number) => {
    setSections((prev) => {
      const n = structuredClone(prev)
      n[si].instructions.push('')
      return n
    })
  }

  const removeInst = (si: number, ii: number) => {
    setSections((prev) => {
      const n = structuredClone(prev)
      if (n[si].instructions.length <= 1) return prev
      n[si].instructions.splice(ii, 1)
      return n
    })
  }

  const addSection = () => {
    setSections((prev) => [...prev, { label: 'Section', ingredients: [emptyIng()], instructions: [''] }])
  }

  const removeSection = (si: number) => {
    setSections((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== si)))
  }

  const submit = () => {
    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const cleaned: RecipeSection[] = sections.map((s) => ({
      label: s.label || 'Main',
      ingredients: s.ingredients.filter((i) => i.name.trim() || i.amount > 0 || i.unit),
      instructions: s.instructions.map((x) => x.trim()).filter(Boolean),
    }))
    const recipe: Recipe = {
      id: initial?.id ?? generateId(),
      title: title.trim() || 'Untitled',
      description: description.trim() || undefined,
      image: image.trim() || undefined,
      rating: initial?.rating,
      cookTime: cookTime.trim() || undefined,
      prepTime: prepTime.trim() || undefined,
      servings: Math.max(1, servings),
      difficulty: (difficulty as Recipe['difficulty']) || undefined,
      cuisine: cuisine.trim() || '',
      source: source.trim() || undefined,
      lastCooked: initial?.lastCooked,
      tags,
      sections: cleaned.length ? cleaned : [{ label: 'Main', ingredients: [emptyIng()], instructions: [''] }],
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    }
    onSave(recipe)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-24">
      <h1 className="text-2xl font-bold text-[#8B6F47]">{initial ? 'Edit recipe' : 'Add recipe'}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-[#8B6F47] md:col-span-2">
          Title *
          <input
            className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-[#8B6F47] md:col-span-2">
          Description
          <textarea
            className="mt-1 min-h-[80px] w-full rounded-xl border px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-[#8B6F47]">
          Image URL
          <input
            className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-[#8B6F47]">
          Tags (comma-separated)
          <input
            className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
            value={tagsStr}
            onChange={(e) => setTagsStr(e.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-[#8B6F47]">
          Cook time
          <input
            className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-[#8B6F47]">
          Prep time
          <input
            className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-[#8B6F47]">
          Servings *
          <input
            type="number"
            min={1}
            className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
            value={servings}
            onChange={(e) => setServings(Math.max(1, parseInt(e.target.value, 10) || 1))}
          />
        </label>
        <label className="text-sm font-medium text-[#8B6F47]">
          Difficulty
          <select
            className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">—</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
        <label className="text-sm font-medium text-[#8B6F47]">
          Cuisine
          <input
            className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
        </label>
        <label className="text-sm font-medium text-[#8B6F47]">
          Source URL
          <input
            className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </label>
      </div>

      {sections.map((sec, si) => (
        <div key={si} className="rounded-2xl border border-[#8B6F47]/15 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <input
              className="min-h-[44px] flex-1 rounded-xl border px-3 font-semibold text-[#8B6F47]"
              value={sec.label}
              onChange={(e) =>
                setSections((prev) => {
                  const n = structuredClone(prev)
                  n[si].label = e.target.value
                  return n
                })
              }
            />
            {sections.length > 1 ? (
              <button
                type="button"
                className="min-h-[44px] rounded-xl px-3 text-red-600"
                onClick={() => removeSection(si)}
              >
                Remove section
              </button>
            ) : null}
          </div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">Ingredients</h3>
          <div className="space-y-2">
            {sec.ingredients.map((ing, ii) => (
              <div key={ii} className="flex flex-wrap gap-2">
                <input
                  type="number"
                  className="w-20 min-w-0 rounded-xl border px-2 py-2"
                  value={ing.amount || ''}
                  placeholder="Amt"
                  onChange={(e) =>
                    updateIng(si, ii, { amount: parseFloat(e.target.value) || 0 })
                  }
                />
                <input
                  className="w-24 rounded-xl border px-2 py-2"
                  value={ing.unit}
                  placeholder="Unit"
                  onChange={(e) => updateIng(si, ii, { unit: e.target.value })}
                />
                <input
                  className="min-w-[120px] flex-1 rounded-xl border px-2 py-2"
                  value={ing.name}
                  placeholder="Name"
                  onChange={(e) => updateIng(si, ii, { name: e.target.value })}
                />
                <input
                  className="min-w-[100px] flex-1 rounded-xl border px-2 py-2"
                  value={ing.notes ?? ''}
                  placeholder="Notes"
                  onChange={(e) => updateIng(si, ii, { notes: e.target.value || undefined })}
                />
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border text-red-600"
                  onClick={() => removeIng(si, ii)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={() => addIng(si)}>
              <Plus className="mr-1 h-4 w-4" /> Ingredient
            </Button>
          </div>
          <h3 className="mb-2 mt-6 text-sm font-semibold text-gray-700">Instructions</h3>
          <div className="space-y-2">
            {sec.instructions.map((line, ii) => (
              <div key={ii} className="flex gap-2">
                <span className="mt-3 w-6 text-center text-sm text-gray-400">{ii + 1}.</span>
                <textarea
                  className="min-h-[48px] flex-1 rounded-xl border px-3 py-2"
                  value={line}
                  onChange={(e) => updateInst(si, ii, e.target.value)}
                />
                <button
                  type="button"
                  className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-red-600"
                  onClick={() => removeInst(si, ii)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={() => addInst(si)}>
              <Plus className="mr-1 h-4 w-4" /> Step
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={addSection}>
        Add section
      </Button>

      <div className="fixed bottom-0 left-0 right-0 z-30 flex gap-2 border-t bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:static md:border-0 md:bg-transparent md:px-0">
        <Button className="flex-1" onClick={submit}>
          Save
        </Button>
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
