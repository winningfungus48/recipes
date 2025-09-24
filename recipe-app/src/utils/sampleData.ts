import { Recipe } from '../types/recipe'

// Sample recipes data - 10 complete recipes for testing
export const sampleRecipes: Recipe[] = [
  {
    id: "accordion-potatoes-560e01e7",
    title: "Accordion Potatoes",
    ingredients: ["Small golden potatoes", "Olive oil", "Seasoning", "4ish cloves minced garlic", "¾ stick of butter", "Lemon pepper", "Cheese/Sour cream optional"],
    instructions: "Preheat oven to 350°F\nWash potatoes and slice them but leave them in tact on the bottom\nLather them in olive oil and season\nPlace in a cast iron skillet and stick in the oven for a bit\nAfter, melt butter in the same pan and add garlic and lemon pepper\nBaste and stick them in the oven to caramelize a bit",
    sections: [{
      label: "Main",
      ingredients: ["Small golden potatoes", "Olive oil", "Seasoning", "4ish cloves minced garlic", "¾ stick of butter", "Lemon pepper", "Cheese/Sour cream optional"],
      instructions: ["Preheat oven to 350°F", "Wash potatoes and slice them but leave them in tact on the bottom", "Lather them in olive oil and season", "Place in a cast iron skillet and stick in the oven for a bit", "After, melt butter in the same pan and add garlic and lemon pepper", "Baste and stick them in the oven to caramelize a bit"]
    }],
    cookTime: "45 min",
    prepTime: "15 min",
    category: "Appetizers",
    tags: ["potatoes", "oven", "easy"],
    notes: "",
    rating: 4.5,
    difficulty: "Easy",
    source: "",
    lastCooked: "",
    isFavorite: false,
    image: "",
    createdAt: "2025-09-15T01:38:27.326Z",
    updatedAt: "2025-09-15T01:38:27.326Z"
  },
  {
    id: "bacon-wrapped-pickle-chips-0b43e865",
    title: "Bacon Wrapped Pickle Chips",
    ingredients: ["Pickles", "Bacon", "Ranch to dip idk"],
    instructions: "Wrap the pickle slices in bacon\nAir Fryer: 400°F for abt 12 minutes, flip halfway",
    sections: [{
      label: "Main",
      ingredients: ["Pickles", "Bacon", "Ranch to dip idk"],
      instructions: ["Wrap the pickle slices in bacon", "Air Fryer: 400°F for abt 12 minutes, flip halfway"]
    }],
    cookTime: "12 min",
    prepTime: "5 min",
    category: "Appetizers",
    tags: ["bacon", "pickles", "air-fryer"],
    notes: "Bc why not",
    rating: 4.0,
    difficulty: "Easy",
    source: "",
    lastCooked: "",
    isFavorite: false,
    image: "",
    createdAt: "2025-09-15T01:38:27.327Z",
    updatedAt: "2025-09-15T01:38:27.327Z"
  },
  {
    id: "bagel-bites-133cd322",
    title: "Bagel Bites",
    ingredients: ["Brown Sugar Cinnamon", "2 sliced bagels", "75 g melted butter. ⅓ cup. 5 ⅓ tbsp", "Brown sugar and cinnamon mixture", "Salt and Garlic", "3 bagels", "⅓ cup olive oil", "2 cloves garlic, minced", "1 teaspoon Italian seasoning", "¼ cup freshly grated Parmesan cheese", "salt and pepper to taste", "Everything Bagel", "1 bagel", "2 tbsp olive oil or melted butter", "1/2 tsp salt", "3 tsp everything seasoning"],
    instructions: "Pour butter of bagel slices\nMix in the cinnamon sugar mixture\nAir fry @ 350F for 5 minutes\nDip in nutella or cream cheese or whatever ya want",
    sections: [{
      label: "Main",
      ingredients: ["Brown Sugar Cinnamon", "2 sliced bagels", "75 g melted butter. ⅓ cup. 5 ⅓ tbsp", "Brown sugar and cinnamon mixture", "Salt and Garlic", "3 bagels", "⅓ cup olive oil", "2 cloves garlic, minced", "1 teaspoon Italian seasoning", "¼ cup freshly grated Parmesan cheese", "salt and pepper to taste", "Everything Bagel", "1 bagel", "2 tbsp olive oil or melted butter", "1/2 tsp salt", "3 tsp everything seasoning"],
      instructions: ["Pour butter of bagel slices", "Mix in the cinnamon sugar mixture", "Air fry @ 350F for 5 minutes", "Dip in nutella or cream cheese or whatever ya want"]
    }],
    cookTime: "5 min",
    prepTime: "10 min",
    category: "Appetizers",
    tags: ["bagels", "air-fryer", "quick"],
    notes: "",
    rating: 3.5,
    difficulty: "Easy",
    source: "",
    lastCooked: "",
    isFavorite: false,
    image: "",
    createdAt: "2025-09-15T01:38:27.328Z",
    updatedAt: "2025-09-15T01:38:27.328Z"
  },
  {
    id: "bread-2e4b6c47",
    title: "Bread",
    ingredients: ["1 1/2 cups warm water (about 100 degrees F) (360mL)", "1 packet yeast (active dry, instant, or quick rise- 2.25 teaspoons)", "1/2 tablespoon fine grain salt (preferably NOT iodized, see notes)", "3 1/4 cups all-purpose flour or bread flour (430g)", "1 tsp sugar if using active dry yeast"],
    instructions: "Instant Yeast: Just mix water, yeast and salt together until fully dissolved\nActive Dry Yeast: Proof it by mixing it with ¼ cup water and 1 tsp sugar. Let it sit for 10 min and foam\nAdd flour to the bowl and stir together until a sticky dough forms. Don't worry about mixing it too much, just make sure everything is uniformly wet. It WILL be messy and sticky. You can scrape what's left on the spoon with a silicone spatula.\nCover the bowl with a kitchen towel and leave it for 2-3 hours to rise in a somewhat warm place.\n30 minutes - 1 hr before you are ready to bake, preheat your oven to 450 degrees F and place your Dutch oven in the oven, with the lid ON\nOnce the oven reaches 450, keep it preheating for another 20 minutes\nScrape the dough into the edge of a piece of parchment paper dusted with flour. Make it into as much of a loaf shape as you can by folding the edges up on top of it (a silicone spatula works well for this).\nThen, use the edges of the parchment paper to flip the loaf over so the floured side is on top and the loaf is in the center of the parchment paper. Don't worry about it looking beautiful or smooth on top.\nTake out the preheated Dutch oven and take off the lid, carefully! Grab the parchment from the sides and place the loaf in your Dutch oven.\nPlace the cover back on the Dutch oven and place in the preheated oven on the center rack.\nBake for 35 minutes at 450 degrees F (40 minutes if dough was cold from the fridge).\nRemove lid and bake for another 5-10 minutes\nRemove the loaf from the dutch oven and let it cool for at least 30 minutes before slicing",
    sections: [{
      label: "Main",
      ingredients: ["1 1/2 cups warm water (about 100 degrees F) (360mL)", "1 packet yeast (active dry, instant, or quick rise- 2.25 teaspoons)", "1/2 tablespoon fine grain salt (preferably NOT iodized, see notes)", "3 1/4 cups all-purpose flour or bread flour (430g)", "1 tsp sugar if using active dry yeast"],
      instructions: ["Instant Yeast: Just mix water, yeast and salt together until fully dissolved", "Active Dry Yeast: Proof it by mixing it with ¼ cup water and 1 tsp sugar. Let it sit for 10 min and foam", "Add flour to the bowl and stir together until a sticky dough forms. Don't worry about mixing it too much, just make sure everything is uniformly wet. It WILL be messy and sticky. You can scrape what's left on the spoon with a silicone spatula.", "Cover the bowl with a kitchen towel and leave it for 2-3 hours to rise in a somewhat warm place.", "30 minutes - 1 hr before you are ready to bake, preheat your oven to 450 degrees F and place your Dutch oven in the oven, with the lid ON", "Once the oven reaches 450, keep it preheating for another 20 minutes", "Scrape the dough into the edge of a piece of parchment paper dusted with flour. Make it into as much of a loaf shape as you can by folding the edges up on top of it (a silicone spatula works well for this).", "Then, use the edges of the parchment paper to flip the loaf over so the floured side is on top and the loaf is in the center of the parchment paper. Don't worry about it looking beautiful or smooth on top.", "Take out the preheated Dutch oven and take off the lid, carefully! Grab the parchment from the sides and place the loaf in your Dutch oven.", "Place the cover back on the Dutch oven and place in the preheated oven on the center rack.", "Bake for 35 minutes at 450 degrees F (40 minutes if dough was cold from the fridge).", "Remove lid and bake for another 5-10 minutes", "Remove the loaf from the dutch oven and let it cool for at least 30 minutes before slicing"]
    }],
    cookTime: "45 min",
    prepTime: "3 hours",
    category: "Appetizers",
    tags: ["bread", "yeast", "dutch oven"],
    notes: "",
    rating: 4.8,
    difficulty: "Medium",
    source: "",
    lastCooked: "",
    isFavorite: true,
    image: "",
    createdAt: "2025-09-15T01:38:27.328Z",
    updatedAt: "2025-09-15T01:38:27.328Z"
  },
  {
    id: "buffalo-chicken-dip-b566e5a7",
    title: "Buffalo Chicken Dip",
    ingredients: ["1 cup of shredded cooked chicken", "2 (8oz) packages of cream cheese", "1 cup of ranch", "¾ cup of buffalo sauce", "1.5 cups of shredded cheese", "Chips to dip or bread to spread"],
    instructions: "Mix that shiii together and add to a dish\nSprinkle with cheese and cover with foil\nCook at 450°F for 10-15 min",
    sections: [{
      label: "Main",
      ingredients: ["1 cup of shredded cooked chicken", "2 (8oz) packages of cream cheese", "1 cup of ranch", "¾ cup of buffalo sauce", "1.5 cups of shredded cheese", "Chips to dip or bread to spread"],
      instructions: ["Mix that shiii together and add to a dish", "Sprinkle with cheese and cover with foil", "Cook at 450°F for 10-15 min"]
    }],
    cookTime: "15 min",
    prepTime: "10 min",
    category: "Appetizers",
    tags: ["chicken", "dip", "buffalo"],
    notes: "",
    rating: 4.2,
    difficulty: "Easy",
    source: "",
    lastCooked: "",
    isFavorite: false,
    image: "",
    createdAt: "2025-09-15T01:38:27.328Z",
    updatedAt: "2025-09-15T01:38:27.328Z"
  },
  {
    id: "buffalo-chicken-wontons-3eb41622",
    title: "Buffalo Chicken Wontons",
    ingredients: [],
    instructions: "Instructions not provided.",
    sections: [{
      label: "Main",
      ingredients: [],
      instructions: ["Instructions not provided."]
    }],
    cookTime: "10 min",
    prepTime: "15 min",
    category: "Appetizers",
    tags: ["wontons", "chicken", "buffalo"],
    notes: "We talked about doing this for a light dinner one night for when we need to eat something but aren't in the mood for anything heavy. Picture will be added when we make it :)",
    rating: 0,
    difficulty: "Easy",
    source: "",
    lastCooked: "",
    isFavorite: false,
    image: "",
    createdAt: "2025-09-15T01:38:27.328Z",
    updatedAt: "2025-09-15T01:38:27.328Z"
  },
  {
    id: "chicken-nuggets-4e0f83e8",
    title: "Chicken Nuggets",
    ingredients: ["1 boneless skinless chicken breast", "1/4 teaspoon salt", "1/8 teaspoon black pepper", "1/2 cup unsalted butter melted", "1/2 cup breadcrumbs", "2 tablespoons grated Parmesan optional"],
    instructions: "Preheat air fryer to 390 degrees for 4 minutes.\nTrim any fat from chicken breast, Slice into 1/2 inch thick slices, then each slice into 2 to 3 nuggets. Season chicken pieces with salt and pepper.\nPlace melted butter in a small bowl and breadcrumbs ( with Parmesan, if using ) in another small bowl.\nDip each piece of chicken in butter, then breadcrumbs.\nPlace in a single layer in the air fryer basket. Depending on the size of your air fryer, you may need to bake in two batches or more.\nSet timer to 8 minutes.\nWhen done, check if the internal temperature of chicken nuggets is at least 165 degrees F. Remove nuggets from basket with tongs and set onto a plate to cool.",
    sections: [{
      label: "Main",
      ingredients: ["1 boneless skinless chicken breast", "1/4 teaspoon salt", "1/8 teaspoon black pepper", "1/2 cup unsalted butter melted", "1/2 cup breadcrumbs", "2 tablespoons grated Parmesan optional"],
      instructions: ["Preheat air fryer to 390 degrees for 4 minutes.", "Trim any fat from chicken breast, Slice into 1/2 inch thick slices, then each slice into 2 to 3 nuggets. Season chicken pieces with salt and pepper.", "Place melted butter in a small bowl and breadcrumbs ( with Parmesan, if using ) in another small bowl.", "Dip each piece of chicken in butter, then breadcrumbs.", "Place in a single layer in the air fryer basket. Depending on the size of your air fryer, you may need to bake in two batches or more.", "Set timer to 8 minutes.", "When done, check if the internal temperature of chicken nuggets is at least 165 degrees F. Remove nuggets from basket with tongs and set onto a plate to cool."]
    }],
    cookTime: "8 min",
    prepTime: "15 min",
    category: "Appetizers",
    tags: ["chicken", "air-fryer", "nuggets"],
    notes: "",
    rating: 4.0,
    difficulty: "Easy",
    source: "",
    lastCooked: "",
    isFavorite: false,
    image: "",
    createdAt: "2025-09-15T01:38:27.328Z",
    updatedAt: "2025-09-15T01:38:27.328Z"
  },
  {
    id: "cowboy-caviar-c2448a99",
    title: "Cowboy Caviar",
    ingredients: ["1 can black beans, drained and rinsed", "1 can black eyed peas, drained and rinsed", "1 can corn drained", "2 bell peppers", "1 avocado", "2 jalapenos", "2 limes", "1 red onion", "1 tomato", "½ cup olive oil", "¼ cup apple cider vinegar", "Salt, pepper, cumin, aleppo pepper, chili powder, ½ tsp sugar"],
    instructions: "Chop and mix lol",
    sections: [{
      label: "Main",
      ingredients: ["1 can black beans, drained and rinsed", "1 can black eyed peas, drained and rinsed", "1 can corn drained", "2 bell peppers", "1 avocado", "2 jalapenos", "2 limes", "1 red onion", "1 tomato", "½ cup olive oil", "¼ cup apple cider vinegar", "Salt, pepper, cumin, aleppo pepper, chili powder, ½ tsp sugar"],
      instructions: ["Chop and mix lol"]
    }],
    cookTime: "0 min",
    prepTime: "20 min",
    category: "Appetizers",
    tags: ["beans", "dip", "vegetarian"],
    notes: "I know you don't like beans but i promise this is good",
    rating: 3.8,
    difficulty: "Easy",
    source: "",
    lastCooked: "",
    isFavorite: false,
    image: "",
    createdAt: "2025-09-15T01:38:27.328Z",
    updatedAt: "2025-09-15T01:38:27.328Z"
  },
  {
    id: "crab-rangoons-33bc8643",
    title: "Crab Rangoons",
    ingredients: ["Wonton wrappers", "8 oz softened cream cheese", "8 oz crab meat", "1-2 cloves of minced garlic", "1 tsp of Worcestershire sauce", "Green onions if ya want but who tf uses green onions", "Sweet and sour sauce to dip duh"],
    instructions: "Andddddd mix it mix it mix it mix it mix it\nWet ;) the edges of the wrapper\nStufffff those wontons nice and good\nFry with air at 370°F for ~10 minutes",
    sections: [{
      label: "Main",
      ingredients: ["Wonton wrappers", "8 oz softened cream cheese", "8 oz crab meat", "1-2 cloves of minced garlic", "1 tsp of Worcestershire sauce", "Green onions if ya want but who tf uses green onions", "Sweet and sour sauce to dip duh"],
      instructions: ["Andddddd mix it mix it mix it mix it mix it", "Wet ;) the edges of the wrapper", "Stufffff those wontons nice and good", "Fry with air at 370°F for ~10 minutes"]
    }],
    cookTime: "10 min",
    prepTime: "20 min",
    category: "Appetizers",
    tags: ["crab", "wontons", "air-fryer"],
    notes: "We've talked about making these for soooo long. We haven't yet but we will one day. Then I'll have a picture to add and maybe a funny story to write here lol.",
    rating: 0,
    difficulty: "Medium",
    source: "",
    lastCooked: "",
    isFavorite: false,
    image: "",
    createdAt: "2025-09-15T01:38:27.328Z",
    updatedAt: "2025-09-15T01:38:27.328Z"
  },
  {
    id: "crockpot-street-corn-dip-d33d204c",
    title: "Crockpot Street Corn Dip",
    ingredients: ["2 drained cans of corn", "16 oz cream cheese", "8 oz pepper jack", "Tajin", "Diced cilantro", "¼ cup sour cream"],
    instructions: "Throw all of that stuff in the crockpot\nCook on low for 2.5 hours",
    sections: [{
      label: "Main",
      ingredients: ["2 drained cans of corn", "16 oz cream cheese", "8 oz pepper jack", "Tajin", "Diced cilantro", "¼ cup sour cream"],
      instructions: ["Throw all of that stuff in the crockpot", "Cook on low for 2.5 hours"]
    }],
    cookTime: "2.5 hours",
    prepTime: "10 min",
    category: "Appetizers",
    tags: ["corn", "crockpot", "dip"],
    notes: "",
    rating: 4.3,
    difficulty: "Easy",
    source: "",
    lastCooked: "",
    isFavorite: false,
    image: "",
    createdAt: "2025-09-15T01:38:27.329Z",
    updatedAt: "2025-09-15T01:38:27.329Z"
  }
]

