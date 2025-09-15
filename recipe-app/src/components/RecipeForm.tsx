import React, { useState, useEffect } from 'react'
import { RecipeFormData, Category, RecipeSection } from '../types/recipe'
import { getSectionLabelValidationError, validateSectionLabels } from '../utils/storage'
import { CATEGORIES, DIFFICULTIES } from '../data/categories'
import { POPULAR_TAGS } from '../data/tags'
import StarRating from './StarRating'

interface RecipeFormProps {
  initialData?: Partial<RecipeFormData>
  onSubmit: (data: RecipeFormData) => void
  onCancel?: () => void
  submitText?: string
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  submitText = 'Save Recipe'
}) => {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    ingredients: [''], // DEPRECATED: Will be removed in future
    instructions: '', // DEPRECATED: Will be removed in future
    sections: [{ label: 'Main', ingredients: [''], instructions: [''] }],
    cookTime: '',
    prepTime: '',
    category: 'Lunch/Dinner',
    tags: [],
    notes: '',
    rating: 0,
    difficulty: undefined,
    source: '',
    lastCooked: '',
    isFavorite: false,
    image: undefined,
    ...initialData
  })

  const [newTag, setNewTag] = useState('')
  const [imagePreview, setImagePreview] = useState<string | undefined>(formData.image)
  const [sectionValidationErrors, setSectionValidationErrors] = useState<{[key: number]: string}>({})

  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image)
    }
  }, [formData.image])

  const handleInputChange = (field: keyof RecipeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }


  // Section management functions
  const addSection = () => {
    const newSection: RecipeSection = {
      label: '',
      ingredients: [''],
      instructions: ['']
    }
    setFormData(prev => ({ 
      ...prev, 
      sections: [...(prev.sections || []), newSection] 
    }))
  }

  const removeSection = (index: number) => {
    if (formData.sections && formData.sections.length > 1) {
      const newSections = formData.sections.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, sections: newSections }))
    }
  }

  const updateSection = (index: number, field: keyof RecipeSection, value: any) => {
    const newSections = [...(formData.sections || [])]
    newSections[index] = { ...newSections[index], [field]: value }
    setFormData(prev => ({ ...prev, sections: newSections }))
    
    // Validate section labels if the label field is being updated
    if (field === 'label') {
      const validationError = getSectionLabelValidationError(newSections, index, value)
      setSectionValidationErrors(prev => ({
        ...prev,
        [index]: validationError || ''
      }))
    }
  }

  const updateSectionIngredient = (sectionIndex: number, ingredientIndex: number, value: string) => {
    const newSections = [...(formData.sections || [])]
    newSections[sectionIndex].ingredients[ingredientIndex] = value
    setFormData(prev => ({ ...prev, sections: newSections }))
  }

  const addSectionIngredient = (sectionIndex: number) => {
    const newSections = [...(formData.sections || [])]
    newSections[sectionIndex].ingredients.push('')
    setFormData(prev => ({ ...prev, sections: newSections }))
  }

  const removeSectionIngredient = (sectionIndex: number, ingredientIndex: number) => {
    const newSections = [...(formData.sections || [])]
    if (newSections[sectionIndex].ingredients.length > 1) {
      newSections[sectionIndex].ingredients.splice(ingredientIndex, 1)
      setFormData(prev => ({ ...prev, sections: newSections }))
    }
  }

  const updateSectionInstruction = (sectionIndex: number, instructionIndex: number, value: string) => {
    const newSections = [...(formData.sections || [])]
    newSections[sectionIndex].instructions[instructionIndex] = value
    setFormData(prev => ({ ...prev, sections: newSections }))
  }

  const addSectionInstruction = (sectionIndex: number) => {
    const newSections = [...(formData.sections || [])]
    newSections[sectionIndex].instructions.push('')
    setFormData(prev => ({ ...prev, sections: newSections }))
  }

  const removeSectionInstruction = (sectionIndex: number, instructionIndex: number) => {
    const newSections = [...(formData.sections || [])]
    if (newSections[sectionIndex].instructions.length > 1) {
      newSections[sectionIndex].instructions.splice(instructionIndex, 1)
      setFormData(prev => ({ ...prev, sections: newSections }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setFormData(prev => ({ ...prev, image: result }))
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter out empty ingredients and instructions from sections
    const filteredSections = (formData.sections || []).map(section => ({
      ...section,
      ingredients: section.ingredients.filter(ingredient => ingredient.trim() !== ''),
      instructions: section.instructions.filter(instruction => instruction.trim() !== '')
    }))
    
    // Filter out empty ingredients (legacy)
    const filteredIngredients = formData.ingredients.filter(ingredient => ingredient.trim() !== '')
    
    onSubmit({
      ...formData,
      ingredients: filteredIngredients,
      sections: filteredSections
    })
  }

  // Check for section validation errors
  const hasSectionValidationErrors = Object.values(sectionValidationErrors).some(error => error)
  
  // Validate all sections for duplicates
  const sectionValidation = validateSectionLabels(formData.sections || [])
  
  const isFormValid = formData.title.trim() !== '' && !hasSectionValidationErrors && sectionValidation.isValid

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Recipe Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="input-field"
          placeholder="Enter recipe title"
          required
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recipe Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="input-field"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Recipe preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value as Category)}
          className="input-field"
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Cook Time */}
      <div>
        <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-2">
          Cook Time
        </label>
        <input
          type="text"
          id="cookTime"
          value={formData.cookTime}
          onChange={(e) => handleInputChange('cookTime', e.target.value)}
          className="input-field"
          placeholder="e.g., 30 min, 1 hour"
        />
      </div>

      {/* Prep Time */}
      <div>
        <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-2">
          Prep Time
        </label>
        <input
          type="text"
          id="prepTime"
          value={formData.prepTime || ''}
          onChange={(e) => handleInputChange('prepTime', e.target.value)}
          className="input-field"
          placeholder="e.g., 15 min, 30 min"
        />
      </div>

      {/* Difficulty */}
      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
          Difficulty
        </label>
        <select
          id="difficulty"
          value={formData.difficulty || ''}
          onChange={(e) => handleInputChange('difficulty', e.target.value || undefined)}
          className="input-field"
        >
          <option value="">Select difficulty</option>
          {DIFFICULTIES.map(difficulty => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
      </div>

      {/* Source */}
      <div>
        <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
          Source
        </label>
        <input
          type="url"
          id="source"
          value={formData.source || ''}
          onChange={(e) => handleInputChange('source', e.target.value)}
          className="input-field"
          placeholder="https://example.com/recipe"
        />
      </div>

      {/* Last Cooked */}
      <div>
        <label htmlFor="lastCooked" className="block text-sm font-medium text-gray-700 mb-2">
          Last Cooked
        </label>
        <input
          type="date"
          id="lastCooked"
          value={formData.lastCooked || ''}
          onChange={(e) => handleInputChange('lastCooked', e.target.value)}
          className="input-field"
        />
      </div>

      {/* Favorite Toggle */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isFavorite || false}
            onChange={(e) => handleInputChange('isFavorite', e.target.checked)}
            className="h-4 w-4 text-sage-600 focus:ring-sage-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">
            Mark as Favorite
          </span>
        </label>
      </div>

      {/* Recipe Sections */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Recipe Sections
          </label>
          <button
            type="button"
            onClick={addSection}
            className="btn-outline text-sm"
          >
            + Add Section
          </button>
        </div>
        
        <div className="space-y-6">
          {(formData.sections || []).map((section, sectionIndex) => (
            <div key={sectionIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1 mr-4">
                  <input
                    type="text"
                    value={section.label}
                    onChange={(e) => updateSection(sectionIndex, 'label', e.target.value)}
                    className={`input-field ${sectionValidationErrors[sectionIndex] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Section name (e.g., Crust, Filling, Topping)"
                  />
                  {sectionValidationErrors[sectionIndex] && (
                    <p className="text-red-600 text-sm mt-1">
                      {sectionValidationErrors[sectionIndex]}
                    </p>
                  )}
                </div>
                {(formData.sections || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(sectionIndex)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    Remove Section
                  </button>
                )}
              </div>

              {/* Section Ingredients */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Ingredients
                </label>
                <div className="space-y-2">
                  {section.ingredients.map((ingredient, ingredientIndex) => (
                    <div key={ingredientIndex} className="flex space-x-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => updateSectionIngredient(sectionIndex, ingredientIndex, e.target.value)}
                        className="input-field flex-1"
                        placeholder="Enter ingredient"
                      />
                      {section.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSectionIngredient(sectionIndex, ingredientIndex)}
                          className="px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addSectionIngredient(sectionIndex)}
                    className="btn-outline text-sm"
                  >
                    + Add Ingredient
                  </button>
                </div>
              </div>

              {/* Section Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Instructions
                </label>
                <div className="space-y-2">
                  {section.instructions.map((instruction, instructionIndex) => (
                    <div key={instructionIndex} className="flex space-x-2">
                      <span className="flex-shrink-0 w-6 h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                        {instructionIndex + 1}.
                      </span>
                      <input
                        type="text"
                        value={instruction}
                        onChange={(e) => updateSectionInstruction(sectionIndex, instructionIndex, e.target.value)}
                        className="input-field flex-1"
                        placeholder="Enter instruction step"
                      />
                      {section.instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSectionInstruction(sectionIndex, instructionIndex)}
                          className="px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addSectionInstruction(sectionIndex)}
                    className="btn-outline text-sm"
                  >
                    + Add Step
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Section Validation Summary */}
        {!sectionValidation.isValid && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-800 font-medium mb-2">Section Label Issues:</h4>
            <ul className="text-red-700 text-sm space-y-1">
              {sectionValidation.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>


      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        
        {/* Popular Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {POPULAR_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              disabled={formData.tags.includes(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                formData.tags.includes(tag)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Custom Tag Input */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addTag(newTag)
                setNewTag('')
              }
            }}
            className="input-field flex-1"
            placeholder="Add custom tag"
          />
          <button
            type="button"
            onClick={() => {
              addTag(newTag)
              setNewTag('')
            }}
            className="btn-outline"
          >
            Add
          </button>
        </div>

        {/* Selected Tags */}
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sage-100 text-sage-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-sage-600 hover:text-sage-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <StarRating
          rating={formData.rating}
          onRatingChange={(rating) => handleInputChange('rating', rating)}
          interactive
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={3}
          className="input-field"
          placeholder="Any additional notes or tips"
        />
      </div>

      {/* Form Actions */}
      <div className="flex space-x-4 pt-6">
        <button
          type="submit"
          disabled={!isFormValid}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitText}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default RecipeForm
