import React from 'react'
import { Link } from 'react-router-dom'
import { ChefHat, Plus, Upload, BookOpen, Search } from 'lucide-react'
import Header from '../components/Header'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-sage-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-full shadow-lg">
              <ChefHat className="h-16 w-16 text-sage-600" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Your Personal
            <span className="text-sage-600"> Recipe Collection</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Organize, discover, and enjoy your favorite recipes in one beautiful place. 
            Create, import, and manage your culinary creations with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/recipes"
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <BookOpen className="h-5 w-5" />
              <span>Browse Recipes</span>
            </Link>
            
            <Link
              to="/newrecipe"
              className="btn-secondary text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Recipe</span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-sage-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-sage-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Create Recipes
            </h3>
            <p className="text-gray-600">
              Manually add your favorite recipes with detailed ingredients, 
              instructions, and personal notes.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-wood-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-wood-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Import from Web
            </h3>
            <p className="text-gray-600">
              Import recipes from any website with our smart scraper. 
              Edit and customize before saving.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibent text-gray-900 mb-2">
              Smart Search
            </h3>
            <p className="text-gray-600">
              Find recipes quickly with powerful search, filters, 
              and tags. Rate and organize your collection.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Get Started
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/newrecipe"
              className="group p-6 border border-gray-200 rounded-lg hover:border-sage-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-sage-100 group-hover:bg-sage-200 rounded-lg p-3 transition-colors">
                  <Plus className="h-6 w-6 text-sage-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-sage-700">
                    Add Your First Recipe
                  </h3>
                  <p className="text-gray-600">
                    Start building your collection with a new recipe
                  </p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/import"
              className="group p-6 border border-gray-200 rounded-lg hover:border-sage-300 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-wood-100 group-hover:bg-wood-200 rounded-lg p-3 transition-colors">
                  <Upload className="h-6 w-6 text-wood-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-sage-700">
                    Import from Web
                  </h3>
                  <p className="text-gray-600">
                    Bring in recipes from your favorite websites
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LandingPage
