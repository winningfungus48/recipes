import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Recipe, FilterOptions, ViewMode } from '../types/recipe'
import { saveRecipes, createRecipe, updateRecipe, loadRecipesWithMigration, searchRecipe, saveViewMode, loadViewMode } from '../utils/storage'

// Utility function to parse time strings to minutes
const parseTime = (timeStr: string): number => {
  if (!timeStr) return 0
  const match = timeStr.match(/(\d+)\s*(min|hour|hr|h|m)/i)
  if (!match) return 0
  const value = parseInt(match[1])
  const unit = match[2].toLowerCase()
  return unit.includes('hour') || unit.includes('hr') || unit.includes('h') ? value * 60 : value
}

interface RecipesState {
  recipes: Recipe[]
  filteredRecipes: Recipe[]
  filters: FilterOptions
  viewMode: ViewMode
  loading: boolean
  error: string | null
}

type RecipesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_RECIPES'; payload: Recipe[] }
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'UPDATE_RECIPE'; payload: Recipe }
  | { type: 'DELETE_RECIPE'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'BULK_ADD_RECIPES'; payload: Recipe[] }
  | { type: 'SET_FILTERS'; payload: Partial<FilterOptions> }
  | { type: 'SET_VIEW_MODE'; payload: ViewMode }
  | { type: 'LOAD_VIEW_MODE' }
  | { type: 'APPLY_FILTERS' }

const initialState: RecipesState = {
  recipes: [],
  filteredRecipes: [],
  filters: {
    search: '',
    category: 'All',
    tags: [],
    difficulty: 'All',
    rating: 0,
    hasImage: false,
    isFavorite: false,
    recentlyAdded: false,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  },
  viewMode: { type: 'list' },
  loading: false,
  error: null
}

const recipesReducer = (state: RecipesState, action: RecipesAction): RecipesState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'LOAD_RECIPES':
      return { ...state, recipes: action.payload, filteredRecipes: action.payload }
    
    case 'ADD_RECIPE':
      const newRecipes = [...state.recipes, action.payload]
      saveRecipes(newRecipes)
      return { ...state, recipes: newRecipes }
    
    case 'UPDATE_RECIPE':
      const updatedRecipes = state.recipes.map(recipe =>
        recipe.id === action.payload.id ? action.payload : recipe
      )
      saveRecipes(updatedRecipes)
      return { ...state, recipes: updatedRecipes }
    
    case 'DELETE_RECIPE':
      const filteredRecipes = state.recipes.filter(recipe => recipe.id !== action.payload)
      saveRecipes(filteredRecipes)
      return { ...state, recipes: filteredRecipes }
    
    case 'TOGGLE_FAVORITE':
      const toggledRecipes = state.recipes.map(recipe =>
        recipe.id === action.payload 
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
      saveRecipes(toggledRecipes)
      
      // Update filteredRecipes to reflect the change
      const updatedFilteredRecipes = state.filteredRecipes.map(recipe =>
        recipe.id === action.payload 
          ? { ...recipe, isFavorite: !recipe.isFavorite }
          : recipe
      )
      
      return { ...state, recipes: toggledRecipes, filteredRecipes: updatedFilteredRecipes }
    
    case 'BULK_ADD_RECIPES':
      const allRecipes = [...state.recipes, ...action.payload]
      saveRecipes(allRecipes)
      return { ...state, recipes: allRecipes }
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    
    case 'SET_VIEW_MODE':
      saveViewMode(action.payload)
      return { ...state, viewMode: action.payload }
    
    case 'LOAD_VIEW_MODE':
      return { ...state, viewMode: loadViewMode() }
    
    case 'APPLY_FILTERS':
      let filtered = [...state.recipes]
      
      // Apply search filter
      if (state.filters.search) {
        filtered = filtered.filter(recipe => searchRecipe(recipe, state.filters.search))
      }
      
      // Apply category filter
      if (state.filters.category !== 'All') {
        filtered = filtered.filter(recipe => recipe.category === state.filters.category)
      }
      
      // Apply difficulty filter
      if (state.filters.difficulty !== 'All') {
        filtered = filtered.filter(recipe => recipe.difficulty === state.filters.difficulty)
      }
      
      // Apply rating filter
      if (state.filters.rating > 0) {
        filtered = filtered.filter(recipe => recipe.rating >= state.filters.rating)
      }
      
      // Apply has image filter
      if (state.filters.hasImage) {
        filtered = filtered.filter(recipe => !!recipe.image)
      }
      
      // Apply favorite filter
      if (state.filters.isFavorite) {
        filtered = filtered.filter(recipe => recipe.isFavorite === true)
      }
      
      // Apply recently added filter (last 7 days)
      if (state.filters.recentlyAdded) {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        filtered = filtered.filter(recipe => 
          new Date(recipe.createdAt) > weekAgo
        )
      }
      
      // Apply tags filter
      if (state.filters.tags.length > 0) {
        filtered = filtered.filter(recipe =>
          state.filters.tags.every(tag => recipe.tags.includes(tag))
        )
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        let comparison = 0
        
        switch (state.filters.sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title)
            break
          case 'rating':
            comparison = a.rating - b.rating
            break
          case 'createdAt':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            break
          case 'cookTime':
            comparison = parseTime(a.cookTime) - parseTime(b.cookTime)
            break
          case 'prepTime':
            comparison = parseTime(a.prepTime || '0') - parseTime(b.prepTime || '0')
            break
        }
        
        return state.filters.sortOrder === 'asc' ? comparison : -comparison
      })
      
      return { ...state, filteredRecipes: filtered }
    
    default:
      return state
  }
}

