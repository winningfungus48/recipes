import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const RECIPE_DATA_FOLDER = './recipe data';
const OUTPUT_FILE = './consolidated-recipes-v2.csv';

// Phase 2 schema with all required fields
const PHASE2_HEADERS = [
  'title',
  'ingredients', 
  'instructions',
  'cookTime',
  'prepTime',
  'category',
  'tags',
  'notes',
  'rating',
  'difficulty',
  'source',
  'lastCooked',
  'isFavorite'
];

// Category mapping to standardize categories
const CATEGORY_MAPPING = {
  'Meals - Breakfast': 'Breakfast',
  'Meals - Lunch/Dinner': 'Lunch/Dinner', 
  'Appetizers & Sides': 'Appetizers',
  'Drinks': 'Drinks',
  'Desserts': 'Desserts'
};

function parseCSVContent(content) {
  const lines = content.split('\n');
  const recipes = [];
  
  if (lines.length < 2) return recipes;
  
  // Get headers
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  let currentRecipe = {};
  let currentField = '';
  let inQuotes = false;
  let lineIndex = 1;
  
  while (lineIndex < lines.length) {
    const line = lines[lineIndex].trim();
    
    // Skip empty lines
    if (!line) {
      lineIndex++;
      continue;
    }
    
    // Check if this looks like a new recipe (starts with a title-like pattern)
    const isNewRecipe = line.match(/^[^,]+,\s*(Meals|Appetizers|Drinks|Desserts|Archived)/);
    
    if (isNewRecipe && Object.keys(currentRecipe).length > 0) {
      // Save the previous recipe
      recipes.push({ ...currentRecipe });
      currentRecipe = {};
    }
    
    // Parse the line
    const fields = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    fields.push(current.trim());
    
    // Map fields to recipe object
    if (fields.length >= headers.length) {
      headers.forEach((header, index) => {
        if (fields[index]) {
          currentRecipe[header] = fields[index];
        }
      });
    }
    
    lineIndex++;
  }
  
  // Add the last recipe
  if (Object.keys(currentRecipe).length > 0) {
    recipes.push(currentRecipe);
  }
  
  return recipes;
}

function processRecipe(recipe, sourceFile) {
  // Clean and map to Phase 2 schema
  const processed = {
    title: (recipe.title || '').trim(),
    ingredients: (recipe.ingredients || '').trim(),
    instructions: (recipe.instructions || '').trim(),
    cookTime: (recipe.cooktime || '').trim(),
    prepTime: '', // Not in original data
    category: CATEGORY_MAPPING[recipe.category] || 'Lunch/Dinner',
    tags: (recipe.tags || '').trim(),
    notes: (recipe.notes || '').trim(),
    rating: parseFloat(recipe.rating) || 0,
    difficulty: '', // Not in original data - will need manual input
    source: sourceFile,
    lastCooked: '', // Not in original data
    isFavorite: 'false' // Default to false
  };
  
  return processed;
}

function consolidateRecipes() {
  console.log('🍳 Starting recipe consolidation (v2)...');
  
  const allRecipes = [];
  const files = fs.readdirSync(RECIPE_DATA_FOLDER);
  
  files.forEach(file => {
    if (file.endsWith('.csv')) {
      console.log(`📄 Processing ${file}...`);
      
      const filePath = path.join(__dirname, RECIPE_DATA_FOLDER, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const recipes = parseCSVContent(content);
      
      if (recipes.length === 0) {
        console.log(`⚠️  No recipes found in ${file}`);
        return;
      }
      
      // Process each recipe
      recipes.forEach(recipe => {
        const processedRecipe = processRecipe(recipe, file);
        
        // Only add if it has a title
        if (processedRecipe.title) {
          allRecipes.push(processedRecipe);
        }
      });
      
      console.log(`✅ Processed ${recipes.length} recipes from ${file}`);
    }
  });
  
  // Create consolidated CSV
  const csvContent = [
    PHASE2_HEADERS.join(','),
    ...allRecipes.map(recipe => 
      PHASE2_HEADERS.map(header => {
        const value = recipe[header] || '';
        // Escape quotes and wrap in quotes if contains comma or newline
        if (value.includes(',') || value.includes('\n') || value.includes('"')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');
  
  fs.writeFileSync(path.join(__dirname, OUTPUT_FILE), csvContent);
  
  console.log(`\n🎉 Consolidation complete!`);
  console.log(`📊 Total recipes: ${allRecipes.length}`);
  console.log(`📁 Output file: ${OUTPUT_FILE}`);
  
  // Show category breakdown
  const categoryCount = {};
  allRecipes.forEach(recipe => {
    categoryCount[recipe.category] = (categoryCount[recipe.category] || 0) + 1;
  });
  
  console.log(`\n📊 Category breakdown:`);
  Object.entries(categoryCount).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} recipes`);
  });
  
  console.log(`\n📋 Next steps:`);
  console.log(`1. Review ${OUTPUT_FILE} for any data issues`);
  console.log(`2. Use the bulk import feature at /import/bulk`);
  console.log(`3. Import the consolidated file`);
}

// Run consolidation
consolidateRecipes();
