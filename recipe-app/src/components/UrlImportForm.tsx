import React, { useState } from 'react'
import { scrapeRecipe, convertScrapedToFormData } from '../utils/scraper'
import { RecipeFormData } from '../types/recipe'
import { Upload, AlertCircle, CheckCircle } from 'lucide-react'

interface UrlImportFormProps {
  onSubmit: (formData: RecipeFormData) => void
  onCancel: () => void
  submitText?: string
}

const UrlImportForm: React.FC<UrlImportFormProps> = ({
  onSubmit,
  onCancel,
  submitText = "Save Imported Recipe"
}) => {
  const [url, setUrl] = useState('')
  const [isScraping, setIsScraping] = useState(false)
  const [scrapedData, setScrapedData] = useState<Partial<RecipeFormData> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScrape = async () => {
    if (!url.trim()) {
      setError('Please enter a recipe URL')
      return
    }

    setIsScraping(true)
    setError(null)
    setScrapedData(null)

    try {
      const scraped = await scrapeRecipe(url)
      const formData = convertScrapedToFormData(scraped)
      setScrapedData(formData)
    } catch (err) {
      setError('Failed to scrape recipe. Please try a different URL or add the recipe manually.')
    } finally {
      setIsScraping(false)
    }
  }

  const handleStartOver = () => {
    setUrl('')
    setScrapedData(null)
    setError(null)
  }

  if (!scrapedData) {
    return (
      <div className="space-y-6">
        {/* URL Input */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Recipe URL
          </label>
          <div className="flex space-x-4">
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/recipe"
              className="input-field flex-1"
            />
            <button
              onClick={handleScrape}
              disabled={isScraping || !url.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isScraping ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Scraping...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Import</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Import Failed</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            How it works
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Paste any recipe URL from popular cooking websites</li>
            <li>• We'll extract the title, ingredients, and instructions</li>
            <li>• Review and edit the details before saving</li>
            <li>• Add your own tags, notes, and rating</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-green-800">Recipe Imported Successfully!</h3>
            <p className="text-sm text-green-700 mt-1">
              Review and edit the details below, then save to your collection.
            </p>
          </div>
        </div>
      </div>

      {/* Recipe Form */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Edit Recipe Details
        </h2>
        <button
          onClick={handleStartOver}
          className="btn-outline text-sm"
        >
          Start Over
        </button>
      </div>
      
      <RecipeForm
        initialData={scrapedData}
        onSubmit={onSubmit}
        onCancel={onCancel}
        submitText={submitText}
      />
    </div>
  )
}

export default UrlImportForm
