import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const RECIPE_DATA_FOLDER = './recipe data';
const OUTPUT_FILE = './consolidated-recipes.csv';

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

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function processRecipe(recipe, sourceFile) {
  // Map to Phase 2 schema
  const processed = {
    title: recipe.title || '',
    ingredients: recipe.ingredients || '',
    instructions: recipe.instructions || '',
    cookTime: recipe.cookTime || '',
    prepTime: '', // Not in original data
    category: CATEGORY_MAPPING[recipe.category] || 'Lunch/Dinner',
    tags: recipe.tags || '',
    notes: recipe.notes || '',
    rating: recipe.rating || '0',
    difficulty: '', // Not in original data - will need manual input
    source: sourceFile,
    lastCooked: '', // Not in original data
    isFavorite: 'false' // Default to false
  };
  
  return processed;
}

function consolidateRecipes() {
  console.log('🍳 Starting recipe consolidation...');
  
  const allRecipes = [];
  const files = fs.readdirSync(RECIPE_DATA_FOLDER);
  
  files.forEach(file => {
    if (file.endsWith('.csv')) {
      console.log(`📄 Processing ${file}...`);
      
      const filePath = path.join(__dirname, RECIPE_DATA_FOLDER, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        console.log(`⚠️  Skipping ${file} - no data`);
        return;
      }
      
      // Parse header
      const headers = parseCSVLine(lines[0]);
      
      // Process each recipe
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        
        if (values.length !== headers.length) {
          console.log(`⚠️  Skipping malformed line in ${file}: ${lines[i]}`);
          continue;
        }
        
        // Create recipe object
        const recipe = {};
        headers.forEach((header, index) => {
          recipe[header] = values[index] || '';
        });
        
        // Process and add to consolidated list
        const processedRecipe = processRecipe(recipe, file);
        allRecipes.push(processedRecipe);
      }
      
      console.log(`✅ Processed ${lines.length - 1} recipes from ${file}`);
    }
  });
  
  // Create consolidated CSV
  const csvContent = [
    PHASE2_HEADERS.join(','),
    ...allRecipes.map(recipe => 
      PHASE2_HEADERS.map(header => {
        const value = recipe[header] || '';
        // Escape quotes and wrap in quotes if contains comma
        return value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    )
  ].join('\n');
  
  fs.writeFileSync(path.join(__dirname, OUTPUT_FILE), csvContent);
  
  console.log(`\n🎉 Consolidation complete!`);
  console.log(`📊 Total recipes: ${allRecipes.length}`);
  console.log(`📁 Output file: ${OUTPUT_FILE}`);
  console.log(`\n📋 Next steps:`);
  console.log(`1. Review ${OUTPUT_FILE} for any data issues`);
  console.log(`2. Add difficulty ratings manually if desired`);
  console.log(`3. Use the bulk import feature at /import/bulk`);
  console.log(`4. Import the consolidated file`);
}

// Run consolidation
consolidateRecipes();
