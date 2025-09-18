import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRecipes } from '../context/RecipesContext'
import Header from '../components/Header'
import RecipeDetail from '../components/RecipeDetail'

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getRecipeById, deleteRecipe, toggleFavorite } = useRecipes()

  const recipe = id ? getRecipeById(id) : undefined

  const handleDelete = (recipeId: string) => {
    deleteRecipe(recipeId)
    navigate('/recipes')
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Recipe Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The recipe you're looking for doesn't exist or has been deleted.
            </p>
            <button
              onClick={() => navigate('/recipes')}
              className="btn-primary"
            >
              Back to Recipes
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecipeDetail
          recipe={recipe}
          onDelete={handleDelete}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  )
}

export default RecipeDetailPage
