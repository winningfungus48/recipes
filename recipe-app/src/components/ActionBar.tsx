import React from 'react'
import { Edit, Trash2 } from 'lucide-react'

interface ActionBarProps {
  onEdit: () => void
  onDelete?: () => void
  className?: string
}

const ActionBar: React.FC<ActionBarProps> = ({
  onEdit,
  onDelete,
  className = ''
}) => {
  return (
    <>
      {/* Desktop/Tablet: Edit + Delete buttons */}
      <div className={`hidden md:flex space-x-2 ${className}`}>
        <button
          onClick={onEdit}
          className="btn-outline-sm flex items-center space-x-1"
        >
          <Edit className="h-3 w-3" />
          <span>Edit</span>
        </button>
        
        {onDelete && (
          <button
            onClick={onDelete}
            className="btn-secondary-sm text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center space-x-1"
          >
            <Trash2 className="h-3 w-3" />
            <span>Delete</span>
          </button>
        )}
      </div>
      
      {/* Mobile: Sticky action bar with Edit only */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 ${className}`}
        data-mobile-only="true"
      >
        <div className="px-4 py-3">
          <button
            onClick={onEdit}
            className="w-full bg-sage-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 min-h-[48px] hover:bg-sage-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Recipe</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default ActionBar
