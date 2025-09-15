# Recipe App

A personal recipe organizer website built with React, TypeScript, and Vite. Store, organize, and discover your favorite recipes in a beautiful, kitchen-inspired interface.

## Features

### Phase 1 - Core Recipe MVP ✅

- **Manual Recipe Entry**: Create recipes with detailed ingredients, instructions, cook time, category, tags, notes, and star ratings
- **Import from URL**: Import recipes from any website with smart scraping (mock implementation)
- **Recipe Display**: Toggle between grid and list views for browsing recipes
- **Search & Filters**: Full-text search with category and tag filtering
- **Recipe Details**: View complete recipe information with edit/delete options
- **Local Storage**: All data stored locally in browser (no backend required)
- **Responsive Design**: Beautiful, mobile-friendly interface with kitchen-inspired theme

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **State Management**: React Context + useReducer
- **Storage**: LocalStorage

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the recipe-app directory
3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── RecipeCard.tsx  # Recipe display component
│   ├── RecipeForm.tsx  # Recipe creation/editing form
│   ├── RecipeDetail.tsx # Full recipe view
│   ├── FilterPanel.tsx # Search and filter controls
│   ├── LayoutToggle.tsx # Grid/List view toggle
│   └── StarRating.tsx  # Interactive star rating
├── pages/              # Page components
│   ├── LandingPage.tsx # Home page
│   ├── RecipeListPage.tsx # Recipe library
│   ├── NewRecipePage.tsx # Add new recipe
│   ├── ImportRecipePage.tsx # Import from URL
│   ├── RecipeDetailPage.tsx # Individual recipe view
│   └── EditRecipePage.tsx # Edit existing recipe
├── context/            # Global state management
│   └── RecipesContext.tsx # Recipe state and actions
├── data/               # Static data
│   ├── categories.ts   # Recipe categories
│   └── tags.ts         # Popular tags
├── utils/              # Utility functions
│   ├── storage.ts      # LocalStorage helpers
│   └── scraper.ts      # Recipe scraping (mock)
├── types/              # TypeScript type definitions
│   └── recipe.ts       # Recipe-related types
└── App.tsx             # Main app component
```

## Features in Detail

### Recipe Management
- Create recipes with rich metadata (title, ingredients, instructions, cook time, category, tags, notes, rating, image)
- Edit existing recipes with pre-filled forms
- Delete recipes with confirmation
- Star rating system (0-5 stars with half-star support)

### Search & Organization
- Full-text search across titles, ingredients, and tags
- Filter by category (Breakfast, Lunch/Dinner, Desserts, Appetizers, Drinks)
- Filter by tags with popular tag suggestions
- Sort by title, rating, or creation date (ascending/descending)

### Import System
- Import recipes from URLs (mock implementation)
- Preview and edit imported recipes before saving
- Extract title, ingredients, instructions, and cook time

### UI/UX
- Kitchen-inspired color palette (sage green, wood brown, cream)
- Responsive design for mobile and desktop
- Grid and list view options
- Clean, modern interface with smooth transitions
- Accessible components with proper ARIA labels

## Data Storage

All recipe data is stored locally in the browser's LocalStorage under the key `myRecipesData`. The data structure includes:

```typescript
interface Recipe {
  id: string
  title: string
  ingredients: string[]
  instructions: string
  cookTime: string
  category: Category
  tags: string[]
  notes: string
  rating: number
  image?: string
  createdAt: string
  updatedAt?: string
}
```

## Future Phases

This is Phase 1 of the recipe app. Future phases will include:

- **Phase 2**: Smart imports with real web scraping, UX enhancements
- **Phase 3**: AI assistant foundation for recipe suggestions
- **Phase 4**: Personal assistant tools (meal planning, grocery lists)
- **Phase 5**: Scale & share features for multi-user support

## Development

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Consistent naming conventions
- Modular component architecture
- Comprehensive error handling

### Performance
- React optimization techniques (memo, useMemo, useCallback)
- Efficient re-rendering
- Lazy loading considerations
- Optimized bundle size

## License

This project is for personal use. Feel free to use as inspiration for your own recipe apps!
