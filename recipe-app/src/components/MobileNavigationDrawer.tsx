import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, ChefHat, BookOpen, Plus, Upload, FileText, Settings } from 'lucide-react'

interface MobileNavigationDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const MobileNavigationDrawer: React.FC<MobileNavigationDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-6 w-6 text-sage-600" />
            <span className="text-lg font-display font-bold text-gray-900">
              Recipe App
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 -m-1"
            aria-label="Close navigation"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          <Link
            to="/"
            onClick={onClose}
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
              isActive('/')
                ? 'bg-sage-100 text-sage-700'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <ChefHat className="h-5 w-5" />
            <span>Home</span>
          </Link>
          
          <Link
            to="/recipes"
            onClick={onClose}
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
              isActive('/recipes')
                ? 'bg-sage-100 text-sage-700'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span>Recipes</span>
          </Link>
          
          <Link
            to="/newrecipe"
            onClick={onClose}
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
              isActive('/newrecipe')
                ? 'bg-sage-100 text-sage-700'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Plus className="h-5 w-5" />
            <span>New Recipe</span>
          </Link>
          
          <div className="border-t border-gray-200 my-4" />
          
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Import Options
            </div>
            
            <Link
              to="/import"
              onClick={onClose}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                isActive('/import')
                  ? 'bg-sage-100 text-sage-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Upload className="h-5 w-5" />
              <span>Import from URL</span>
            </Link>
            
            <Link
              to="/import/bulk"
              onClick={onClose}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                isActive('/import/bulk')
                  ? 'bg-sage-100 text-sage-700'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Bulk Import</span>
            </Link>
          </div>
          
          <div className="border-t border-gray-200 my-4" />
          
          <Link
            to="/manage"
            onClick={onClose}
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
              isActive('/manage')
                ? 'bg-sage-100 text-sage-700'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Manage</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default MobileNavigationDrawer
