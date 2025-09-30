import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChefHat, Plus, Upload, BookOpen, Settings, FileText, Menu } from 'lucide-react'
import MobileNavigationDrawer from './MobileNavigationDrawer'

const Header: React.FC = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-sage-600" />
            <span className="text-xl font-display font-bold text-gray-900">
              Recipe App
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/recipes"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/recipes')
                  ? 'bg-sage-100 text-sage-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Recipes</span>
            </Link>
            
            <Link
              to="/newrecipe"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/newrecipe')
                  ? 'bg-sage-600 text-white shadow-md'
                  : 'bg-sage-100 text-sage-700 hover:bg-sage-200 hover:shadow-sm'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>New Recipe</span>
            </Link>
            
            <Link
              to="/manage"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/manage')
                  ? 'bg-sage-100 text-sage-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Manage</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 p-2 -m-2"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Drawer */}
      <MobileNavigationDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  )
}

export default Header
