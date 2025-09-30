import React, { useState } from 'react'
import { parseCSV, parseJSON, createImportPreview, convertToRecipes } from '../utils/bulkImport'
import { BulkImportRecipe, ImportPreview } from '../types/recipe'
import { Upload, FileText, AlertCircle, CheckCircle, X, Download } from 'lucide-react'

interface BulkImportFormProps {
  onSubmit: (recipes: any[]) => void
  onCancel: () => void
  submitText?: string
}

const BulkImportForm: React.FC<BulkImportFormProps> = ({
  onSubmit,
  onCancel,
  submitText = "Import Selected Recipes"
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [importType, setImportType] = useState<'csv' | 'json'>('csv')
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const [selectedRecipes, setSelectedRecipes] = useState<Set<number>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(null)
      setError(null)
      setSelectedRecipes(new Set())
    }
  }

  const handleProcessFile = async () => {
    if (!file) return

    setIsProcessing(true)
    setError(null)

    try {
      const content = await file.text()
      let recipes: BulkImportRecipe[] = []

      if (importType === 'csv') {
        recipes = parseCSV(content)
      } else {
        recipes = parseJSON(content)
      }

      if (recipes.length === 0) {
        setError('No valid recipes found in the file')
        return
      }

      const existingRecipes = JSON.parse(localStorage.getItem('myRecipesData') || '[]')
      const preview = createImportPreview(recipes, existingRecipes)
      setPreview(preview)
      
      // Select all non-duplicate recipes by default
      const nonDuplicateIndices = recipes
        .map((_, index) => index)
        .filter(index => !preview.duplicates.includes(recipes[index].title))
      setSelectedRecipes(new Set(nonDuplicateIndices))
    } catch (err) {
      setError('Error processing file. Please check the format and try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSelectRecipe = (index: number) => {
    const newSelected = new Set(selectedRecipes)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedRecipes(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedRecipes.size === preview!.recipes.length) {
      setSelectedRecipes(new Set())
    } else {
      setSelectedRecipes(new Set(preview!.recipes.map((_, index) => index)))
    }
  }

  const handleImportSelected = () => {
    if (!preview) return

    const selectedRecipesData = Array.from(selectedRecipes)
      .map(index => preview.recipes[index])
      .filter(recipe => recipe)

    const recipesToImport = convertToRecipes(selectedRecipesData)
    onSubmit(recipesToImport)
  }

  const downloadTemplate = () => {
    const template = importType === 'csv' 
      ? 'title,ingredients,instructions,cookTime,prepTime,category,tags,notes,rating,difficulty,source,favorite\n"Sample Recipe","ingredient1;ingredient2","Step 1;Step 2","30 min","10 min","Lunch/Dinner","easy;quick","Sample notes",4,"Easy","https://example.com",false'
      : JSON.stringify([{
          title: "Sample Recipe",
          ingredients: ["ingredient1", "ingredient2"],
          instructions: "Step 1\nStep 2",
          cookTime: "30 min",
          prepTime: "10 min",
          category: "Lunch/Dinner",
          tags: ["easy", "quick"],
          notes: "Sample notes",
          rating: 4,
          difficulty: "Easy",
          source: "https://example.com",
          favorite: false
        }], null, 2)

    const blob = new Blob([template], { type: importType === 'csv' ? 'text/csv' : 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `recipe-template.${importType}`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!preview) {
    return (
      <div className="space-y-6">
        {/* Import Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            File Format
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="csv"
                checked={importType === 'csv'}
                onChange={(e) => setImportType(e.target.value as 'csv' | 'json')}
                className="mr-2"
              />
              <FileText className="h-4 w-4 mr-1" />
              CSV
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="json"
                checked={importType === 'json'}
                onChange={(e) => setImportType(e.target.value as 'csv' | 'json')}
                className="mr-2"
              />
              <FileText className="h-4 w-4 mr-1" />
              JSON
            </label>
          </div>
        </div>

        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select File
          </label>
          <input
            type="file"
            accept={importType === 'csv' ? '.csv' : '.json'}
            onChange={handleFileChange}
            className="input-field"
          />
        </div>

        {/* Template Download */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Download className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Need a template?
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Download a sample {importType.toUpperCase()} file to see the expected format.
              </p>
              <button
                onClick={downloadTemplate}
                className="btn-outline text-sm mt-2"
              >
                Download Template
              </button>
            </div>
          </div>
        </div>

        {/* Process Button */}
        <div className="flex justify-end">
          <button
            onClick={handleProcessFile}
            disabled={!file || isProcessing}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Process File</span>
              </>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Import Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Import Summary */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Import Preview
        </h2>
        <button
          onClick={() => {
            setPreview(null)
            setFile(null)
            setError(null)
          }}
          className="btn-outline text-sm"
        >
          Start Over
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              {preview.recipes.length} Recipes Found
            </span>
          </div>
        </div>
        
        {preview.duplicates.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">
                {preview.duplicates.length} Duplicates
              </span>
            </div>
          </div>
        )}
        
        {preview.errors.length > 0 && (
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-800">
                {preview.errors.length} Errors
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Selection Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSelectAll}
            className="btn-outline text-sm"
          >
            {selectedRecipes.size === preview.recipes.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-sm text-gray-600">
            {selectedRecipes.size} of {preview.recipes.length} selected
          </span>
        </div>
      </div>

      {/* Recipe List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {preview.recipes.map((recipe, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedRecipes.has(index)
                ? 'border-sage-300 bg-sage-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${
              preview.duplicates.includes(recipe.title)
                ? 'opacity-50'
                : ''
            }`}
            onClick={() => !preview.duplicates.includes(recipe.title) && handleSelectRecipe(index)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{recipe.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {recipe.ingredients.length} ingredients • {recipe.category}
                </p>
                {preview.duplicates.includes(recipe.title) && (
                  <p className="text-sm text-yellow-600 mt-1">
                    ⚠️ Duplicate - already exists
                  </p>
                )}
              </div>
              <div className="ml-4">
                <input
                  type="checkbox"
                  checked={selectedRecipes.has(index)}
                  onChange={() => handleSelectRecipe(index)}
                  disabled={preview.duplicates.includes(recipe.title)}
                  className="h-4 w-4 text-sage-600 focus:ring-sage-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Errors Display */}
      {preview.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 mb-2">Validation Errors:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {preview.errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="btn-outline"
        >
          Cancel
        </button>
        <button
          onClick={handleImportSelected}
          disabled={selectedRecipes.size === 0}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitText} ({selectedRecipes.size})
        </button>
      </div>
    </div>
  )
}

export default BulkImportForm
