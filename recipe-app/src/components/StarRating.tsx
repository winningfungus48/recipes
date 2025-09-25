import React from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  interactive?: boolean
  size?: 'sm' | 'md' | 'lg'
  mobileInteractive?: boolean // Allow override for mobile interaction
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  interactive = false, 
  size = 'md',
  mobileInteractive = false
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3 md:w-4 md:h-4', // Mobile: smaller, Desktop: normal
    md: 'w-4 h-4 md:w-5 md:h-5', // Mobile: smaller, Desktop: normal  
    lg: 'w-5 h-5 md:w-6 md:h-6'  // Mobile: smaller, Desktop: normal
  }
  
  // Mobile interaction logic - disable on mobile unless explicitly enabled
  // Use CSS classes to handle mobile interaction instead of JavaScript
  const isInteractive = interactive

  const handleClick = (newRating: number) => {
    if (isInteractive && onRatingChange) {
      onRatingChange(newRating)
    }
  }

  const handleMouseEnter = (_newRating: number) => {
    // Could add hover effects here
  }

  return (
    <div className="flex items-center -space-x-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isHalfStar = rating >= star - 0.5 && rating < star
        const isFullStar = rating >= star
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            disabled={!isInteractive}
            className={`p-0.5 -m-0.5 ${
              isInteractive ? 'cursor-pointer' : 'cursor-default'
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
