import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ChevronDown, HelpCircle, Pencil } from 'lucide-react'
import { useRecipes } from '../context/RecipeContext'
import { useCookbooks } from '../context/CookbookContext'
import type { Ingredient } from '../types'
import ScalingControl from '../components/recipe/ScalingControl'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import { scaleIngredient, mightBeNonLinear } from '../services/scalingService'
import {
  fetchMidCookRescue,
  fetchScalingWarnings,
  fetchSubstitutes,
  isClaudeConfigured,
  type ScalingWarning,
  type SubstituteItem,
} from '../services/claudeService'

export default function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recipes, removeRecipe } = useRecipes()
  const { cookbooks, saveAll } = useCookbooks()

  const recipe = recipes.find((r) => r.id === id)

  const [tab, setTab] = useState<'ing' | 'inst'>('ing')
  const [displayServings, setDisplayServings] = useState(recipe?.servings ?? 4)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [subIng, setSubIng] = useState<Ingredient | null>(null)
  const [subs, setSubs] = useState<SubstituteItem[]>([])
  const [subLoading, setSubLoading] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [helpText, setHelpText] = useState('')
  const [helpReply, setHelpReply] = useState('')
  const [cbOpen, setCbOpen] = useState(false)
  const [warnings, setWarnings] = useState<ScalingWarning[]>([])
  const warnCache = useRef<Map<string, ScalingWarning[]>>(new Map())

  useEffect(() => {
    if (recipe) setDisplayServings(recipe.servings)
  }, [recipe?.id, recipe?.servings])

  const ratio = recipe ? displayServings / Math.max(1, recipe.servings) : 1

  const scaledSections = useMemo(() => {
    if (!recipe) return []
    return recipe.sections.map((s) => ({
      ...s,
      ingredients: s.ingredients.map((i) => scaleIngredient(i, ratio)),
    }))
  }, [recipe, ratio])

  useEffect(() => {
    if (!recipe || !isClaudeConfigured()) {
      setWarnings([])
      return
    }
    const key = `${recipe.id}-${displayServings}`
    if (warnCache.current.has(key)) {
      setWarnings(warnCache.current.get(key)!)
      return
    }
    const flat = recipe.sections.flatMap((s) => s.ingredients)
    let cancelled = false
    ;(async () => {
      const w = await fetchScalingWarnings(flat, recipe.title)
      if (!cancelled) {
        warnCache.current.set(key, w)
        setWarnings(w)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [recipe, displayServings])

  const warnFor = useCallback(
    (name: string) => warnings.find((w) => w.ingredientName.toLowerCase() === name.toLowerCase()),
    [warnings]
  )

  const openSub = async (ing: Ingredient) => {
    if (!recipe || !isClaudeConfigured()) return
    setSubIng(ing)
    setSubs([])
    setSubLoading(true)
    try {
      const list = await fetchSubstitutes(ing, recipe)
      setSubs(list)
    } finally {
      setSubLoading(false)
    }
  }

  const sendHelp = async () => {
    if (!recipe || !helpText.trim()) return
    setHelpReply('')
    const text = await fetchMidCookRescue(recipe, helpText.trim())
    setHelpReply(text)
  }

  const addToCookbook = (cbId: string) => {
    if (!recipe) return
    const next = cookbooks.map((c) =>
      c.id === cbId ? { ...c, recipeIds: [...new Set([...c.recipeIds, recipe.id])] } : c
    )
    saveAll(next)
    setCbOpen(false)
  }

  if (!recipe) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="text-lg text-[#8B6F47]">Recipe not found.</p>
        <Link to="/" className="mt-4 inline-block text-[#7C9A6E] underline">
          Back home
        </Link>
      </div>
    )
  }

  const hero = recipe.image

  return (
    <div className="mx-auto max-w-3xl pb-28">
      <Link
        to="/"
        className="mb-4 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[#7C9A6E]"
      >
        <ArrowLeft className="h-4 w-4" />
        All recipes
      </Link>

      <div className="relative mb-6 h-[220px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#7C9A6E]/30 to-[#D47C2E]/25">
        {hero ? (
          <img src={hero} alt="" className="h-full w-full object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-bold text-white drop-shadow md:text-3xl">{recipe.title}</h1>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {recipe.cuisine ? <Badge>{recipe.cuisine}</Badge> : null}
        {recipe.difficulty ? <Badge>{recipe.difficulty}</Badge> : null}
        {recipe.source ? (
          <a
            href={recipe.source}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-[#D47C2E] underline"
          >
            Source
          </a>
        ) : null}
      </div>
      <p className="mb-6 text-sm text-gray-600">
        {recipe.prepTime ? `Prep ${recipe.prepTime} · ` : null}
        {recipe.cookTime ? `Cook ${recipe.cookTime} · ` : null}
        <span>Servings (saved) {recipe.servings}</span>
      </p>

      {recipe.description ? (
        <p className="mb-6 rounded-2xl bg-white/80 p-4 text-gray-700">{recipe.description}</p>
      ) : null}

      <ScalingControl servings={displayServings} onChange={setDisplayServings} />

      <div className="mt-6 flex gap-2 rounded-xl bg-[#F0EBE3] p-1">
        <button
          type="button"
          className={`min-h-[44px] flex-1 rounded-lg text-sm font-semibold ${
            tab === 'ing' ? 'bg-white text-[#7C9A6E] shadow' : 'text-[#8B6F47]'
          }`}
          onClick={() => setTab('ing')}
        >
          Ingredients
        </button>
        <button
          type="button"
          className={`min-h-[44px] flex-1 rounded-lg text-sm font-semibold ${
            tab === 'inst' ? 'bg-white text-[#7C9A6E] shadow' : 'text-[#8B6F47]'
          }`}
          onClick={() => setTab('inst')}
        >
          Instructions
        </button>
      </div>

      <div className="mt-4 space-y-6">
        {tab === 'ing'
          ? scaledSections.map((sec, si) => (
              <div key={si}>
                {scaledSections.length > 1 || sec.label !== 'Main' ? (
                  <h3 className="mb-2 font-semibold text-[#8B6F47]">{sec.label}</h3>
                ) : null}
                <ul className="space-y-2">
                  {sec.ingredients.map((ing, ii) => {
                    const w = warnFor(ing.name)
                    const nl = mightBeNonLinear(ing.name) && ratio !== 1
                    return (
                      <li key={`${si}-${ii}`}>
                        <button
                          type="button"
                          disabled={!isClaudeConfigured()}
                          onClick={() => openSub(recipe.sections[si].ingredients[ii])}
                          className="flex w-full flex-col items-start rounded-xl border border-gray-100 bg-white px-4 py-3 text-left text-sm hover:border-[#7C9A6E]/40 disabled:cursor-default disabled:hover:border-gray-100"
                        >
                          <span className="font-medium text-gray-900">
                            {ing.amount} {ing.unit} {ing.name}
                            {ing.notes ? (
                              <span className="text-gray-500"> — {ing.notes}</span>
                            ) : null}
                          </span>
                          <span className="mt-1 flex flex-wrap gap-2">
                            {w ? (
                              <span className="text-xs text-amber-700">⚠️ {w.warning}</span>
                            ) : nl ? (
                              <span className="text-xs text-amber-700">⚠️ May not scale linearly</span>
                            ) : null}
                            {isClaudeConfigured() ? (
                              <span className="text-xs text-[#7C9A6E]">Tap for substitutes</span>
                            ) : null}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))
          : recipe.sections.map((sec, si) => (
              <div key={si}>
                {recipe.sections.length > 1 || sec.label !== 'Main' ? (
                  <h3 className="mb-2 font-semibold text-[#8B6F47]">{sec.label}</h3>
                ) : null}
                <ol className="list-decimal space-y-3 pl-6 text-base leading-relaxed text-gray-800">
                  {sec.instructions.map((step, ii) => {
                    const key = `${si}-${ii}`
                    const done = checked.has(key)
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => {
                            setChecked((prev) => {
                              const n = new Set(prev)
                              if (n.has(key)) n.delete(key)
                              else n.add(key)
                              return n
                            })
                          }}
                          className={`w-full rounded-xl px-3 py-3 text-left ${
                            done ? 'bg-[#7C9A6E]/15 line-through opacity-70' : 'bg-white'
                          }`}
                        >
                          <span className="mr-2 inline-flex align-middle">
                            {done ? <Check className="inline h-4 w-4 text-[#7C9A6E]" /> : null}
                          </span>
                          {step}
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </div>
            ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 flex gap-2 border-t border-[#8B6F47]/20 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:static md:mt-8 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
        <Button
          variant="secondary"
          className="flex-1"
          onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="secondary" className="flex-1" onClick={() => setCbOpen(true)}>
          <ChevronDown className="mr-1 h-4 w-4" />
          Cookbook
        </Button>
        {isClaudeConfigured() ? (
          <Button variant="secondary" className="flex-1" onClick={() => setHelpOpen(true)}>
            <HelpCircle className="mr-1 h-4 w-4" />
            Help
          </Button>
        ) : null}
      </div>

      <div className="mt-6 border-t pt-6">
        <Button
          variant="ghost"
          className="text-red-600 hover:bg-red-50"
          onClick={() => {
            if (window.confirm('Delete this recipe permanently?')) {
              removeRecipe(recipe.id)
              navigate('/')
            }
          }}
        >
          Delete recipe
        </Button>
      </div>

      <Modal isOpen={!!subIng} onClose={() => setSubIng(null)} title="Substitutes" size="md">
        {subLoading ? <p className="text-sm text-gray-600">Loading…</p> : null}
        <ul className="space-y-3">
          {subs.map((s, i) => (
            <li key={i} className="rounded-xl bg-[#FAF8F5] p-3 text-sm">
              <span className="font-semibold text-[#8B6F47]">{s.name}</span>
              <p className="mt-1 text-gray-700">{s.note}</p>
            </li>
          ))}
        </ul>
      </Modal>

      <Modal isOpen={helpOpen} onClose={() => setHelpOpen(false)} title="Help, I'm stuck" size="md">
        <textarea
          className="mb-3 min-h-[100px] w-full rounded-xl border p-3 text-base"
          placeholder="What went wrong?"
          value={helpText}
          onChange={(e) => setHelpText(e.target.value)}
        />
        <Button onClick={sendHelp}>Get help</Button>
        {helpReply ? (
          <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-[#FAF8F5] p-4 text-sm">{helpReply}</pre>
        ) : null}
      </Modal>

      <Modal isOpen={cbOpen} onClose={() => setCbOpen(false)} title="Add to cookbook" size="sm">
        {cookbooks.length === 0 ? (
          <p className="text-sm text-gray-600">Create a cookbook first from the Cookbooks tab.</p>
        ) : (
          <ul className="space-y-2">
            {cookbooks.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  className="min-h-[44px] w-full rounded-xl border px-4 text-left hover:bg-[#F0EBE3]"
                  onClick={() => addToCookbook(c.id)}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </div>
  )
}
