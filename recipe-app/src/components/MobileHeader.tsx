import React from 'react'
import { Heart } from 'lucide-react'
import StarRating from './StarRating'
import EllipsisMenu from './EllipsisMenu'

interface MobileHeaderProps {
  title: string
  rating: number
  isFavorite: boolean
  onToggleFavorite?: () => void
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  rating,
  isFavorite,
  onToggleFavorite,
  onEdit,
  onDelete,
  className = ''
}) => {
  return (
    <div className={`md:hidden ${className}`}>
      {/* Line 1: Title (ellipsis-truncated) */}
      <h1 className="text-xl font-semibold text-gray-900 mb-2 truncate">
        {title}
      </h1>
      
      {/* Line 2: Stars (left) and Heart + Menu (right) */}
      <div className="flex items-center justify-between min-w-0">
        <div className="flex items-center min-w-0 flex-1">
          <StarRating 
            rating={rating} 
            size="md" 
            interactive={false}
          />
        </div>
        
        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleFavorite()
              }}
              className="text-gray-400 hover:text-red-500 transition-colors p-0.5 -m-0.5"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-current' : ''}`} />
            </button>
          )}
          
          {(onEdit || onDelete) && (
            <EllipsisMenu
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default MobileHeader
