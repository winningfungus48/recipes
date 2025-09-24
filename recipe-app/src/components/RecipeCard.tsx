import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Tag, Heart } from 'lucide-react'
import { Recipe } from '../types/recipe'
import { CATEGORY_ICONS, CATEGORY_COLORS, DIFFICULTY_COLORS, DIFFICULTY_ICONS } from '../data/categories'
import { getTagColor } from '../data/tags'
import StarRating from './StarRating'

interface RecipeCardProps {
  recipe: Recipe
  viewMode: 'grid' | 'list'
  onToggleFavorite?: (id: string) => void
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, viewMode, onToggleFavorite }) => {
  if (viewMode === 'list') {
    return (
      <div className="card hover:shadow-md transition-shadow duration-200">
        <div className="flex space-x-4">
          {/* Image */}
          <div className="flex-shrink-0">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{CATEGORY_ICONS[recipe.category]}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
                {/* Line 1: Title + Heart (mobile), Title only (desktop) */}
                <div className="flex items-start justify-between gap-2 mb-1 md:mb-0">
                  <Link
                    to={`/recipes/${recipe.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-sage-600 transition-colors truncate flex-1 min-w-0"
                  >
                    {recipe.title}
                  </Link>
                  
                  <div className="flex items-center flex-shrink-0">
                    {onToggleFavorite && (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          onToggleFavorite(recipe.id)
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 -m-2 md:p-1 md:-m-1"
                      >
                        <Heart className={`h-3 w-3 md:h-4 md:w-4 ${recipe.isFavorite ? 'text-red-500 fill-current' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Mobile: 2-line layout, Desktop: single line */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-1">
                  {/* Line 1: Category, Difficulty (mobile only) */}
                  <div className="flex items-center gap-2 md:gap-4 md:flex-1 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[recipe.category]} flex-shrink-0`}>
                      {CATEGORY_ICONS[recipe.category]} {recipe.category}
                    </span>
                    
                    {recipe.difficulty && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[recipe.difficulty]} flex-shrink-0`}>
                        {DIFFICULTY_ICONS[recipe.difficulty]} {recipe.difficulty}
                      </span>
                    )}
                  </div>
                  
                  {/* Line 2: Stars + Cook Time (mobile), Desktop: Stars + Cook Time in same line */}
                  <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4 flex-wrap">
                    <div className="flex items-center">
                      <StarRating rating={recipe.rating} size="sm" />
                    </div>
                    
                    {recipe.cookTime && (
                      <div className="flex items-center text-sm text-gray-500 flex-shrink-0">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="whitespace-nowrap">{recipe.cookTime}</span>
                      </div>
                    )}
                  </div>
                </div>

            {/* Tags - Hidden on mobile, visible on desktop */}
            {recipe.tags.length > 0 && (
              <div className="hidden md:flex flex-wrap gap-1 mt-2">
                {recipe.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag, index)}`}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
                {recipe.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{recipe.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="relative">
        {/* Image */}
        <Link to={`/recipes/${recipe.id}`} className="block">
          <div className="aspect-w-16 aspect-h-9 mb-4">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-4xl">{CATEGORY_ICONS[recipe.category]}</span>
              </div>
            )}
          </div>
        </Link>

        {/* Favorite Toggle */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault()
              onToggleFavorite(recipe.id)
            }}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-2 shadow-sm md:p-1"
          >
            <Heart className={`h-3 w-3 md:h-4 md:w-4 ${recipe.isFavorite ? 'text-red-500 fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Content */}
      <div>
        <Link to={`/recipes/${recipe.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-sage-600 transition-colors truncate">
            {recipe.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[recipe.category]}`}>
            {CATEGORY_ICONS[recipe.category]} {recipe.category}
          </span>
          
          <StarRating rating={recipe.rating} size="sm" />
        </div>

        {recipe.difficulty && (
          <div className="mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[recipe.difficulty]}`}>
              {DIFFICULTY_ICONS[recipe.difficulty]} {recipe.difficulty}
            </span>
          </div>
        )}

        {recipe.cookTime && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Clock className="h-4 w-4 mr-1" />
            {recipe.cookTime}
          </div>
        )}

        {/* Tags - Hidden on mobile, visible on desktop */}
        {recipe.tags.length > 0 && (
          <div className="hidden md:flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span
                key={tag}
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag, index)}`}
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{recipe.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeCard
