// Test data: 10 recipes from master CSV for testing
const testRecipes = [
  {
    id: "accordion-potatoes-560e01e7",
    title: "Accordion Potatoes",
    ingredients: "Small golden potatoes\nOlive oil\nSeasoning\n4ish cloves minced garlic\n¾ stick of butter\nLemon pepper\nCheese/Sour cream optional",
    instructions: "Preheat oven to 350°F\nWash potatoes and slice them but leave them in tact on the bottom\nLather them in olive oil and season\nPlace in a cast iron skillet and stick in the oven for a bit\nAfter, melt butter in the same pan and add garlic and lemon pepper\nBaste and stick them in the oven to caramelize a bit",
    cookTime: "",
    category: "Appetizers",
    tags: [],
    notes: "",
    rating: 0,
    image: "",
    createdAt: "2025-09-15T01:38:27.326Z",
    updatedAt: "2025-09-15T01:38:27.326Z"
  },
  {
    id: "bacon-wrapped-pickle-chips-0b43e865",
    title: "Bacon Wrapped Pickle Chips",
    ingredients: "Pickles\nBacon\nRanch to dip idk",
    instructions: "Wrap the pickle slices in bacon\nAir Fryer: 400°F for abt 12 minutes, flip halfway",
    cookTime: "",
    category: "Appetizers",
    tags: [],
    notes: "Bc why not",
    rating: 0,
    image: "",
    createdAt: "2025-09-15T01:38:27.327Z",
    updatedAt: "2025-09-15T01:38:27.327Z"
  },
  {
    id: "bagel-bites-133cd322",
    title: "Bagel Bites",
    ingredients: "Brown Sugar Cinnamon\n2 sliced bagels\n75 g melted butter. ⅓ cup. 5 ⅓ tbsp\nBrown sugar and cinnamon mixture\nSalt and Garlic\n3 bagels\n⅓ cup olive oil\n2 cloves garlic, minced\n1 teaspoon Italian seasoning\n¼ cup freshly grated Parmesan cheese\nsalt and pepper to taste\nEverything Bagel\n1 bagel\n2 tbsp olive oil or melted butter\n1/2 tsp salt\n3 tsp everything seasoning",
    instructions: "Pour butter of bagel slices\nMix in the cinnamon sugar mixture\nAir fry @ 350F for 5 minutes\nDip in nutella or cream cheese or whatever ya want",
    cookTime: "",
    category: "Appetizers",
    tags: [],
    notes: "",
    rating: 0,
    image: "",
    createdAt: "2025-09-15T01:38:27.328Z",
    updatedAt: "2025-09-15T01:38:27.328Z"
  },
  {
    id: "bread-2e4b6c47",
    title: "Bread",
    ingredients: "1 1/2 cups warm water (about 100 degrees F) (360mL)\n1 packet yeast (active dry, instant, or quick rise- 2.25 teaspoons)\n1/2 tablespoon fine grain salt (preferably NOT iodized, see notes)\n3 1/4 cups all-purpose flour or bread flour (430g)\n1 tsp sugar if using active dry yeast",
    instructions: "Instant Yeast: Just mix water, yeast and salt together until fully dissolved\nActive Dry Yeast: Proof it by mixing it with ¼ cup water and 1 tsp sugar. Let it sit for 10 min and foam\nAdd flour to the bowl and stir together until a sticky dough forms. Don't worry about mixing it too much, just make sure everything is uniformly wet. It WILL be messy and sticky. You can scrape what's left on the spoon with a silicone spatula.\nCover the bowl with a kitchen towel and leave it for 2-3 hours to rise in a somewhat warm place.\n30 minutes - 1 hr before you are ready to bake, preheat your oven to 450 degrees F and place your Dutch oven in the oven, with the lid ON\nOnce the oven reaches 450, keep it preheating for another 20 minutes\nScrape the dough into the edge of a piece of parchment paper dusted with flour. Make it into as much of a loaf shape as you can by folding the edges up on top of it (a silicone spatula works well for this).\nThen, use the edges of the parchment paper to flip the loaf over so the floured side is on top and the loaf is in the center of the parchment paper. Don't worry about it looking beautiful or smooth on top.\nTake out the preheated Dutch oven and take off the lid, carefully! Grab the parchment from the sides and place the loaf in your Dutch oven.\nPlace the cover back on the Dutch oven and place in the preheated oven on the center rack.\nBake for 35 minutes at 450 degrees F (40 minutes if dough was cold from the fridge).\nRemove lid and bake for another 5-10 minutes\nRemove the loaf from the dutch oven and let it cool for at least 30 minutes before slicing",
    cookTime: "",
    category: "Appetizers",
    tags: ["Rosemary + Olive Oil: 2 tbsp of both, just mix it in but you might need more flour To see if dough is kneaded enough, take a little part and stretch it. If it doesn't break, you're good. If it does, keep kneading. If it's too sticky and you think you've added enough flour, let it sit for 5 minutes Rub olive oil in the bowl before putting the dough in to rise Cinnamon Raisin: 1 tsp cinnamon, ¼ cup raisins Honey: ¼ cup, maybe less idk"],
    notes: "",
    rating: 0,
    image: "",
    createdAt: "2025-09-15T01:38:27.328Z",
    updatedAt: "2025-09-15T01:38:27.328Z"
  },
  {
    id: "buffalo-chicken-dip-b566e5a7",
    title: "Buffalo Chicken Dip",
    ingredients: "1 cup of shredded cooked chicken\n2 (8oz) packages of cream cheese\n1 cup of ranch\n¾ cup of buffalo sauce\n1.5 cups of shredded cheese\nChips to dip or bread to spread",
    instructions: "Mix that shiii together and add to a dish\nSprinkle with cheese and cover with foil\nCook at 450°F for 10-15 min",
    cookTime: "",
    category: "Appetizers",
    tags: [],
    notes: "",
    rating: 0,
    image: "",
    createdAt: "2025-09-15T01:38:27.328Z",
    updatedAt: "2025-09-15T01:38:27.328Z"
  },
  {
    id: "buffalo-chicken-wontons-3eb41622",
    title: "Buffalo Chicken Wontons",
    ingredients: "",
    instructions: "Instructions not provided.",
    cookTime: "",
    category: "Appetizers",
    tags: [],
    notes: "We talked about doing this for a light dinner one night for when we need to eat something but aren't in the mood for anything heavy. Picture will be added when we make it :)",
    rating: 0,
    image: "",
    createdAt: "2025-09-15T01:38:27.328Z",
    updatedAt: "2025-09-15T01:38:27.328Z"
  },
  {
    id: "chicken-nuggets-4e0f83e8",
    title: "Chicken Nuggets",
    ingredients: "1 boneless skinless chicken breast\n1/4 teaspoon salt\n1/8 teaspoon black pepper\n1/2 cup unsalted butter melted\n1/2 cup breadcrumbs\n2 tablespoons grated Parmesan optional",
    instructions: "Preheat air fryer to 390 degrees for 4 minutes.\nTrim any fat from chicken breast, Slice into 1/2 inch thick slices, then each slice into 2 to 3 nuggets. Season chicken pieces with salt and pepper.\nPlace melted butter in a small bowl and breadcrumbs ( with Parmesan, if using ) in another small bowl.\nDip each piece of chicken in butter, then breadcrumbs.\nPlace in a single layer in the air fryer basket. Depending on the size of your air fryer, you may need to bake in two batches or more.\nSet timer to 8 minutes.\nWhen done, check if the internal temperature of chicken nuggets is at least 165 degrees F. Remove nuggets from basket with tongs and set onto a plate to cool.",
    cookTime: "",
    category: "Appetizers",
    tags: [],
    notes: "",
    rating: 0,
    image: "",
    createdAt: "2025-09-15T01:38:27.328Z",
    updatedAt: "2025-09-15T01:38:27.328Z"
  },
  {
    id: "cowboy-caviar-c2448a99",
    title: "Cowboy Caviar",
    ingredients: "1 can black beans, drained and rinsed\n1 can black eyed peas, drained and rinsed\n1 can corn drained\n2 bell peppers\n1 avocado\n2 jalapenos\n2 limes\n1 red onion\n1 tomato\n½ cup olive oil\n¼ cup apple cider vinegar\nSalt, pepper, cumin, aleppo pepper, chili powder, ½ tsp sugar",
    instructions: "Chop and mix lol",
    cookTime: "",
    category: "Appetizers",
    tags: [],
    notes: "I know you don't like beans but i promise this is good",
    rating: 0,
    image: "",
    createdAt: "2025-09-15T01:38:27.328Z",
    updatedAt: "2025-09-15T01:38:27.328Z"
  },
  {
    id: "crab-rangoons-33bc8643",
    title: "Crab Rangoons",
    ingredients: "Wonton wrappers\n8 oz softened cream cheese\n8 oz crab meat\n1-2 cloves of minced garlic\n1 tsp of Worcestershire sauce\nGreen onions if ya want but who tf uses green onions\nSweet and sour sauce to dip duh",
    instructions: "Andddddd mix it mix it mix it mix it mix it\nWet ;) the edges of the wrapper\nStufffff those wontons nice and good\nFry with air at 370°F for ~10 minutes",
    cookTime: "",
    category: "Appetizers",
    tags: [],
    notes: "We've talked about making these for soooo long. We haven't yet but we will one day. Then I'll have a picture to add and maybe a funny story to write here lol.",
    rating: 0,
    image: "",
    createdAt: "2025-09-15T01:38:27.328Z",
    updatedAt: "2025-09-15T01:38:27.328Z"
  },
  {
    id: "crockpot-street-corn-dip-d33d204c",
    title: "Crockpot Street Corn Dip",
    ingredients: "2 drained cans of corn\n16 oz cream cheese\n8 oz pepper jack\nTajin\nDiced cilantro\n¼ cup sour cream",
    instructions: "Throw all of that stuff in the crockpot\nCook on low for 2.5 hours",
    cookTime: "",
    category: "Appetizers",
    tags: [],
    notes: "",
    rating: 0,
    image: "",
    createdAt: "2025-09-15T01:38:27.329Z",
    updatedAt: "2025-09-15T01:38:27.329Z"
  }
];

// Load recipes into localStorage
localStorage.setItem('myRecipesData', JSON.stringify(testRecipes));
console.log('✅ Loaded 10 test recipes into localStorage');
console.log('Recipes loaded:', testRecipes.map(r => r.title));
