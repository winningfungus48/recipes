import React from 'react'
import { LucideIcon } from 'lucide-react'

interface OptionCardProps {
  title: string
  description: string
  icon: LucideIcon
  onClick: () => void
  className?: string
}

const OptionCard: React.FC<OptionCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        group relative bg-white rounded-lg border border-gray-200 p-6 text-left
        hover:border-sage-300 hover:shadow-md transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2
        min-h-[120px] w-full
        ${className}
      `}
      aria-label={`${title} - ${description}`}
    >
      <div className="flex flex-col h-full">
        {/* Icon */}
        <div className="flex-shrink-0 mb-4">
          <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center group-hover:bg-sage-200 transition-colors">
            <Icon className="h-6 w-6 text-sage-600" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-sage-700 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Hover indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
        </div>
      </div>
    </button>
  )
}

export default OptionCard
