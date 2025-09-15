import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRecipes } from '../context/RecipesContext'
import Header from '../components/Header'
import RecipeForm from '../components/RecipeForm'
import { RecipeFormData } from '../types/recipe'

const EditRecipePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getRecipeById, updateRecipe } = useRecipes()

  const recipe = id ? getRecipeById(id) : undefined

  const handleSubmit = (formData: RecipeFormData) => {
    if (recipe) {
      updateRecipe({
        ...recipe,
        ...formData
      })
      navigate(`/recipes/${recipe.id}`)
    }
  }

  const handleCancel = () => {
    if (recipe) {
      navigate(`/recipes/${recipe.id}`)
    } else {
      navigate('/recipes')
    }
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
              The recipe you're trying to edit doesn't exist or has been deleted.
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Recipe
          </h1>
          <p className="text-gray-600 mt-2">
            Update your recipe details below.
          </p>
        </div>

        <div className="card">
          <RecipeForm
            initialData={recipe}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitText="Update Recipe"
          />
        </div>
      </div>
    </div>
  )
}

export default EditRecipePage
