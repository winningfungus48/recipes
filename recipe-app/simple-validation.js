// Simple validation of test data structure
const fs = require('fs');

// Read the test data file
const testData = fs.readFileSync('test-recipes-10.js', 'utf8');

// Extract the testRecipes array
const testRecipesMatch = testData.match(/const testRecipes = (\[[\s\S]*?\]);/);
if (!testRecipesMatch) {
  console.error('❌ Could not extract testRecipes from file');
  process.exit(1);
}

let testRecipes;
try {
  eval(`testRecipes = ${testRecipesMatch[1]};`);
} catch (error) {
  console.error('❌ Error parsing testRecipes:', error.message);
  process.exit(1);
}

console.log('🧪 Validating Updated Test Data Structure');
console.log('=' .repeat(50));

console.log(`\n📊 Basic Statistics:`);
console.log(`   - Number of recipes: ${testRecipes.length}`);
console.log(`   - Expected: 10 recipes`);

// Validate each recipe
let validCount = 0;
let warningCount = 0;

testRecipes.forEach((recipe, index) => {
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
  
  // Check modern format
  if (!Array.isArray(recipe.ingredients)) {
    warnings.push('Ingredients not array');
  }
  if (!Array.isArray(recipe.sections)) {
    warnings.push('Missing sections array');
  }
  if (!recipe.prepTime) {
    warnings.push('Missing prepTime');
  }
  if (!recipe.difficulty) {
    warnings.push('Missing difficulty');
  }
  if (typeof recipe.isFavorite !== 'boolean') {
    warnings.push('Missing isFavorite');
  }
  
  if (errors.length === 0) {
    validCount++;
  }
  
  if (warnings.length > 0) {
    warningCount++;
  }
  
  if (errors.length > 0) {
    console.log(`\n❌ Recipe ${index + 1} (${recipe.title}):`);
    errors.forEach(error => console.log(`   - ${error}`));
  }
});

console.log(`\n📈 Validation Results:`);
console.log(`   ✅ Valid recipes: ${validCount}/${testRecipes.length}`);
console.log(`   ⚠️  Recipes with warnings: ${warningCount}/${testRecipes.length}`);

// Test JSON serialization (simulates localStorage)
try {
  const jsonString = JSON.stringify(testRecipes);
  const parsed = JSON.parse(jsonString);
  
  if (parsed.length === testRecipes.length) {
    console.log(`   ✅ JSON serialization/parsing works correctly`);
  } else {
    console.log(`   ❌ JSON serialization issue: ${parsed.length} vs ${testRecipes.length}`);
  }
} catch (error) {
  console.log(`   ❌ JSON serialization failed: ${error.message}`);
}

// Check specific modern format features
const modernFormatCount = testRecipes.filter(recipe => 
  Array.isArray(recipe.sections) && 
  recipe.sections.length > 0 &&
  recipe.prepTime &&
  recipe.difficulty &&
  typeof recipe.isFavorite === 'boolean'
).length;

console.log(`\n🔧 Modern Format Features:`);
console.log(`   - Recipes with sections: ${testRecipes.filter(r => Array.isArray(r.sections) && r.sections.length > 0).length}/${testRecipes.length}`);
console.log(`   - Recipes with prepTime: ${testRecipes.filter(r => r.prepTime).length}/${testRecipes.length}`);
console.log(`   - Recipes with difficulty: ${testRecipes.filter(r => r.difficulty).length}/${testRecipes.length}`);
console.log(`   - Recipes with isFavorite: ${testRecipes.filter(r => typeof r.isFavorite === 'boolean').length}/${testRecipes.length}`);
console.log(`   - Fully modern format: ${modernFormatCount}/${testRecipes.length}`);

// Final assessment
console.log(`\n🎯 Final Assessment:`);
if (validCount === testRecipes.length && modernFormatCount === testRecipes.length) {
  console.log(`✅ ALL TESTS PASSED - Test data is ready for use`);
  console.log(`✅ Storage utilities should handle this data correctly`);
} else if (validCount === testRecipes.length) {
  console.log(`✅ Basic validation passed - Test data is usable`);
  console.log(`⚠️  Some modern format features missing but compatible`);
} else {
  console.log(`❌ Validation failed - Issues need to be fixed`);
}

console.log(`\n🚀 Ready for browser testing!`);
