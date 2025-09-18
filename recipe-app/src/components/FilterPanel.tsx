import React, { useState } from 'react'
import { Search, Filter, X, Star, Image, Heart, Clock } from 'lucide-react'
import { FilterOptions, Difficulty } from '../types/recipe'
import { CATEGORIES, DIFFICULTIES } from '../data/categories'
import { POPULAR_TAGS, getTagColor } from '../data/tags'

interface FilterPanelProps {
  filters: FilterOptions
  onFiltersChange: (filters: Partial<FilterOptions>) => void
  onClearFilters: () => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false)


  const handleCategoryChange = (category: string) => {
    onFiltersChange({ category: category as FilterOptions['category'] })
  }

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    onFiltersChange({ tags: newTags })
  }

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    onFiltersChange({ sortBy })
  }

  const handleSortOrderChange = () => {
    onFiltersChange({ 
      sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
    })
  }

  const hasActiveFilters = filters.category !== 'All' || filters.tags.length > 0 || 
    filters.difficulty !== 'All' || filters.rating > 0 || filters.hasImage || filters.isFavorite || filters.recentlyAdded

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      <div className={`space-y-4 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="input-field"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={filters.difficulty}
            onChange={(e) => onFiltersChange({ difficulty: e.target.value as Difficulty | 'All' })}
            className="input-field"
          >
            <option value="All">All Difficulties</option>
            {DIFFICULTIES.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.rating}
              onChange={(e) => onFiltersChange({ rating: parseFloat(e.target.value) })}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 w-8">
              {filters.rating > 0 ? filters.rating : 'Any'}
            </span>
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Filters
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasImage}
                onChange={(e) => onFiltersChange({ hasImage: e.target.checked })}
                className="h-4 w-4 text-sage-600 focus:ring-sage-500 border-gray-300 rounded"
              />
              <Image className="h-4 w-4 ml-2 mr-2" />
              <span className="text-sm text-gray-700">Has Image</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.isFavorite}
                onChange={(e) => onFiltersChange({ isFavorite: e.target.checked })}
                className="h-4 w-4 text-sage-600 focus:ring-sage-500 border-gray-300 rounded"
              />
              <Heart className="h-4 w-4 ml-2 mr-2" />
              <span className="text-sm text-gray-700">Favorites Only</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.recentlyAdded}
                onChange={(e) => onFiltersChange({ recentlyAdded: e.target.checked })}
                className="h-4 w-4 text-sage-600 focus:ring-sage-500 border-gray-300 rounded"
              />
              <Clock className="h-4 w-4 ml-2 mr-2" />
              <span className="text-sm text-gray-700">Recently Added (7 days)</span>
            </label>
          </div>
        </div>

        {/* Tags Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TAGS.map((tag, index) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.tags.includes(tag)
                    ? getTagColor(tag, index)
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <div className="flex space-x-2">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as FilterOptions['sortBy'])}
              className="input-field flex-1"
            >
              <option value="title">Title</option>
              <option value="rating">Rating</option>
              <option value="createdAt">Date Added</option>
              <option value="cookTime">Cook Time</option>
              <option value="prepTime">Prep Time</option>
            </select>
            
            <button
              onClick={handleSortOrderChange}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title={`Sort ${filters.sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {filters.sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
            <span>Clear all filters</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterPanel
