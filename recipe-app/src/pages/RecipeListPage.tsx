import React from 'react'
import { useRecipes } from '../context/RecipesContext'
import Header from '../components/Header'
import FilterPanel from '../components/FilterPanel'
import LayoutToggle from '../components/LayoutToggle'
import RecipeCard from '../components/RecipeCard'
import { Search } from 'lucide-react'

const RecipeListPage: React.FC = () => {
  const { state, setFilters, setViewMode, clearFilters, toggleFavorite } = useRecipes()

  if (state.loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading recipes...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Recipes
            </h1>
            <p className="text-gray-600 mt-1">
              {state.filteredRecipes.length} recipe{state.filteredRecipes.length !== 1 ? 's' : ''}
              {state.recipes.length !== state.filteredRecipes.length && 
                ` of ${state.recipes.length} total`
              }
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <LayoutToggle
              viewMode={state.viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={state.filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="Search by title, ingredients, or tags..."
              className="input-field pl-10 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel
              filters={state.filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Recipes Grid/List */}
          <div className="lg:col-span-3">
            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{state.error}</p>
              </div>
            )}

            {state.filteredRecipes.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍽️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {state.recipes.length === 0 ? 'No recipes yet' : 'No recipes match your filters'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {state.recipes.length === 0 
                    ? 'Start building your recipe collection by adding your first recipe.'
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
                {state.recipes.length === 0 && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/new"
                      className="btn-primary"
                    >
                      Add Your First Recipe
                    </a>
                    <a
                      href="/import"
                      className="btn-outline"
                    >
                      Import from Web
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className={
                state.viewMode.type === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {state.filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    viewMode={state.viewMode.type}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeListPage
