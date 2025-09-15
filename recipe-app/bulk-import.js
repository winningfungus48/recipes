import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const RECIPE_DATA_FOLDER = './recipe data';
const STORAGE_KEY = 'myRecipesData';
const ERROR_REPORT_FILE = './import-errors.json';

// Import statistics
let totalRecipes = 0;
let successfulImports = 0;
let skippedDuplicates = 0;
let errors = 0;
const allErrors = [];
const duplicateTitles = new Set();

// Category mapping from CSV values to our schema
const CATEGORY_MAPPING = {
  'Meals - Breakfast': 'Breakfast',
  'Meals - Lunch/Dinner': 'Lunch/Dinner',
  'Appetizers & Sides': 'Appetizers',
  'Appetizers': 'Appetizers',
  'Drinks': 'Drinks',
  'Desserts': 'Desserts',
  'Archived': 'Other',
  'Other': 'Other'
};

/**
 * Parse a CSV line, handling quoted fields and commas
 */
function parseCSVLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  fields.push(current.trim());
  return fields;
}

/**
 * Create a mapping from header names to column indices
 */
function createHeaderMap(headers) {
  const map = {};
  
  headers.forEach((header, index) => {
    const normalized = header.toLowerCase().trim();
    map[normalized] = index;
    
    // Handle common variations
    if (normalized.includes('cook') && normalized.includes('time')) {
      map['cooktime'] = index;
    }
    if (normalized.includes('prep') && normalized.includes('time')) {
      map['preptime'] = index;
    }
  });
  
  return map;
}

/**
 * Map CSV category string to our Category type
 */
function mapCategory(categoryString) {
  const normalized = categoryString.trim();
  
  // Direct mapping
  if (normalized in CATEGORY_MAPPING) {
    return CATEGORY_MAPPING[normalized];
  }
  
  // Fuzzy matching for common variations
  const lower = normalized.toLowerCase();
  
  if (lower.includes('breakfast') || lower.includes('morning')) {
    return 'Breakfast';
  }
  if (lower.includes('lunch') || lower.includes('dinner') || lower.includes('main')) {
    return 'Lunch/Dinner';
  }
  if (lower.includes('dessert') || lower.includes('sweet')) {
    return 'Desserts';
  }
  if (lower.includes('appetizer') || lower.includes('side') || lower.includes('snack')) {
    return 'Appetizers';
  }
  if (lower.includes('drink') || lower.includes('beverage') || lower.includes('cocktail')) {
    return 'Drinks';
  }
  
  // Default to Other for unmatched categories
  return 'Other';
}

/**
 * Parse a single recipe row into a recipe object
 */
function parseRecipeRow(values, headerMap, rowNumber) {
  // Get field values with fallbacks
  const getField = (fieldName, required = false) => {
    const index = headerMap[fieldName.toLowerCase()];
    const value = index !== undefined ? values[index] : '';
    
    if (required && !value.trim()) {
      throw new Error(`Required field '${fieldName}' is missing`);
    }
    
    return value.trim();
  }

  try {
    // Validate required fields
    const title = getField('title', true);
    const ingredients = getField('ingredients', true);
    const instructions = getField('instructions', true);
    
    if (!title || !ingredients || !instructions) {
      throw new Error('Missing required fields: title, ingredients, or instructions');
    }

    // Parse ingredients array
    const ingredientsArray = ingredients
      .split(/[;,\n]/)
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0);

    // Parse tags array
    const tagsString = getField('tags');
    const tagsArray = tagsString
      .split(/[;,\n]/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // Map category
    const categoryString = getField('category');
    const category = mapCategory(categoryString);

    // Parse rating
    const ratingString = getField('rating');
    const rating = parseFloat(ratingString) || 0;

    // Parse cook time
    const cookTime = getField('cooktime') || getField('cook time') || '';

    return {
      title,
      ingredients: ingredientsArray,
      instructions,
      cookTime,
      prepTime: getField('preptime') || getField('prep time') || undefined,
      category,
      tags: tagsArray,
      notes: getField('notes'),
      rating: Math.max(0, Math.min(5, rating)), // Clamp between 0-5
      difficulty: getField('difficulty') || undefined,
      source: getField('source') || undefined,
      isFavorite: getField('favorite') === 'true' || getField('isfavorite') === 'true',
      image: getField('image') || undefined
    };
    
  } catch (error) {
    console.error(`Error parsing row ${rowNumber}:`, error);
    return null;
  }
}

