import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import type { Recipe } from '../../types'
import { normalizeImportedRecipe } from '../../services/recipeFactory'
import { useRecipes } from '../../context/RecipeContext'

interface Props {
  isOpen: boolean
  initial: Partial<Recipe>
  sourceUrl: string
  onClose: () => void
  onBack: () => void
}

export default function ImportPreview({ isOpen, initial, sourceUrl, onClose, onBack }: Props) {
  const { addRecipe } = useRecipes()
  const navigate = useNavigate()
  const [draft, setDraft] = useState<Partial<Recipe>>(() => ({
    ...initial,
    source: initial.source || sourceUrl,
  }))

  const save = () => {
    const r = normalizeImportedRecipe({ ...draft, source: draft.source || sourceUrl })
    addRecipe(r)
    onClose()
    navigate(`/recipes/${r.id}`)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review import" size="lg">
      <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm font-medium text-[#8B6F47]">
            Title
            <input
              className="mt-1 min-h-[44px] w-full rounded-xl border px-3"
              value={draft.title || ''}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            />
          </label>
          <label className="text-sm font-medium text-[#8B6F47]">
            Servings
            <input
              type="number"
              min={1}
              className="mt-1 min-h-[44px] w-full rounded-xl border px-3"
              value={draft.servings ?? 4}
              onChange={(e) =>
                setDraft((d) => ({ ...d, servings: Math.max(1, parseInt(e.target.value, 10) || 4) }))
              }
            />
          </label>
          <label className="text-sm font-medium text-[#8B6F47]">
            Cook time
            <input
              className="mt-1 min-h-[44px] w-full rounded-xl border px-3"
              value={draft.cookTime || ''}
              onChange={(e) => setDraft((d) => ({ ...d, cookTime: e.target.value }))}
            />
          </label>
          <label className="text-sm font-medium text-[#8B6F47]">
            Prep time
            <input
              className="mt-1 min-h-[44px] w-full rounded-xl border px-3"
              value={draft.prepTime || ''}
              onChange={(e) => setDraft((d) => ({ ...d, prepTime: e.target.value }))}
            />
          </label>
        </div>
        <p className="text-xs text-gray-500">
          Sections, ingredients, and instructions from the import are preserved — use Edit after save for
          full structured editing.
        </p>
        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button onClick={save}>Save recipe</Button>
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  )
}
