import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../context/RecipesContext'
import Header from '../components/Header'
import ResponsivePage from '../components/ResponsivePage'
import Modal from '../components/Modal'
import OptionCard from '../components/OptionCard'
import RecipeForm from '../components/RecipeForm'
import UrlImportForm from '../components/UrlImportForm'
import BulkImportForm from '../components/BulkImportForm'
import { 
  PenTool, 
  Upload, 
  Database, 
  Camera,
  Plus
} from 'lucide-react'
import { RecipeFormData } from '../types/recipe'

const NewRecipePage: React.FC = () => {
  const navigate = useNavigate()
  const { addRecipe, bulkAddRecipes } = useRecipes()
  
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const handleManualSubmit = (formData: RecipeFormData) => {
    addRecipe(formData)
    setActiveModal(null)
    navigate('/recipes')
  }

  const handleUrlImportSubmit = (formData: RecipeFormData) => {
    addRecipe(formData)
    setActiveModal(null)
    navigate('/recipes')
  }

  const handleBulkImportSubmit = (recipes: any[]) => {
    bulkAddRecipes(recipes)
    setActiveModal(null)
    navigate('/recipes')
  }

  const handleCancel = () => {
    setActiveModal(null)
  }

  const optionCards = [
    {
      id: 'manual',
      title: 'Manual Entry',
      description: 'Create a new recipe by filling out the form with all the details yourself.',
      icon: PenTool,
      onClick: () => setActiveModal('manual')
    },
    {
      id: 'url',
      title: 'URL Import',
      description: 'Import a recipe from any website by pasting the URL. We\'ll extract the details for you.',
      icon: Upload,
      onClick: () => setActiveModal('url')
    },
    {
      id: 'bulk',
      title: 'Bulk Import',
      description: 'Import multiple recipes from CSV or JSON files with preview and selection.',
      icon: Database,
      onClick: () => setActiveModal('bulk')
    },
    {
      id: 'image',
      title: 'Image Upload',
      description: 'Upload an image of a recipe and we\'ll extract the details using AI.',
      icon: Camera,
      onClick: () => setActiveModal('image')
    }
  ]

  return (
    <ResponsivePage>
      <div className="min-h-screen bg-cream-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-full shadow-lg">
                <Plus className="h-12 w-12 text-sage-600" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Add New Recipe
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose how you'd like to add your recipe. We support multiple ways to get your recipes into your collection.
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {optionCards.map((option) => (
              <OptionCard
                key={option.id}
                title={option.title}
                description={option.description}
                icon={option.icon}
                onClick={option.onClick}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Or continue with the traditional method
            </p>
            <button
              onClick={() => navigate('/new')}
              className="btn-outline"
            >
              Go to Manual Entry Page
            </button>
          </div>
        </div>

        {/* Modals */}
        
        {/* Manual Entry Modal */}
        <Modal
          isOpen={activeModal === 'manual'}
          onClose={handleCancel}
          title="Manual Recipe Entry"
          size="lg"
        >
          <RecipeForm
            onSubmit={handleManualSubmit}
            onCancel={handleCancel}
            submitText="Save Recipe"
          />
        </Modal>

        {/* URL Import Modal */}
        <Modal
          isOpen={activeModal === 'url'}
          onClose={handleCancel}
          title="Import from URL"
          size="lg"
        >
          <UrlImportForm
            onSubmit={handleUrlImportSubmit}
            onCancel={handleCancel}
            submitText="Save Imported Recipe"
          />
        </Modal>

        {/* Bulk Import Modal */}
        <Modal
          isOpen={activeModal === 'bulk'}
          onClose={handleCancel}
          title="Bulk Import"
          size="xl"
        >
          <BulkImportForm
            onSubmit={handleBulkImportSubmit}
            onCancel={handleCancel}
            submitText="Import Selected Recipes"
          />
        </Modal>

        {/* Image Upload Modal - Placeholder */}
        <Modal
          isOpen={activeModal === 'image'}
          onClose={handleCancel}
          title="Image Upload"
          size="md"
        >
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Coming Soon: Image Upload
            </h3>
            <p className="text-gray-600 mb-6">
              We're working on AI-powered recipe extraction from images. 
              This feature will be available in a future update.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                What to expect:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Upload photos of recipe cards or printed recipes</li>
                <li>• AI will extract ingredients, instructions, and cooking times</li>
                <li>• Review and edit the extracted information</li>
                <li>• Save directly to your recipe collection</li>
              </ul>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCancel}
                className="btn-primary"
              >
                Got it
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </ResponsivePage>
  )
}

export default NewRecipePage