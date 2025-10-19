import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChefHat, Plus, Upload, BookOpen, Search, Calendar, ShoppingCart } from 'lucide-react'
import Header from '../components/Header'

const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handlePopularSearch = (query: string) => {
    navigate(`/recipes?search=${encodeURIComponent(query)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-sage-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Compact Banner Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <ChefHat className="h-8 w-8 text-sage-600" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Your Recipe Dashboard
          </h1>
          
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Organize, create, and plan your meals all in one place.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Find Your Perfect Recipe</h2>
              <p className="text-gray-600">Search through your collection or discover new favorites</p>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes, ingredients, or cuisines…" 
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-sage-500 focus:ring-4 focus:ring-sage-100 transition-all duration-200 shadow-sm hover:shadow-md bg-white"
              />
              <button 
                type="submit"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-sage-600 hover:bg-sage-700 text-white p-3 rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-gray-500">Popular searches:</span>
              <button 
                onClick={() => handlePopularSearch('pasta')}
                className="px-3 py-1 bg-sage-50 hover:bg-sage-100 text-sage-700 rounded-full text-sm transition-colors duration-200"
              >
                Pasta
              </button>
              <button 
                onClick={() => handlePopularSearch('chicken')}
                className="px-3 py-1 bg-sage-50 hover:bg-sage-100 text-sage-700 rounded-full text-sm transition-colors duration-200"
              >
                Chicken
              </button>
              <button 
                onClick={() => handlePopularSearch('dessert')}
                className="px-3 py-1 bg-sage-50 hover:bg-sage-100 text-sage-700 rounded-full text-sm transition-colors duration-200"
              >
                Dessert
              </button>
              <button 
                onClick={() => handlePopularSearch('quick')}
                className="px-3 py-1 bg-sage-50 hover:bg-sage-100 text-sage-700 rounded-full text-sm transition-colors duration-200"
              >
                Quick
              </button>
            </div>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          <Link
            to="/recipes"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-sage-300 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-sage-100 group-hover:bg-sage-200 rounded-lg p-3 transition-colors">
                <BookOpen className="h-6 w-6 text-sage-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-sage-700">Browse Recipes</h3>
                <p className="text-sm text-gray-600">View your recipe collection</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/newrecipe"
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-sage-300 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-wood-100 group-hover:bg-wood-200 rounded-lg p-3 transition-colors">
                <Plus className="h-6 w-6 text-wood-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-sage-700">Add Recipe</h3>
                <p className="text-sm text-gray-600">Create a new recipe</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <Link
            to="/import"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-sage-300 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-sage-50 group-hover:bg-sage-100 rounded-md p-2 transition-colors">
                <Upload className="h-5 w-5 text-sage-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-sage-700">Import from Web</h4>
                <p className="text-sm text-gray-600">Import recipes from URLs</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/cookbooks"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-sage-300 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-sage-50 group-hover:bg-sage-100 rounded-md p-2 transition-colors">
                <BookOpen className="h-5 w-5 text-sage-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-sage-700">Cookbooks</h4>
                <p className="text-sm text-gray-600">Organize recipe collections</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/meal-plans"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-sage-300 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-sage-50 group-hover:bg-sage-100 rounded-md p-2 transition-colors">
                <Calendar className="h-5 w-5 text-sage-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-sage-700">Meal Plans</h4>
                <p className="text-sm text-gray-600">Plan your weekly meals</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/shopping-list"
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-sage-300 transition-all duration-200 group"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-sage-50 group-hover:bg-sage-100 rounded-md p-2 transition-colors">
                <ShoppingCart className="h-5 w-5 text-sage-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 group-hover:text-sage-700">Shopping List</h4>
                <p className="text-sm text-gray-600">Generate shopping lists</p>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default LandingPage
