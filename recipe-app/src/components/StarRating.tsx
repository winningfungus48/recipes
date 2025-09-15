import React from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  interactive?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  interactive = false, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating)
    }
  }

  const handleMouseEnter = (_newRating: number) => {
    // Could add hover effects here
  }

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isHalfStar = rating >= star - 0.5 && rating < star
        const isFullStar = rating >= star
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            disabled={!interactive}
            className={`${sizeClasses[size]} ${
              interactive ? 'cursor-pointer' : 'cursor-default'
            } transition-colors duration-150`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFullStar || isHalfStar ? 'text-yellow-400' : 'text-gray-300'
              } ${
                isHalfStar ? 'fill-yellow-400' : isFullStar ? 'fill-yellow-400' : 'fill-none'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
