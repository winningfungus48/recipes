export const POPULAR_TAGS = [
  'easy',
  'quick',
  'healthy',
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'low-carb',
  'high-protein',
  'one-pot',
  'meal-prep',
  'comfort-food',
  'spicy',
  'sweet',
  'savory',
  'chicken',
  'beef',
  'fish',
  'pasta',
  'salad',
  'soup',
  'baked',
  'grilled',
  'fried',
  'raw'
]

export const TAG_COLORS = [
  'bg-gray-100 text-gray-800',
  'bg-red-100 text-red-800',
  'bg-orange-100 text-orange-800',
  'bg-yellow-100 text-yellow-800',
  'bg-green-100 text-green-800',
  'bg-teal-100 text-teal-800',
  'bg-blue-100 text-blue-800',
  'bg-indigo-100 text-indigo-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800'
]

export const getTagColor = (_tag: string, index: number = 0): string => {
  return TAG_COLORS[index % TAG_COLORS.length]
}
