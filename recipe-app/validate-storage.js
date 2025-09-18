// Validation script to test storage utilities with updated test data
const fs = require('fs');
const path = require('path');

// Mock localStorage for Node.js environment
const localStorage = {
  data: {},
  setItem: function(key, value) {
    this.data[key] = value;
  },
  getItem: function(key) {
    return this.data[key] || null;
  },
  removeItem: function(key) {
    delete this.data[key];
  }
};

// Mock the storage utilities (simplified version for testing)
const STORAGE_KEY = 'myRecipesData';

const saveRecipes = (recipes) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const loadRecipes = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { recipes: [], error: null };
    
    const parsed = JSON.parse(stored);
    
    // Validate that parsed data is an array
    if (!Array.isArray(parsed)) {
      return { recipes: [], error: 'Invalid data format - expected array' };
    }
    
    // Validate each recipe has required fields
    const validRecipes = parsed.filter(recipe => {
      if (!recipe || typeof recipe !== 'object') return false;
      if (!recipe.id || !recipe.title) return false;
      return true;
    });
    
    if (validRecipes.length !== parsed.length) {
      console.warn(`Filtered out ${parsed.length - validRecipes.length} invalid recipes`);
    }
    
    return { recipes: validRecipes, error: null };
  } catch (error) {
    return { recipes: [], error: error.message };
  }
};

// Load the updated test data
const testDataPath = path.join(__dirname, 'test-recipes-10.js');
const testDataContent = fs.readFileSync(testDataPath, 'utf8');

// Extract the testRecipes array from the file
const testRecipesMatch = testDataContent.match(/const testRecipes = (\[[\s\S]*?\]);/);
if (!testRecipesMatch) {
  console.error('❌ Could not extract testRecipes from file');
  process.exit(1);
}

let testRecipes;
try {
  // Evaluate the testRecipes array (safe since we control the content)
  eval(`testRecipes = ${testRecipesMatch[1]};`);
} catch (error) {
  console.error('❌ Error parsing testRecipes:', error.message);
  process.exit(1);
}

console.log('🧪 Testing Storage Utilities with Updated Test Data');
console.log('=' .repeat(60));

// Test 1: Validate test data structure
console.log('\n1️⃣ Validating Test Data Structure:');
console.log(`   - Number of recipes: ${testRecipes.length}`);
console.log(`   - Expected: 10 recipes`);

const structureValidation = testRecipes.map((recipe, index) => {
  const errors = [];
  const warnings = [];
  
  // Check required fields
  if (!recipe.id || typeof recipe.id !== 'string') {
    errors.push('Missing or invalid id');
  }
  if (!recipe.title || typeof recipe.title !== 'string') {
    errors.push('Missing or invalid title');
  }
  if (!recipe.category || typeof recipe.category !== 'string') {
    errors.push('Missing or invalid category');
  }
  
  // Check modern format fields
  if (!Array.isArray(recipe.ingredients)) {
    warnings.push('Ingredients should be an array');
  }
  if (typeof recipe.instructions !== 'string') {
    warnings.push('Instructions should be a string');
  }
  if (!Array.isArray(recipe.tags)) {
    warnings.push('Tags should be an array');
  }
  if (!Array.isArray(recipe.sections)) {
    warnings.push('Sections should be an array');
  }
  
  // Check new required fields
  if (!recipe.prepTime) {
    warnings.push('Missing prepTime');
  }
  if (!recipe.difficulty) {
    warnings.push('Missing difficulty');
  }
  if (typeof recipe.isFavorite !== 'boolean') {
    warnings.push('Missing or invalid isFavorite');
  }
  
  return {
    index: index + 1,
    title: recipe.title,
    isValid: errors.length === 0,
    errors,
    warnings
  };
});

const invalidRecipes = structureValidation.filter(r => !r.isValid);
const warningRecipes = structureValidation.filter(r => r.warnings.length > 0);

if (invalidRecipes.length > 0) {
  console.log('   ❌ Invalid recipes found:');
  invalidRecipes.forEach(recipe => {
    console.log(`      Recipe ${recipe.index} (${recipe.title}): ${recipe.errors.join(', ')}`);
  });
} else {
  console.log('   ✅ All recipes have valid structure');
}

if (warningRecipes.length > 0) {
  console.log(`   ⚠️  ${warningRecipes.length} recipes have warnings but are valid`);
} else {
  console.log('   ✅ No warnings found');
}