/**
 * Parse a CSV file content into structured recipe data
 */
function parseCSVContent(content, filename) {
  const lines = content.split('\n').filter(line => line.trim());
  const recipes = [];
  const errors = [];
  const duplicates = new Set();
  
  if (lines.length < 2) {
    errors.push({
      row: 0,
      title: 'File',
      error: 'No data found in file',
      data: { filename }
    });
    return { recipes, errors, duplicates: [] };
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]);
  const headerMap = createHeaderMap(headers);
  
  // Process each recipe row
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i]);
      
      if (values.length !== headers.length) {
        errors.push({
          row: i + 1,
          title: values[0] || 'Unknown',
          error: `Column count mismatch. Expected ${headers.length}, got ${values.length}`,
          data: { values, headers }
        });
        continue;
      }

      const recipe = parseRecipeRow(values, headerMap, i + 1);
      
      if (!recipe) {
        continue; // Error already logged in parseRecipeRow
      }

      // Check for duplicates within this file
      const titleKey = recipe.title.toLowerCase().trim();
      if (duplicates.has(titleKey)) {
        errors.push({
          row: i + 1,
          title: recipe.title,
          error: 'Duplicate title found in file',
          data: { filename }
        });
        continue;
      }
      
      duplicates.add(titleKey);
      recipes.push(recipe);
      
    } catch (error) {
      errors.push({
        row: i + 1,
        title: 'Parse Error',
        error: error instanceof Error ? error.message : 'Unknown parsing error',
        data: { line: lines[i] }
      });
    }
  }

  return {
    recipes,
    errors,
    duplicates: Array.from(duplicates)
  };
}

/**
 * Load existing recipes from localStorage
 */
function loadExistingRecipes() {
  try {
    const existingData = fs.readFileSync(path.join(__dirname, 'localStorage.json'), 'utf8');
    return JSON.parse(existingData);
  } catch (error) {
    console.log('📝 No existing recipes found, starting fresh');
    return [];
  }
}

/**
 * Save recipes to localStorage format
 */
function saveRecipes(recipes) {
  const data = {
    recipes: recipes,
    lastUpdated: new Date().toISOString()
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'localStorage.json'), 
    JSON.stringify(data, null, 2)
  );
}

/**
 * Generate unique ID for recipe
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Create recipe with proper schema
 */
