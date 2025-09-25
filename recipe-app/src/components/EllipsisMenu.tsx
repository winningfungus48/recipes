import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical, Edit, Trash2 } from 'lucide-react'

interface EllipsisMenuProps {
  onEdit: () => void
  onDelete?: () => void
  className?: string
}

const EllipsisMenu: React.FC<EllipsisMenuProps> = ({
  onEdit,
  onDelete,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleEdit = () => {
    onEdit()
    setIsOpen(false)
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete()
      setIsOpen(false)
    }
  }

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Ellipsis Button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="text-gray-400 hover:text-gray-600 transition-colors p-1 -m-1 rounded-full hover:bg-gray-100"
        aria-label="More options"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
          <div className="py-1">
            <button
              onClick={handleEdit}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
            >
              <Edit className="h-3 w-3" />
              <span>Edit</span>
            </button>
            
            {onDelete && (
              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EllipsisMenu
