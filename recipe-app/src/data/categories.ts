import { Category, Difficulty } from '../types/recipe'

export const CATEGORIES: Category[] = [
  'Breakfast',
  'Lunch/Dinner', 
  'Desserts',
  'Appetizers',
  'Drinks',
  'Other'
]

export const DIFFICULTIES: Difficulty[] = [
  'Easy',
  'Medium',
  'Hard'
]

export const CATEGORY_ICONS: Record<Category, string> = {
  'Breakfast': '🥞',
  'Lunch/Dinner': '🍽️',
  'Desserts': '🍰',
  'Appetizers': '🥗',
  'Drinks': '🥤',
  'Other': '📝'
}

export const CATEGORY_COLORS: Record<Category, string> = {
  'Breakfast': 'bg-yellow-100 text-yellow-800',
  'Lunch/Dinner': 'bg-green-100 text-green-800',
  'Desserts': 'bg-pink-100 text-pink-800',
  'Appetizers': 'bg-blue-100 text-blue-800',
  'Drinks': 'bg-purple-100 text-purple-800',
  'Other': 'bg-gray-100 text-gray-800'
}

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  'Easy': 'bg-green-100 text-green-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'Hard': 'bg-red-100 text-red-800'
}

export const DIFFICULTY_ICONS: Record<Difficulty, string> = {
  'Easy': '⭐',
  'Medium': '⭐⭐',
  'Hard': '⭐⭐⭐'
}
