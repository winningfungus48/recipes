const STORAGE_KEY = 'myRecipesData'

/**
 * Restore `myRecipesData` from a JSON file (user-selected). Intended as emergency undo.
 * Call from a file input onChange in dev/tools if needed, or paste JSON in console.
 */
export function restoreFromJsonString(json: string): { ok: boolean; error?: string } {
  try {
    const parsed = JSON.parse(json)
    if (typeof parsed !== 'object' && !Array.isArray(parsed)) {
      return { ok: false, error: 'Invalid JSON root' }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Parse error' }
  }
}

/** Browser console: download backup of current myRecipesData */
export function downloadBackupFromLocalStorage(): void {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    console.log('No data found in localStorage.')
    return
  }
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `recipe-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  console.log('Backup downloaded.')
}
