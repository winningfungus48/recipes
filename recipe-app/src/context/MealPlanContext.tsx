import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { MealPlan } from '../types'
import { loadAppStorage, saveAppStorage } from '../services/storage'

interface MealPlanContextValue {
  mealPlans: MealPlan[]
  refresh: () => void
  saveAll: (list: MealPlan[]) => void
}

const MealPlanContext = createContext<MealPlanContextValue | null>(null)

export function MealPlanProvider({ children }: { children: React.ReactNode }) {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(() => loadAppStorage().mealPlans)

  const refresh = useCallback(() => setMealPlans(loadAppStorage().mealPlans), [])

  const saveAll = useCallback((list: MealPlan[]) => {
    const cur = loadAppStorage()
    saveAppStorage({ ...cur, mealPlans: list })
    setMealPlans(list)
  }, [])

  const value = useMemo(
    () => ({ mealPlans, refresh, saveAll }),
    [mealPlans, refresh, saveAll]
  )

  return <MealPlanContext.Provider value={value}>{children}</MealPlanContext.Provider>
}

export function useMealPlans(): MealPlanContextValue {
  const ctx = useContext(MealPlanContext)
  if (!ctx) throw new Error('useMealPlans must be used within MealPlanProvider')
  return ctx
}