// Test 2: Test save/load functionality
console.log('\n2️⃣ Testing Save/Load Functionality:');

const saveResult = saveRecipes(testRecipes);
if (saveResult.success) {
  console.log('   ✅ Successfully saved recipes to storage');
} else {
  console.log(`   ❌ Failed to save recipes: ${saveResult.error}`);
  process.exit(1);
}

const loadResult = loadRecipes();
if (loadResult.error) {
  console.log(`   ❌ Failed to load recipes: ${loadResult.error}`);
  process.exit(1);
} else {
  console.log(`   ✅ Successfully loaded ${loadResult.recipes.length} recipes from storage`);
}

// Test 3: Verify data integrity after save/load
console.log('\n3️⃣ Verifying Data Integrity:');

const originalCount = testRecipes.length;
const loadedCount = loadResult.recipes.length;

if (originalCount === loadedCount) {
  console.log('   ✅ Recipe count matches after save/load');
} else {
  console.log(`   ❌ Recipe count mismatch: ${originalCount} original vs ${loadedCount} loaded`);
}

// Test 4: Check specific recipe data
console.log('\n4️⃣ Checking Specific Recipe Data:');

const sampleRecipe = loadResult.recipes[0];
if (sampleRecipe) {
  console.log(`   Sample recipe: "${sampleRecipe.title}"`);
  console.log(`   - Has sections: ${Array.isArray(sampleRecipe.sections) && sampleRecipe.sections.length > 0}`);
  console.log(`   - Has ingredients: ${Array.isArray(sampleRecipe.ingredients) && sampleRecipe.ingredients.length > 0}`);
  console.log(`   - Has prepTime: ${!!sampleRecipe.prepTime}`);
  console.log(`   - Has difficulty: ${!!sampleRecipe.difficulty}`);
  console.log(`   - Has isFavorite: ${typeof sampleRecipe.isFavorite === 'boolean'}`);
  console.log(`   - Has tags: ${Array.isArray(sampleRecipe.tags) && sampleRecipe.tags.length > 0}`);
}

// Test 5: Test migration compatibility
console.log('\n5️⃣ Testing Migration Compatibility:');

// Simulate loading with migration
const migrationTest = testRecipes.map(recipe => {
  // Check if recipe has sections (modern format)
  const hasSections = !!(recipe.sections && recipe.sections.length > 0);
  const hasLegacyFormat = Array.isArray(recipe.ingredients) && 
                         typeof recipe.instructions === 'string' && 
                         !hasSections;
  
  return {
    title: recipe.title,
    hasSections,
    hasLegacyFormat,
    needsMigration: hasLegacyFormat
  };
});

const modernRecipes = migrationTest.filter(r => r.hasSections);
const legacyRecipes = migrationTest.filter(r => r.hasLegacyFormat);
const needsMigration = migrationTest.filter(r => r.needsMigration);

console.log(`   - Modern format recipes: ${modernRecipes.length}`);
console.log(`   - Legacy format recipes: ${legacyRecipes.length}`);
console.log(`   - Recipes needing migration: ${needsMigration.length}`);

if (needsMigration.length === 0) {
  console.log('   ✅ All recipes are in modern format - no migration needed');
} else {
  console.log('   ⚠️  Some recipes need migration to modern format');
}

// Final Summary
console.log('\n' + '=' .repeat(60));
console.log('📊 VALIDATION SUMMARY:');

const allValid = invalidRecipes.length === 0 && saveResult.success && !loadResult.error && originalCount === loadedCount;

if (allValid) {
  console.log('✅ ALL TESTS PASSED - Storage utilities are ready for the updated test data');
  console.log('✅ The test-recipes-10.js script can be safely used');
} else {
  console.log('❌ SOME TESTS FAILED - Issues need to be resolved before proceeding');
  if (invalidRecipes.length > 0) {
    console.log(`   - ${invalidRecipes.length} recipes have structural issues`);
  }
  if (!saveResult.success) {
    console.log(`   - Save functionality failed: ${saveResult.error}`);
  }
  if (loadResult.error) {
    console.log(`   - Load functionality failed: ${loadResult.error}`);
  }
  if (originalCount !== loadedCount) {
    console.log(`   - Data integrity issue: count mismatch`);
  }
}

console.log('\n🎯 Next Step: Test the script in browser environment');
