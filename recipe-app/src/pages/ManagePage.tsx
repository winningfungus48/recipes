import React, { useState } from 'react'
import { useRecipes } from '../context/RecipesContext'
import Header from '../components/Header'
import { Tag, Folder, Edit2, Trash2, Plus, X } from 'lucide-react'
import { Category } from '../types/recipe'

const ManagePage: React.FC = () => {
  const { state, updateRecipe } = useRecipes()
  const [activeTab, setActiveTab] = useState<'tags' | 'categories'>('tags')
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newTag, setNewTag] = useState('')

  // Get all unique tags from recipes
  const allTags = Array.from(new Set(state.recipes.flatMap(recipe => recipe.tags))).sort()
  const allCategories = Array.from(new Set(state.recipes.map(recipe => recipe.category))).sort()

  const handleRenameTag = (oldTag: string, newTag: string) => {
    if (!newTag.trim() || newTag === oldTag) return

    // Update all recipes that use this tag
    const updatedRecipes = state.recipes.map(recipe => ({
      ...recipe,
      tags: recipe.tags.map(tag => tag === oldTag ? newTag : tag)
    }))

    updatedRecipes.forEach(recipe => updateRecipe(recipe))
    setEditingTag(null)
  }

  const handleDeleteTag = (tagToDelete: string) => {
    if (!window.confirm(`Are you sure you want to delete the tag "${tagToDelete}"? This will remove it from all recipes.`)) {
      return
    }

    // Remove tag from all recipes
    const updatedRecipes = state.recipes.map(recipe => ({
      ...recipe,
      tags: recipe.tags.filter(tag => tag !== tagToDelete)
    }))

    updatedRecipes.forEach(recipe => updateRecipe(recipe))
  }

  const handleAddTag = () => {
    if (!newTag.trim() || allTags.includes(newTag)) return

    // Add tag to first recipe as a placeholder (tags will be managed per recipe)
    if (state.recipes.length > 0) {
      const firstRecipe = state.recipes[0]
      updateRecipe({
        ...firstRecipe,
        tags: [...firstRecipe.tags, newTag]
      })
    }

    setNewTag('')
  }

  const handleRenameCategory = (oldCategory: Category, newCategory: string) => {
    if (!newCategory.trim() || newCategory === oldCategory) return

    // Update all recipes that use this category
    const updatedRecipes = state.recipes.map(recipe => ({
      ...recipe,
      category: recipe.category === oldCategory ? newCategory as Category : recipe.category
    }))

    updatedRecipes.forEach(recipe => updateRecipe(recipe))
    setEditingCategory(null)
  }

  const getTagUsageCount = (tag: string) => {
    return state.recipes.filter(recipe => recipe.tags.includes(tag)).length
  }

  const getCategoryUsageCount = (category: Category) => {
    return state.recipes.filter(recipe => recipe.category === category).length
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Tags & Categories
          </h1>
          <p className="text-gray-600 mt-2">
            Organize your recipe collection by managing tags and categories.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('tags')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tags'
                  ? 'bg-white text-sage-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Tag className="h-4 w-4" />
              <span>Tags ({allTags.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'bg-white text-sage-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Folder className="h-4 w-4" />
              <span>Categories ({allCategories.length})</span>
            </button>
          </div>
        </div>

        {/* Tags Tab */}
        {activeTab === 'tags' && (
          <div className="space-y-6">
            {/* Add New Tag */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Tag</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter tag name"
                  className="input-field flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag()
                    }
                  }}
                />
                <button
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || allTags.includes(newTag)}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Tags List */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">All Tags</h2>
              {allTags.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No tags found. Add some tags to your recipes!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allTags.map((tag) => (
                    <div key={tag} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{tag}</span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setEditingTag(tag)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Used in {getTagUsageCount(tag)} recipe{getTagUsageCount(tag) !== 1 ? 's' : ''}
                      </p>
                      
                      {/* Edit Mode */}
                      {editingTag === tag && (
                        <div className="mt-3 flex space-x-2">
                          <input
                            type="text"
                            defaultValue={tag}
                            className="input-field text-sm flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleRenameTag(tag, e.currentTarget.value)
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => setEditingTag(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Categories List */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">All Categories</h2>
              {allCategories.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No categories found.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allCategories.map((category) => (
                    <div key={category} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{category}</span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Used in {getCategoryUsageCount(category)} recipe{getCategoryUsageCount(category) !== 1 ? 's' : ''}
                      </p>
                      
                      {/* Edit Mode */}
                      {editingCategory === category && (
                        <div className="mt-3 flex space-x-2">
                          <input
                            type="text"
                            defaultValue={category}
                            className="input-field text-sm flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleRenameCategory(category, e.currentTarget.value)
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManagePage
