import React from 'react'
import { Grid3X3, List } from 'lucide-react'
import { ViewMode } from '../types/recipe'

interface LayoutToggleProps {
  viewMode: ViewMode
  onViewModeChange: (viewMode: ViewMode) => void
}

const LayoutToggle: React.FC<LayoutToggleProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onViewModeChange({ type: 'grid' })}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode.type === 'grid'
            ? 'bg-white text-sage-700 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Grid3X3 className="h-4 w-4" />
        <span>Grid</span>
      </button>
      
      <button
        onClick={() => onViewModeChange({ type: 'list' })}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          viewMode.type === 'list'
            ? 'bg-white text-sage-700 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List className="h-4 w-4" />
        <span>List</span>
      </button>
    </div>
  )
}

export default LayoutToggle
