import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMealPlans } from '../context/MealPlanContext'
import { useRecipes } from '../context/RecipeContext'
import type { MealPlan } from '../types'
import {
  WEEKDAYS,
  addDays,
  formatWeekRange,
  startOfWeekMonday,
  weekPlanId,
  weekdayLabel,
  type WeekdayKey,
} from '../utils/weekUtils'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { buildShoppingItems, heuristicCategory } from '../utils/shoppingMerge'
import type { ShoppingListItem } from '../types'
import { classifyIngredientCategory, isClaudeConfigured } from '../services/claudeService'

const SLOTS = ['Breakfast', 'Lunch', 'Dinner'] as const

function emptyPlan(id: string, name: string): MealPlan {
  const z = (): string[] => ['', '', '']
  return {
    id,
    name,
    days: {
      monday: z(),
      tuesday: z(),
      wednesday: z(),
      thursday: z(),
      friday: z(),
      saturday: z(),
      sunday: z(),
    },
    createdAt: new Date().toISOString(),
  }
}

export default function MealPlanPage() {
  const { mealPlans, saveAll } = useMealPlans()
  const { recipes } = useRecipes()
  const [weekMonday, setWeekMonday] = useState(() => startOfWeekMonday())
  const [picker, setPicker] = useState<{
    day: WeekdayKey
    slot: number
  } | null>(null)
  const [q, setQ] = useState('')

  const wid = weekPlanId(weekMonday)
  const wlabel = formatWeekRange(weekMonday)

  const plan = mealPlans.find((m) => m.id === wid) ?? null

  const ensurePlan = () => {
    if (plan) return
    const p = emptyPlan(wid, wlabel)
    saveAll([...mealPlans, p])
  }

  const updatePlan = (next: MealPlan) => {
    saveAll(mealPlans.map((m) => (m.id === next.id ? next : m)))
  }

  const setSlot = (day: WeekdayKey, slot: number, recipeId: string) => {
    const current = mealPlans.find((m) => m.id === wid)
    if (!current) return
    const days = { ...current.days }
    const arr = [...days[day]]
    arr[slot] = recipeId
    days[day] = arr
    updatePlan({ ...current, days })
    setPicker(null)
    setQ('')
  }

  const clearSlot = (day: WeekdayKey, slot: number) => setSlot(day, slot, '')

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return recipes
    return recipes.filter((r) => r.title.toLowerCase().includes(s))
  }, [recipes, q])

  const generateShopping = async () => {
    const current = mealPlans.find((m) => m.id === wid)
    if (!current) return
    const ids = new Set<string>()
    WEEKDAYS.forEach((d) => {
      current.days[d].forEach((id) => {
        if (id) ids.add(id)
      })
    })
    const rel = recipes.filter((r) => ids.has(r.id))
    let items: ShoppingListItem[] = buildShoppingItems(rel).map((it) => ({
      ...it,
      category: heuristicCategory(it.ingredient.name),
    }))
    if (isClaudeConfigured()) {
      items = await Promise.all(
        items.map(async (it) => {
          const cat = await classifyIngredientCategory(it.ingredient.name, it.ingredient.unit)
          return { ...it, category: cat }
        })
      )
    }
    sessionStorage.setItem(
      'shopping-generated',
      JSON.stringify({ generatedAt: new Date().toISOString(), items })
    )
    window.location.hash = '#/shopping-list'
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-2xl font-bold text-[#8B6F47]">Meal Plan</h1>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border bg-white"
            onClick={() => setWeekMonday(addDays(weekMonday, -7))}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <span className="min-w-[10rem] text-center font-semibold text-[#7C9A6E]">{wlabel}</span>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border bg-white"
            onClick={() => setWeekMonday(addDays(weekMonday, 7))}
            aria-label="Next week"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {!plan ? (
            <Button onClick={ensurePlan}>Start this week</Button>
          ) : (
            <Button variant="secondary" onClick={generateShopping}>
              Generate Shopping List
            </Button>
          )}
        </div>
      </div>

      {!plan ? (
        <p className="rounded-2xl border border-dashed p-8 text-center text-gray-600">
          No plan for this week yet. Tap &quot;Start this week&quot; to add meals.
        </p>
      ) : (
        <div className="space-y-4">
          {WEEKDAYS.map((day) => (
            <div key={day} className="rounded-2xl border border-[#8B6F47]/15 bg-white p-4 shadow-sm">
              <h2 className="mb-3 font-semibold text-[#8B6F47]">{weekdayLabel(day, weekMonday)}</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {SLOTS.map((label, slot) => {
                  const rid = plan.days[day][slot]
                  const r = recipes.find((x) => x.id === rid)
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setQ('')
                        setPicker({ day, slot })
                      }}
                      className="min-h-[72px] rounded-xl border border-gray-100 bg-[#FAF8F5] p-3 text-left text-sm"
                    >
                      <div className="text-xs font-semibold uppercase text-gray-500">{label}</div>
                      {r ? (
                        <div className="mt-1 font-medium text-[#7C9A6E]">{r.title}</div>
                      ) : (
                        <div className="mt-1 text-gray-400">Tap to assign</div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!picker}
        onClose={() => {
          setPicker(null)
          setQ('')
        }}
        title="Pick a recipe"
        size="md"
      >
        <input
          className="mb-3 min-h-[48px] w-full rounded-xl border px-3"
          placeholder="Search recipes…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <ul className="max-h-56 space-y-1 overflow-y-auto">
          {filtered.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                className="min-h-[44px] w-full rounded-xl px-3 text-left hover:bg-[#F0EBE3]"
                onClick={() => picker && setSlot(picker.day, picker.slot, r.id)}
              >
                {r.title}
              </button>
            </li>
          ))}
        </ul>
        {picker ? (
          <Button variant="ghost" className="mt-4" onClick={() => clearSlot(picker.day, picker.slot)}>
            Clear slot
          </Button>
        ) : null}
      </Modal>

      <p className="mt-8 text-center text-sm text-gray-500">
        <a href="#/shopping-list" className="text-[#7C9A6E] underline">
          Open shopping list
        </a>
      </p>
    </div>
  )
}
