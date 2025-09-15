import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../context/RecipesContext'
import Header from '../components/Header'
import RecipeForm from '../components/RecipeForm'
import { RecipeFormData } from '../types/recipe'

const NewRecipePage: React.FC = () => {
  const navigate = useNavigate()
  const { addRecipe } = useRecipes()

  const handleSubmit = (formData: RecipeFormData) => {
    addRecipe(formData)
    navigate('/recipes')
  }

  const handleCancel = () => {
    navigate('/recipes')
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Add New Recipe
          </h1>
          <p className="text-gray-600 mt-2">
            Create a new recipe by filling out the form below.
          </p>
        </div>

        <div className="card">
          <RecipeForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitText="Save Recipe"
          />
        </div>
      </div>
    </div>
  )
}

export default NewRecipePage
