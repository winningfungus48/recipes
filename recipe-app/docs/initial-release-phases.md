# Recipe App Development Phases

This document serves as the **living document** to track all development phases of the recipe app. Each phase will be enhanced with detailed feature breakdowns as development progresses.

---

## Phase 1 – Core Recipe MVP
Manual and link-based recipe entry with filterable display

## Phase 2 – Smart Imports + UX Enhancements

### 🧩 Development Scope

**Bulk Import System**
- Add new page at `/import/bulk` for bulk importing recipes from structured `.csv` or `.json` files
- Include UI to preview imported recipes, check for duplicates, and allow manual selection of what to save
- Provide basic error handling and column mapping functionality
- **Command-line bulk import tool** for processing existing CSV files from Google Docs exports
- **Enhanced CSV parser** with robust multi-line content handling and validation
- **Error reporting system** with detailed logs and duplicate detection

**Tag and Category Management**
- Add new page at `/manage` for comprehensive tag and category management
- Allow users to view, rename, delete, and merge tags and categories
- Sync all changes across the entire application

**Enhanced Recipe List Features**
- **Sorting options**: A–Z, Rating, Most Recent, Cook Time
- **New filters**: Rating slider, "Has image" toggle, "Recently added"
- Visual pills or chips for active tags
- "Favorite" toggle on each recipe card

**Extended Recipe Schema**
- `prepTime` (string)
- `difficulty` (enum: Easy, Medium, Hard)
- `source` (string, e.g. website URL)
- `lastCooked` (date)
- **`Other` category** for unmatched recipe categories from CSV imports

**Improved Recipe Edit Experience**
- Add "Quick Edit" inline mode for list view
- Use tabs or accordions in the full edit form for better field organization
- Add "Delete All" option with confirmation modal for batch cleanup

**Data Persistence**
- Use LocalStorage for all data persistence
- Ensure existing recipes load properly with the expanded schema

## Phase 3 – AI Assistant Foundation

### 🔧 Development Scope

**Screenshot Upload with AI Extraction**
- Add new route `/upload/ai` or integrate into `/new` page
- Allow user to upload a screenshot or photo of a recipe
- Parse the image using AI service to extract: `title`, `ingredients`, `instructions`, `cookTime`, optional tags
- Display a pre-filled recipe form using extracted values
- User must **confirm or edit** before saving the recipe

**Instruction Summarization (TL;DR Mode)**
- On recipe detail page, show "Summarize Instructions" button if instructions are long
- Use AI to generate brief 2–3 sentence overview
- Show summary as collapsible pill-style section labeled "Quick Summary" above full instructions
- Summary never overwrites original instructions

**Smart Cleanup for URL Imports**
- On `/import` page, add toggle for "🧠 Smart Cleanup"
- When enabled, use AI to strip blog-style fluff from scraped instructions
- Show both original and cleaned versions in editable preview before saving
- User can choose which version to keep

**Suggested Tags Based on Content**
- When creating or importing recipes, analyze title + ingredients for suggested tags
- Show suggested tags below tag input field
- Tags added manually by clicking; never auto-inserted
- Common tags: `chicken`, `high protein`, `vegetarian`, `gluten-free`, etc.

**Data Schema Updates**
- Add new optional fields:
  - `summary` (string) – AI-generated TL;DR of instructions
  - `aiSource` (enum: `"url"`, `"screenshot"`, `"none"`)
  - `parsedFromImage` (boolean)

**QA & Fallback Requirements**
- All AI outputs must be editable by user before saving
- Mock AI APIs return delayed hardcoded results for now
- All existing recipes from Phases 1–2 remain fully compatible

### 🔗 Routes to Create or Modify

| Route          | Description                                |
| -------------- | ------------------------------------------ |
| `/upload/ai`   | Upload screenshot → parse to editable form |
| `/recipes/:id` | Show "Quick Summary" (if available)        |
| `/import`      | Add "Smart Cleanup" toggle for URL parsing |

## Phase 4 – Personal Assistant Tools
Advanced personalization, meal planning, and productivity features

## Phase 5 – Scale & Share
Multi-user support, sharing capabilities, and platform scaling

---

*This document will be updated as each phase is enhanced with detailed specifications.*