interface RecipesContextType {
  state: RecipesState
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateRecipe: (recipe: Recipe) => void
  deleteRecipe: (id: string) => void
  toggleFavorite: (id: string) => void
  bulkAddRecipes: (recipes: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>[]) => void
  setFilters: (filters: Partial<FilterOptions>) => void
  setViewMode: (viewMode: ViewMode) => void
  applyFilters: () => void
  clearFilters: () => void
  getRecipeById: (id: string) => Recipe | undefined
}

const RecipesContext = createContext<RecipesContextType | undefined>(undefined)

export const RecipesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(recipesReducer, initialState)

  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const recipes = loadRecipesWithMigration()
        dispatch({ type: 'LOAD_RECIPES', payload: recipes })
        
        // Load saved view mode preference
        dispatch({ type: 'LOAD_VIEW_MODE' })
      } catch (error) {
        console.error('Failed to load recipes:', error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load recipes' })
        // Load empty array as fallback to prevent app crash
        dispatch({ type: 'LOAD_RECIPES', payload: [] })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    loadInitialData()
  }, [])

  useEffect(() => {
    dispatch({ type: 'APPLY_FILTERS' })
  }, [state.filters, state.recipes.length]) // Only depend on recipes length, not the entire recipes array

  const addRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    const recipe = createRecipe(recipeData)
    dispatch({ type: 'ADD_RECIPE', payload: recipe })
  }

  const updateRecipeHandler = (recipe: Recipe) => {
    const updatedRecipe = updateRecipe(recipe)
    dispatch({ type: 'UPDATE_RECIPE', payload: updatedRecipe })
  }

  const deleteRecipe = (id: string) => {
    dispatch({ type: 'DELETE_RECIPE', payload: id })
  }

  const toggleFavorite = (id: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: id })
  }

  const bulkAddRecipes = (recipesData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    const recipes = recipesData.map(recipeData => createRecipe(recipeData))
    dispatch({ type: 'BULK_ADD_RECIPES', payload: recipes })
  }

  const setFilters = (filters: Partial<FilterOptions>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters })
  }

  const setViewMode = (viewMode: ViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: viewMode })
  }

  const applyFilters = () => {
    dispatch({ type: 'APPLY_FILTERS' })
  }

  const clearFilters = () => {
    dispatch({ type: 'SET_FILTERS', payload: {
      search: '',
      category: 'All',
      tags: [],
      difficulty: 'All',
      rating: 0,
      hasImage: false,
      isFavorite: false,
      recentlyAdded: false,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }})
  }

  const getRecipeById = (id: string): Recipe | undefined => {
    return state.recipes.find(recipe => recipe.id === id)
  }

  const value: RecipesContextType = {
    state,
    addRecipe,
    updateRecipe: updateRecipeHandler,
    deleteRecipe,
    toggleFavorite,
    bulkAddRecipes,
    setFilters,
    setViewMode,
    applyFilters,
    clearFilters,
    getRecipeById
  }

  return (
    <RecipesContext.Provider value={value}>
      {children}
    </RecipesContext.Provider>
  )
}

export const useRecipes = (): RecipesContextType => {
  const context = useContext(RecipesContext)
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipesProvider')
  }
  return context
}
