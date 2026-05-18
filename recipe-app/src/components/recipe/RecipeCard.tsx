import { Link } from 'react-router-dom'
import { Clock, Star } from 'lucide-react'
import type { Recipe } from '../../types'
import Badge from '../ui/Badge'

interface Props {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: Props) {
  const img = recipe.image
  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#8B6F47]/15 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-[#7C9A6E]/25 to-[#D47C2E]/20">
        {img ? (
          <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-[#8B6F47]/40">🍳</div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-lg font-semibold text-[#8B6F47] group-hover:text-[#7C9A6E]">
          {recipe.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {recipe.cuisine ? <Badge>{recipe.cuisine}</Badge> : null}
          {recipe.cookTime ? (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              {recipe.cookTime}
            </span>
          ) : null}
          {recipe.difficulty ? (
            <span className="text-xs font-medium text-[#7C9A6E]">{recipe.difficulty}</span>
          ) : null}
          {typeof recipe.rating === 'number' && recipe.rating > 0 ? (
            <span className="inline-flex items-center gap-0.5 text-xs text-amber-600">
              <Star className="h-3.5 w-3.5 fill-current" />
              {recipe.rating}
            </span>
          ) : null}
        </div>
        {recipe.tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {recipe.tags.slice(0, 4).map((t) => (
              <span key={t} className="rounded-full bg-[#FAF8F5] px-2 py-0.5 text-[11px] text-gray-600">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
