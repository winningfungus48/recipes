import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Recipe } from '../types'
import { deleteRecipe, loadAppStorage, upsertRecipe } from '../services/storage'

interface RecipeContextValue {
  recipes: Recipe[]
  refresh: () => void
  addRecipe: (recipe: Recipe) => void
  updateRecipe: (recipe: Recipe) => void
  removeRecipe: (id: string) => void
}

const RecipeContext = createContext<RecipeContextValue | null>(null)

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(() => loadAppStorage().recipes)

  const refresh = useCallback(() => {
    setRecipes(loadAppStorage().recipes)
  }, [])

  const addRecipe = useCallback((recipe: Recipe) => {
    upsertRecipe(recipe)
    setRecipes(loadAppStorage().recipes)
  }, [])

  const updateRecipe = useCallback((recipe: Recipe) => {
    upsertRecipe({ ...recipe, updatedAt: new Date().toISOString() })
    setRecipes(loadAppStorage().recipes)
  }, [])

  const removeRecipe = useCallback((id: string) => {
    deleteRecipe(id)
    setRecipes(loadAppStorage().recipes)
  }, [])

  const value = useMemo(
    () => ({ recipes, refresh, addRecipe, updateRecipe, removeRecipe }),
    [recipes, refresh, addRecipe, updateRecipe, removeRecipe]
  )

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
}

export function useRecipes(): RecipeContextValue {
  const ctx = useContext(RecipeContext)
  if (!ctx) throw new Error('useRecipes must be used within RecipeProvider')
  return ctx
}