function createRecipe(parsedRecipe) {
  const now = new Date().toISOString();
  
  return {
    id: generateId(),
    title: parsedRecipe.title,
    ingredients: parsedRecipe.ingredients,
    instructions: parsedRecipe.instructions,
    cookTime: parsedRecipe.cookTime,
    prepTime: parsedRecipe.prepTime,
    category: parsedRecipe.category,
    tags: parsedRecipe.tags,
    notes: parsedRecipe.notes,
    rating: parsedRecipe.rating,
    difficulty: parsedRecipe.difficulty,
    source: parsedRecipe.source,
    lastCooked: undefined,
    isFavorite: parsedRecipe.isFavorite || false,
    image: parsedRecipe.image,
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Check for duplicate recipes
 */
function isDuplicate(newRecipe, existingRecipes) {
  const titleKey = newRecipe.title.toLowerCase().trim();
  return existingRecipes.some(recipe => 
    recipe.title.toLowerCase().trim() === titleKey
  );
}

/**
 * Process a single CSV file
 */
function processCSVFile(filePath, existingRecipes) {
  const filename = path.basename(filePath);
  console.log(`\n📄 Processing ${filename}...`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = parseCSVContent(content, filename);
    
    console.log(`   📊 Found ${result.recipes.length} recipes`);
    console.log(`   ⚠️  ${result.errors.length} errors`);
    
    // Add errors to global error list
    result.errors.forEach(error => {
      allErrors.push({
        file: filename,
        ...error
      });
    });
    
    // Process each recipe
    const newRecipes = [];
    
    result.recipes.forEach(parsedRecipe => {
      totalRecipes++;
      
      try {
        const recipe = createRecipe(parsedRecipe);
        
        // Check for duplicates
        if (isDuplicate(recipe, existingRecipes)) {
          console.log(`   ⏭️  Skipping duplicate: "${recipe.title}"`);
          skippedDuplicates++;
          duplicateTitles.add(recipe.title);
          return;
        }
        
        newRecipes.push(recipe);
        successfulImports++;
        
      } catch (error) {
        console.log(`   ❌ Error creating recipe "${parsedRecipe.title}": ${error.message}`);
        errors++;
        allErrors.push({
          file: filename,
          row: 'Unknown',
          title: parsedRecipe.title,
          error: error.message,
          data: { parsedRecipe }
        });
      }
    });
    
    return newRecipes;
    
  } catch (error) {
    console.log(`   ❌ Error reading file: ${error.message}`);
    errors++;
    allErrors.push({
      file: filename,
      row: 0,
      title: 'File Error',
      error: error.message,
      data: { filePath }
    });
    return [];
  }
}

/**
 * Generate error report
 */
function generateErrorReport() {
  if (allErrors.length === 0) {
    console.log('\n✅ No errors to report!');
    return;
  }
  
  const errorReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalErrors: allErrors.length,
      filesWithErrors: [...new Set(allErrors.map(e => e.file))].length,
      duplicateTitles: duplicateTitles.size
    },
    errors: allErrors
  };
  
  fs.writeFileSync(
    path.join(__dirname, ERROR_REPORT_FILE),
    JSON.stringify(errorReport, null, 2)
  );
  
  console.log(`\n📋 Error report saved to: ${ERROR_REPORT_FILE}`);
}

/**
 * Main import function
 */
async function bulkImport() {
  console.log('🍳 Starting Bulk Recipe Import...\n');
  
  // Load existing recipes
  const existingRecipes = loadExistingRecipes();
  console.log(`📚 Found ${existingRecipes.length} existing recipes`);
  
  // Get all CSV files
  const files = fs.readdirSync(path.join(__dirname, RECIPE_DATA_FOLDER))
    .filter(file => file.endsWith('.csv'))
    .map(file => path.join(__dirname, RECIPE_DATA_FOLDER, file));
  
  if (files.length === 0) {
    console.log('❌ No CSV files found in recipe data folder');
    return;
  }
  
  console.log(`📁 Found ${files.length} CSV files to process\n`);
  
  // Process each file
  const allNewRecipes = [];
  
  for (const filePath of files) {
    const newRecipes = processCSVFile(filePath, existingRecipes);
    allNewRecipes.push(...newRecipes);
  }
  
  // Combine with existing recipes
  const allRecipes = [...existingRecipes, ...allNewRecipes];
  
  // Save to storage
  saveRecipes(allRecipes);
  
  // Generate error report
  generateErrorReport();
  
  // Print summary
  console.log('\n🎉 Bulk Import Complete!');
  console.log('═══════════════════════════════════════');
  console.log(`📊 Total recipes processed: ${totalRecipes}`);
  console.log(`✅ Successfully imported: ${successfulImports}`);
  console.log(`⏭️  Skipped duplicates: ${skippedDuplicates}`);
  console.log(`❌ Errors encountered: ${errors}`);
  console.log(`📚 Total recipes in storage: ${allRecipes.length}`);
  
  if (duplicateTitles.size > 0) {
    console.log('\n📋 Duplicate titles found:');
    Array.from(duplicateTitles).slice(0, 10).forEach(title => {
      console.log(`   • ${title}`);
    });
    if (duplicateTitles.size > 10) {
      console.log(`   ... and ${duplicateTitles.size - 10} more`);
    }
  }
  
  console.log('\n🚀 Your recipes are now ready to use in the app!');
  console.log('   Start the dev server with: npm run dev');
  console.log('   Then visit: http://localhost:3000/recipes');
}

// Run the import
bulkImport().catch(console.error);