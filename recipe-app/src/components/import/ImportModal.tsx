import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { importFromUrl } from '../../services/importService'
import type { Recipe } from '../../types'
import ImportPreview from './ImportPreview'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function ImportModal({ isOpen, onClose }: Props) {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [partial, setPartial] = useState<Partial<Recipe> | null>(null)

  const reset = () => {
    setUrl('')
    setError(null)
    setPartial(null)
    setLoading(false)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const runImport = async () => {
    setError(null)
    setPartial(null)
    if (!url.trim()) {
      setError('Paste a URL first.')
      return
    }
    setLoading(true)
    try {
      const data = await importFromUrl(url.trim())
      setPartial(data)
    } catch (e) {
      const msg =
        e instanceof Error && e.message.includes('fetch')
          ? "Couldn't reach that URL"
          : e instanceof Error
            ? e.message
            : 'Import failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (partial) {
    return (
      <ImportPreview
        isOpen={isOpen}
        initial={partial}
        sourceUrl={url.trim()}
        onClose={handleClose}
        onBack={() => setPartial(null)}
      />
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import from URL" size="md">
      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium text-[#8B6F47]" htmlFor="import-url">
          Recipe URL
        </label>
        <input
          id="import-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://…"
          className="min-h-[48px] w-full rounded-xl border border-gray-200 px-4 text-base outline-none ring-[#7C9A6E] focus:ring-2"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={loading} onClick={runImport} className="min-w-[120px]">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Importing…
              </span>
            ) : (
              'Import'
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              handleClose()
              navigate('/recipes/add')
            }}
          >
            Manual entry
          </Button>
        </div>
      </div>
    </Modal>
  )
}