// Storage keys
const RECIPES_STORAGE_KEY = 'myRecipesData'
const SAMPLE_DATA_LOADED_KEY = 'sampleDataLoaded'
const FIRST_VISIT_KEY = 'firstVisit'

/**
 * Check if this is the user's first visit to the app
 */
export function isFirstVisit(): boolean {
  const firstVisit = localStorage.getItem(FIRST_VISIT_KEY)
  if (!firstVisit) {
    localStorage.setItem(FIRST_VISIT_KEY, 'false')
    return true
  }
  return false
}

/**
 * Check if sample data has already been loaded
 */
export function hasSampleDataLoaded(): boolean {
  return localStorage.getItem(SAMPLE_DATA_LOADED_KEY) === 'true'
}

/**
 * Check if there are any existing recipes in localStorage
 */
export function hasExistingRecipes(): boolean {
  try {
    const existingData = localStorage.getItem(RECIPES_STORAGE_KEY)
    if (!existingData) return false
    
    const recipes = JSON.parse(existingData)
    return Array.isArray(recipes) && recipes.length > 0
  } catch (error) {
    console.error('Error checking existing recipes:', error)
    return false
  }
}

/**
 * Validate a recipe object
 */
export function validateRecipe(recipe: Recipe): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required fields
  if (!recipe.id || typeof recipe.id !== 'string') {
    errors.push('Missing or invalid id')
  }
  if (!recipe.title || typeof recipe.title !== 'string') {
    errors.push('Missing or invalid title')
  }
  if (!recipe.category || typeof recipe.category !== 'string') {
    errors.push('Missing or invalid category')
  }

  // Check optional fields with warnings
  if (!Array.isArray(recipe.ingredients)) {
    warnings.push('Ingredients should be an array')
  }
  if (typeof recipe.instructions !== 'string') {
    warnings.push('Instructions should be a string')
  }
  if (!Array.isArray(recipe.tags)) {
    warnings.push('Tags should be an array')
  }
  if (!Array.isArray(recipe.sections)) {
    warnings.push('Sections should be an array')
  }

  // Validate sections structure if present
  if (recipe.sections && recipe.sections.length > 0) {
    recipe.sections.forEach((section, index) => {
      if (!section.label || typeof section.label !== 'string') {
        warnings.push(`Section ${index + 1}: Missing or invalid label`)
      }
      if (!Array.isArray(section.ingredients)) {
        warnings.push(`Section ${index + 1}: Ingredients should be an array`)
      }
      if (!Array.isArray(section.instructions)) {
        warnings.push(`Section ${index + 1}: Instructions should be an array`)
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Load sample data into localStorage
 */
export function loadSampleData(): { success: boolean; message: string; errors?: string[] } {
  try {
    // Validate all sample recipes first
    const validationResults = sampleRecipes.map((recipe, index) => ({
      index: index + 1,
      title: recipe.title,
      validation: validateRecipe(recipe)
    }))

    const invalidRecipes = validationResults.filter(result => !result.validation.isValid)
    
    if (invalidRecipes.length > 0) {
      const errorDetails = invalidRecipes.map(result => 
        `Recipe ${result.index} (${result.title}): ${result.validation.errors.join(', ')}`
      ).join('\n')
      
      return {
        success: false,
        message: `Validation failed for ${invalidRecipes.length} recipes`,
        errors: [errorDetails]
      }
    }

    // Load the sample data
    localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(sampleRecipes))
    localStorage.setItem(SAMPLE_DATA_LOADED_KEY, 'true')
    
    return {
      success: true,
      message: `Successfully loaded ${sampleRecipes.length} sample recipes!`
    }
  } catch (error) {
    return {
      success: false,
      message: `Error loading sample data: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Check if sample data should be loaded automatically
 * Returns true if: first visit AND no existing recipes
 */
export function shouldLoadSampleData(): boolean {
  return isFirstVisit() && !hasExistingRecipes()
}

/**
 * Clear all recipe data from localStorage
 */
export function clearAllRecipeData(): { success: boolean; message: string } {
  try {
    localStorage.removeItem(RECIPES_STORAGE_KEY)
    localStorage.removeItem(SAMPLE_DATA_LOADED_KEY)
    localStorage.removeItem(FIRST_VISIT_KEY)
    
    return {
      success: true,
      message: 'All recipe data cleared successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: `Error clearing data: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Get current recipe count from localStorage
 */
export function getCurrentRecipeCount(): number {
  try {
    const existingData = localStorage.getItem(RECIPES_STORAGE_KEY)
    if (!existingData) return 0
    
    const recipes = JSON.parse(existingData)
    return Array.isArray(recipes) ? recipes.length : 0
  } catch (error) {
    console.error('Error getting recipe count:', error)
    return 0
  }
}
