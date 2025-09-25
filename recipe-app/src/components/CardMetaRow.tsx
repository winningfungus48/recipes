import React from 'react'
import { Clock, Tag } from 'lucide-react'
import { CATEGORY_ICONS, CATEGORY_COLORS, DIFFICULTY_COLORS, DIFFICULTY_ICONS } from '../data/categories'
import { getTagColor } from '../data/tags'

interface CardMetaRowProps {
  category: string
  difficulty?: string
  cookTime?: string
  tags: string[]
  className?: string
}

const CardMetaRow: React.FC<CardMetaRowProps> = ({
  category,
  difficulty,
  cookTime,
  tags,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Category and Difficulty badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[category]} flex-shrink-0`}>
          {CATEGORY_ICONS[category]} {category}
        </span>
        
        {difficulty && (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[difficulty]} flex-shrink-0`}>
            {DIFFICULTY_ICONS[difficulty]} {difficulty}
          </span>
        )}
      </div>
      
      {/* Cook Time - Only show on mobile */}
      {cookTime && (
        <div className="md:hidden flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span className="whitespace-nowrap">{cookTime}</span>
        </div>
      )}
      
      {/* Tags - Hidden on mobile, visible on desktop */}
      {tags.length > 0 && (
        <div className="hidden md:flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={tag}
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag, index)}`}
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default CardMetaRow
