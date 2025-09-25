import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, ArrowLeft, Heart, ChevronDown, ChevronUp } from 'lucide-react'
import { Recipe } from '../types/recipe'
import { CATEGORY_ICONS, CATEGORY_COLORS, DIFFICULTY_COLORS, DIFFICULTY_ICONS } from '../data/categories'
import { getTagColor } from '../data/tags'
import { getCombinedIngredients, getSectionedInstructions } from '../utils/storage'
import StarRating from './StarRating'
import MobileHeader from './MobileHeader'
import ResponsivePage from './ResponsivePage'
import EllipsisMenu from './EllipsisMenu'

interface RecipeDetailProps {
  recipe: Recipe
  onDelete: (id: string) => void
  onToggleFavorite?: (id: string) => void
  onRatingChange?: (id: string, rating: number) => void
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onDelete, onToggleFavorite, onRatingChange }) => {
  const [showDetails, setShowDetails] = useState(false)

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      onDelete(recipe.id)
    }
  }

  const handleRatingChange = (rating: number) => {
    if (onRatingChange) {
      onRatingChange(recipe.id, rating)
    }
  }

  const handleEdit = () => {
    // Navigate to edit page - this will be handled by the parent component
    window.location.href = `/recipes/${recipe.id}/edit`
  }

  // Get combined ingredients from all sections
  const combinedIngredients = getCombinedIngredients(recipe)
  
  // Get sectioned instructions for display
  const sectionedInstructions = getSectionedInstructions(recipe)

  return (
    <ResponsivePage>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/recipes"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Recipes</span>
          </Link>
        </div>

        <div className="card">
          {/* Mobile Header - Title + Heart + Stars */}
            <MobileHeader
              title={recipe.title}
              rating={recipe.rating}
              isFavorite={recipe.isFavorite}
              onToggleFavorite={onToggleFavorite ? () => onToggleFavorite(recipe.id) : undefined}
              onEdit={handleEdit}
              onDelete={handleDelete}
              className="mb-4"
            />

          {/* Desktop Header */}
          <div className="hidden md:block mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {recipe.title}
                  </h1>
                  
                  {onToggleFavorite && (
                    <button
                      onClick={() => onToggleFavorite(recipe.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className={`h-6 w-6 ${recipe.isFavorite ? 'text-red-500 fill-current' : ''}`} />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${CATEGORY_COLORS[recipe.category]}`}>
                    {CATEGORY_ICONS[recipe.category]} {recipe.category}
                  </span>
                  
                  {recipe.cookTime && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {recipe.cookTime}
                    </div>
                  )}
                  
                  <StarRating 
                    rating={recipe.rating} 
                    size="lg" 
                    interactive={true}
                    onRatingChange={handleRatingChange}
                  />
                </div>
              </div>

              {/* Desktop Action Menu */}
              <div className="hidden md:block">
                <EllipsisMenu
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>

          {/* Mobile: Category/Difficulty badges below title */}
          <div className="md:hidden mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[recipe.category]}`}>
                {CATEGORY_ICONS[recipe.category]} {recipe.category}
              </span>
              
              {recipe.difficulty && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[recipe.difficulty]}`}>
                  {DIFFICULTY_ICONS[recipe.difficulty]} {recipe.difficulty}
                </span>
              )}
              
              {recipe.cookTime && (
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{recipe.cookTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Image - Full width with 16:9 aspect ratio and responsive optimization */}
          {recipe.image && (
            <div className="mb-6">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-64 md:h-80 object-cover rounded-lg"
                  loading="lazy"
                  srcSet={`
                    ${recipe.image}?w=320 320w,
                    ${recipe.image}?w=640 640w,
                    ${recipe.image}?w=960 960w,
                    ${recipe.image}?w=1280 1280w
                  `}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </div>
          )}

          {/* Tags - Hidden on mobile, visible on desktop */}
          {recipe.tags.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-2 mb-6">
              {recipe.tags.map((tag, index) => (
                <span
                  key={tag}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag, index)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}


        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {combinedIngredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 bg-sage-500 rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Instructions
            </h2>
            <div className="space-y-6">
              {sectionedInstructions.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  {/* Section Label */}
                  {section.label !== 'Main' && (
                    <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-300">
                      {section.label}
                    </h3>
                  )}
                  
                  {/* Section Instructions */}
                  <div className="space-y-3">
                    {section.instructions.map((instruction, instructionIndex) => (
                      <div key={instructionIndex} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-sage-500 text-white text-sm font-medium rounded-full flex items-center justify-center mr-3 mt-0.5">
                          {instructionIndex + 1}
                        </span>
                        <p className="text-gray-700 leading-relaxed">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        {recipe.notes && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Notes
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {recipe.notes}
              </p>
            </div>
          </div>
        )}

          {/* Desktop Metadata */}
          <div className="hidden md:block mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>
              Created: {new Date(recipe.createdAt).toLocaleDateString()}
              {recipe.updatedAt && recipe.updatedAt !== recipe.createdAt && (
                <span className="ml-4">
                  Updated: {new Date(recipe.updatedAt).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Mobile: Collapsed Details Disclosure - Bottom of screen */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-900">Details</span>
            {showDetails ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {showDetails && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 space-y-1">
              <p>Created: {new Date(recipe.createdAt).toLocaleDateString()}</p>
              {recipe.updatedAt && recipe.updatedAt !== recipe.createdAt && (
                <p>Updated: {new Date(recipe.updatedAt).toLocaleDateString()}</p>
              )}
              {recipe.sourceUrl && (
                <p>Source: <a href={recipe.sourceUrl} className="text-sage-600 hover:underline" target="_blank" rel="noopener noreferrer">View Original</a></p>
              )}
            </div>
          )}
        </div>

        {/* Mobile Action Menu - Sticky ellipsis button */}
        <div 
          className="fixed bottom-4 right-4 z-50"
          data-mobile-only="true"
        >
          <EllipsisMenu
            onEdit={handleEdit}
            onDelete={handleDelete}
            className="bg-white shadow-lg rounded-full p-2 border border-gray-200"
          />
        </div>
      </div>
    </ResponsivePage>
  )
}

export default RecipeDetail
