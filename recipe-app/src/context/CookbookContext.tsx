import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { Cookbook } from '../types'
import { loadAppStorage, saveAppStorage } from '../services/storage'

interface CookbookContextValue {
  cookbooks: Cookbook[]
  refresh: () => void
  saveAll: (list: Cookbook[]) => void
}

const CookbookContext = createContext<CookbookContextValue | null>(null)

export function CookbookProvider({ children }: { children: React.ReactNode }) {
  const [cookbooks, setCookbooks] = useState<Cookbook[]>(() => loadAppStorage().cookbooks)

  const refresh = useCallback(() => setCookbooks(loadAppStorage().cookbooks), [])

  const saveAll = useCallback((list: Cookbook[]) => {
    const cur = loadAppStorage()
    saveAppStorage({ ...cur, cookbooks: list })
    setCookbooks(list)
  }, [])

  const value = useMemo(
    () => ({ cookbooks, refresh, saveAll }),
    [cookbooks, refresh, saveAll]
  )

  return <CookbookContext.Provider value={value}>{children}</CookbookContext.Provider>
}

export function useCookbooks(): CookbookContextValue {
  const ctx = useContext(CookbookContext)
  if (!ctx) throw new Error('useCookbooks must be used within CookbookProvider')
  return ctx
}
