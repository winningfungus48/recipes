import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Tag, Heart } from 'lucide-react'
import { Recipe } from '../types/recipe'
import { CATEGORY_ICONS, CATEGORY_COLORS, DIFFICULTY_COLORS, DIFFICULTY_ICONS } from '../data/categories'
import { getTagColor } from '../data/tags'
import StarRating from './StarRating'
import MobileHeader from './MobileHeader'
import CardMetaRow from './CardMetaRow'

interface RecipeCardProps {
  recipe: Recipe
  viewMode: 'grid' | 'list'
  onToggleFavorite?: (id: string) => void
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, viewMode, onToggleFavorite }) => {
  if (viewMode === 'list') {
    return (
      <div className="card hover:shadow-md transition-shadow duration-200">
        <Link to={`/recipes/${recipe.id}`} className="flex space-x-4 block">
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
            {/* Mobile Header - Title + Heart + Stars */}
            <MobileHeader
              title={recipe.title}
              rating={recipe.rating}
              isFavorite={recipe.isFavorite}
              onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(recipe.id) : undefined}
              className="mb-2"
            />

            {/* Desktop Header */}
            <div className="hidden md:block">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900 hover:text-sage-600 transition-colors truncate flex-1 min-w-0">
                  {recipe.title}
                </h3>
                
                <div className="flex items-center flex-shrink-0">
                  {onToggleFavorite && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onToggleFavorite(recipe.id)
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-0.5 -m-0.5"
                    >
                      <Heart className={`h-4 w-4 ${recipe.isFavorite ? 'text-red-500 fill-current' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Desktop: Stars + Cook Time in same line */}
              <div className="flex items-center justify-between md:justify-end gap-2 md:gap-4 flex-wrap mt-1">
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

            {/* Meta Row - Category, Difficulty, Cook Time, Tags */}
            <CardMetaRow
              category={recipe.category}
              difficulty={recipe.difficulty}
              cookTime={recipe.cookTime}
              tags={recipe.tags}
              className="mt-1"
            />
          </div>
        </Link>
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
              e.stopPropagation()
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
        
        {/* Meta Row - Category, Difficulty, Cook Time, Tags */}
        <CardMetaRow
          category={recipe.category}
          difficulty={recipe.difficulty}
          cookTime={recipe.cookTime}
          tags={recipe.tags}
          className="mb-2"
        />
      </div>
    </div>
  )
}

export default RecipeCard
