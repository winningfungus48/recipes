import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Edit, Trash2, ArrowLeft, Heart } from 'lucide-react'
import { Recipe } from '../types/recipe'
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../data/categories'
import { getTagColor } from '../data/tags'
import { getCombinedIngredients, getSectionedInstructions } from '../utils/storage'
import StarRating from './StarRating'

interface RecipeDetailProps {
  recipe: Recipe
  onDelete: (id: string) => void
  onToggleFavorite?: (id: string) => void
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onDelete, onToggleFavorite }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      onDelete(recipe.id)
    }
  }

  // Get combined ingredients from all sections
  const combinedIngredients = getCombinedIngredients(recipe)
  
  // Get sectioned instructions for display
  const sectionedInstructions = getSectionedInstructions(recipe)

  return (
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
        {/* Header */}
        <div className="mb-6">
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
                
                <StarRating rating={recipe.rating} size="lg" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Link
                to={`/recipes/${recipe.id}/edit`}
                className="btn-outline flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Link>
              
              <button
                onClick={handleDelete}
                className="btn-secondary text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Image */}
          {recipe.image && (
            <div className="mb-6">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
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
        </div>

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

        {/* Metadata */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
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
    </div>
  )
}

export default RecipeDetail
