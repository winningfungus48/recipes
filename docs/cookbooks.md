# Cooks Books - Implementation Plan

- note for mason: have cursor read this document. then follow the prompts after each phase. ask questions before proceeding

## Overview

This document outlines the comprehensive plan to transform the Recipe App into **Cooks Books** - a cookbook management system that allows users to organize their recipes into themed collections.

## Project Goals

- **Primary**: Enable users to create and manage multiple cookbooks
- **Secondary**: Maintain existing recipe functionality while adding organizational layers
- **Tertiary**: Improve user experience with better navigation and visual hierarchy

---

## **Phase 1 – Renaming & Routing**

### Core Changes
- [ ] Rename the app everywhere from *Recipe App* to **Cooks Books**
  - [ ] Update navbar branding
  - [ ] Update footer text
  - [ ] Update metadata and SEO
  - [ ] Update documentation references
- [ ] Change the main landing page to `/cooksbooks`
- [ ] Move existing `/recipes` to a subpage under this structure
- [ ] Update navigation/hamburger to reflect new hierarchy
  - [ ] Home → Cooks Books
  - [ ] Cookbooks (new section)
  - [ ] Recipes (moved to subpage)

### Enhancement: SEO & Metadata
- [ ] Add SEO-friendly metadata updates
  - [ ] Update `<title>` tags across all pages
  - [ ] Add comprehensive `<meta description>` tags
  - [ ] Implement OpenGraph tags for social sharing
  - [ ] Add structured data markup for recipes and cookbooks

### Technical Implementation
- [ ] Update `App.tsx` routing structure
- [ ] Modify `Header.tsx` and `MobileNavigationDrawer.tsx`
- [ ] Update all page titles and meta descriptions
- [ ] Create new landing page at `/cooksbooks`


Prompt
**Cursor Prompt — Phase 1: Renaming & Routing for “Cooks Books”**

Act as a senior SaaS engineer. Implement Phase 1 of the rebrand and routing updates.

### Requirements

1. **App Renaming**

   * Replace all instances of the current app name (*Recipe App*) with **“Cooks Books.”**
   * Update references in:

     * Navbar / header brand
     * Footer
     * Browser tab title
     * SEO metadata (`<title>`, `<meta description>`, OpenGraph tags, etc.)
     * Docs/readme references

2. **Routing Changes**

   * Change the **main landing page** to `/cooksbooks`.
   * Move existing `/recipes` to remain as a subpage accessible from the nav.
   * Add redirect from `/` → `/cooksbooks` to avoid 404s for old bookmarks.

3. **Navigation & Hierarchy**

   * Update the navigation bar and hamburger menu to reflect the new structure:

     * Home → `/cooksbooks` (landing page)
     * Cookbooks (placeholder link for now, points to `/cookbooks`)
     * Recipes → `/recipes`
     * (Keep other existing nav items intact: Favorites, About, etc.)

4. **Enhancement**

   * Add SEO-friendly metadata updates: ensure `<title>`, `<meta description>`, and OpenGraph tags all reflect **Cooks Books**.

### Deliverables

* Updated app branding and SEO metadata with “Cooks Books.”
* Main page served at `/cooksbooks`; `/recipes` remains accessible as a subpage.
* Redirect from `/` → `/cooksbooks`.
* Updated nav/hamburger with new structure.
* Short markdown summary listing changed files, new routes, and how to test (load `/`, confirm redirect, confirm nav updates, confirm metadata changes).

Do not touch functionality unrelated to renaming and routing. Keep all recipe and import features intact.

---

## **Phase 2 – Cookbook Data Model**

### Core Schema
- [ ] Add `cookbooks[]` to localStorage schema with fields:
  - [ ] `id` - unique identifier
  - [ ] `name` - cookbook title
  - [ ] `subtitle` - optional description
  - [ ] `recipes[]` - array of recipe IDs
  - [ ] `image` - placeholder for cover image
- [ ] Implement many-to-many relationship between recipes and cookbooks
- [ ] Add cross-referencing by IDs system

### Enhancement 1: Timestamps
- [ ] Add `createdAt` timestamp to each cookbook
- [ ] Add `updatedAt` timestamp to each cookbook
- [ ] Implement automatic timestamp updates on modifications

### Enhancement 2: Performance Optimization
- [ ] Cache `recipeCount` on each cookbook
- [ ] Update count when recipes are added/removed
- [ ] Implement efficient count recalculation

### Enhancement 3: Future-Proofing
- [ ] Add hidden `tags[]` field for future grouping
- [ ] Design schema to avoid future migration needs
- [ ] Plan for extensibility without breaking changes

### Technical Implementation
- [ ] Update `RecipesContext.tsx` to include cookbook management
- [ ] Create `Cookbook` TypeScript interface
- [ ] Implement cookbook CRUD operations
- [ ] Add data migration utilities for existing users


PROMPT
**Cursor Prompt — Phase 2: Cookbook Data Model for “Cooks Books”**

Act as a senior SaaS engineer. Implement Phase 2 of the Cooks Books plan by extending the localStorage data model to support **cookbooks** while keeping recipes fully functional.

### Requirements

1. **Cookbook Schema**

   * Add a new `cookbooks[]` collection in localStorage.
   * Each cookbook object should include:

     * `id` (UUID)
     * `name` (string)
     * `subtitle` (string, optional)
     * `recipes[]` (array of recipe IDs)
     * `image` (cover image URL, auto-generated from first recipe image; fallback placeholder; optional user-upload field reserved for later)
     * `createdAt` and `updatedAt` timestamps
     * `recipeCount` (integer, auto-updated whenever recipes are added/removed)
     * `tags[]` (array, unused for now but reserved for future grouping)

2. **Recipe Cross-Referencing**

   * Allow recipes to belong to multiple cookbooks.
   * Implement cross-referencing: recipes store an array of associated cookbook IDs, and cookbooks store an array of recipe IDs.

3. **Data Handling & Persistence**

   * Ensure localStorage read/write is atomic and non-breaking for existing recipes.
   * Backfill support: if no cookbooks exist, initialize `cookbooks[] = []`.
   * When a cookbook is created or updated, automatically update `recipeCount` and `updatedAt`.

4. **Extensibility**

   * Structure schema and helper functions so additional cookbook fields (tags, sharing, exports) can be added later without migration headaches.
   * Keep data model changes isolated in a dedicated file (e.g., `cookbookModel.js/ts`) with clear helper functions: `createCookbook`, `addRecipeToCookbook`, `removeRecipeFromCookbook`, etc.

### Deliverables

* Extended localStorage schema with `cookbooks[]`.
* Recipes updated to support membership in multiple cookbooks.
* Helper functions for common cookbook operations.
* Safeguards for data integrity when recipes/cookbooks are updated.
* Short markdown summary (`/docs/cookbook-data-model.md`) describing schema fields, relationships, and how to use helper functions.

Do not build UI in this phase — focus strictly on schema, localStorage, and data-handling logic.

---

## **Phase 3 – Cookbook Creation UX**

### Core Features
- [ ] Add **"+ New Cookbook" button** on the Cookbooks page
- [ ] Add **"Add to Cookbook"** option on recipe list/detail pages
- [ ] Enable search of existing cookbooks
- [ ] Allow inline creation of new cookbook
- [ ] Create modal form for new cookbook creation
  - [ ] Name field (required)
  - [ ] Subtitle field (optional)
  - [ ] Placeholder image upload (UI only)

### Enhancement 1: Conflict Resolution
- [ ] Enforce unique cookbook names
- [ ] Implement gentle conflict resolution (append "(2)", "(3)", etc.)
- [ ] Provide user feedback for naming conflicts

### Enhancement 2: Search Experience
- [ ] Enable search-as-you-type in "Add to Cookbook" flow
- [ ] Implement quick lookup functionality
- [ ] Add keyboard navigation support
- [ ] Include recent cookbooks in search results

### Technical Implementation
- [ ] Create `CookbookForm.tsx` component
- [ ] Build `AddToCookbookModal.tsx` component
- [ ] Implement search functionality with debouncing
- [ ] Add form validation and error handling


PROMPT
**Cursor Prompt — Phase 3: Cookbook Creation UX for “Cooks Books”**

Act as a senior SaaS engineer. Implement Phase 3 of the Cooks Books plan by building the **Cookbook Creation UX**. This should integrate with the Phase 2 data model and expose user-facing flows for creating and assigning cookbooks.

### Requirements

1. **Cookbooks Page – “+ New Cookbook”**

   * Add a **“+ New Cookbook” button** on the Cookbooks page.
   * Button opens a modal form with fields:

     * `name` (required, enforce uniqueness — if duplicate, append “(2)”)
     * `subtitle` (optional)
     * `image` (placeholder input for future upload, non-functional for now)
   * On submit, create a new cookbook in localStorage using the Phase 2 helper functions.

2. **Recipe Integration – “Add to Cookbook”**

   * On recipe list and detail pages, add an **“Add to Cookbook”** option.
   * Clicking opens a modal with:

     * Search-as-you-type for existing cookbooks.
     * Option to create a new cookbook inline (same modal as above, then add the recipe to it automatically).
   * On selection, add the recipe’s ID to the chosen cookbook(s) and update localStorage accordingly.
   * Recipes may belong to multiple cookbooks.

3. **Validation & Feedback**

   * Enforce unique cookbook names in modal form (show inline validation).
   * If a user tries to add a recipe already inside a cookbook, show it as “selected” but prevent duplication.
   * Provide clear success/failure toasts/messages after saving.

### Enhancements to Implement

* **Unique name validation**: Require distinct cookbook names or auto-resolve duplicates.
* **Search-as-you-type**: In the “Add to Cookbook” modal, dynamically filter existing cookbooks to make selection quick.

### Deliverables

* Modal for creating new cookbooks with validation.
* “+ New Cookbook” button on Cookbooks page.
* “Add to Cookbook” integration on recipe list/detail pages.
* LocalStorage updates wired to Phase 2 helper functions (`createCookbook`, `addRecipeToCookbook`, etc.).
* Short markdown summary listing new components, updated files, and testing instructions (create cookbook, add recipe, check persistence).

Do not yet build cookbook cards or detail pages — those come in Phase 4. Focus on **creation and assignment flows only**.


---

## **Phase 4 – Cookbook Cards & Pages**

### Core UI Components
- [ ] Build **Cookbook cards** in responsive grid
  - [ ] Cover image display
  - [ ] Name and subtitle
  - [ ] Recipe count indicator
  - [ ] Quick action buttons
- [ ] Auto-generate card cover image from first recipe
- [ ] Fallback to placeholder image
- [ ] Create dedicated cookbook detail pages
  - [ ] All recipes in collection
  - [ ] List/grid view toggle
  - [ ] Filtering capabilities
- [ ] Allow editing cookbook name/subtitle from detail page

### Enhancement 1: Cover Image Priority
- [ ] Implement fallback hierarchy: first recipe → placeholder
- [ ] Add image loading states
- [ ] Handle missing/broken images gracefully

### Enhancement 2: Interactive Elements
- [ ] Add quick-action buttons on hover (desktop)
  - [ ] "View" button
  - [ ] "Edit" button
  - [ ] "Add Recipe" button
- [ ] Implement touch-friendly actions for mobile

### Enhancement 3: Responsive Design
- [ ] Implement responsive grid scaling
  - [ ] 1-2 cards on mobile
  - [ ] 3-4 cards on desktop
- [ ] Ensure proper spacing and alignment
- [ ] Test across different screen sizes

### Technical Implementation
- [ ] Create `CookbookCard.tsx` component
- [ ] Build `CookbookDetailPage.tsx`
- [ ] Implement `CookbookGrid.tsx` with responsive layout
- [ ] Add image generation utilities

PROMPT
**Cursor Prompt — Phase 4: Cookbook Cards & Detail Pages for “Cooks Books”**

Act as a senior SaaS engineer. Implement Phase 4 of the Cooks Books plan by building **Cookbook Cards** and **Cookbook Detail Pages**. This work builds on the Phase 2 data model and Phase 3 creation flows.

### Requirements

1. **Cookbook Cards (Grid Layout)**

   * Display all cookbooks on the Cookbooks page in a **responsive grid**.
   * Each card should include:

     * Cover image (auto-generate from the first recipe image in the cookbook; fallback to placeholder if none).
     * Cookbook name and subtitle.
     * Recipe count (from the data model).
   * Cards should be responsive:

     * 1–2 per row on mobile,
     * 3–4 per row on desktop.

2. **Card Interactions**

   * Desktop: on hover, show quick-action buttons:

     * **View** → opens cookbook detail page.
     * **Edit** → opens modal to edit name/subtitle (update Phase 2 data model).
     * **Add Recipe** → opens the “Add to Cookbook” flow from Phase 3.
   * Mobile: show quick actions inline (beneath card content).

3. **Cookbook Detail Page**

   * Clicking a card opens a dedicated page for that cookbook.
   * Detail page includes:

     * Cover image (auto-generated or placeholder).
     * Name + subtitle (editable inline or via modal).
     * Grid/list view toggle of recipes belonging to this cookbook.
     * Recipe cards should behave consistently with the `/recipes` page (filters, responsive layout).

4. **Editing & Updates**

   * Allow editing cookbook name and subtitle from detail page (modal or inline).
   * Ensure updates propagate to localStorage and refresh the UI instantly.

### Enhancements to Implement

1. **Cover image fallback priority**: first recipe image → placeholder.
2. **Quick-action buttons on hover (desktop)** for View, Edit, Add Recipe.
3. **Responsive grid scaling** so card layout adapts smoothly between mobile and desktop.

### Deliverables

* Responsive grid of cookbook cards on Cookbooks page.
* Quick-action buttons integrated into cards (desktop hover, inline on mobile).
* Dedicated cookbook detail page showing recipes in that collection.
* Editing flows for cookbook name/subtitle.
* LocalStorage updates wired to Phase 2 schema and Phase 3 helpers.
* Short markdown summary listing new components, updated files, and testing steps (create cookbook, add recipes, view cards, open detail page, edit cookbook).

Do not implement homepage integration yet — that will be part of Phase 5. Focus only on the **Cookbooks page cards and detail views**.


---

## **Phase 5 – Homepage & Navigation Integration**

### Core Homepage Structure
- [ ] On `/cooksbooks` homepage, show **All Recipes** and **Cookbooks** together
- [ ] Add **Cookbooks** as dedicated nav/hamburger entry
- [ ] Create unified landing experience

### Enhancement 1: Tabbed Interface
- [ ] Structure homepage with tabs for **All Recipes** and **Cookbooks**
- [ ] Implement clean visual separation
- [ ] Add smooth transitions between tabs
- [ ] Maintain state across tab switches

### Enhancement 2: Empty States
- [ ] Show empty-state illustrations when no cookbooks exist
- [ ] Add encouraging messages ("Start your first cookbook!")
- [ ] Provide clear call-to-action buttons
- [ ] Include helpful tips and guidance

### Enhancement 3: Mobile Navigation
- [ ] Add expandable Cookbooks list under "Cookbooks" parent
- [ ] Implement collapsible submenu
- [ ] Add visual indicators for expanded/collapsed state
- [ ] Ensure smooth animations

### Technical Implementation
- [ ] Create `CooksBooksHomePage.tsx`
- [ ] Implement tabbed interface component
- [ ] Build empty state components
- [ ] Update mobile navigation structure

**Cursor Prompt — Phase 5: Homepage & Navigation Integration for “Cooks Books”**

Act as a senior SaaS engineer. Implement Phase 5 of the Cooks Books plan by integrating **Cookbooks** into the homepage and navigation, completing the core cookbook feature flow.

### Requirements

1. **Homepage Integration**

   * Update the `/cooksbooks` homepage to include both **All Recipes** and **Cookbooks**.
   * Structure the page with **tabs** (or a toggle):

     * Tab 1: **All Recipes** (current recipe list view).
     * Tab 2: **Cookbooks** (grid of cookbook cards from Phase 4).
   * Ensure switching tabs is smooth and state is preserved (e.g., if filters are applied in recipes).

2. **Empty State UX**

   * When no cookbooks exist, show an **empty-state illustration** and friendly message (e.g., *“Start your first cookbook to organize recipes into collections!”*).
   * Include a clear **“+ New Cookbook”** button in this state.

3. **Navigation Updates**

   * Add **Cookbooks** as a dedicated nav item in the top navigation bar and in the hamburger drawer.
   * In the **mobile hamburger menu**, make Cookbooks expandable to list each created cookbook as a sub-item.

     * Clicking a sub-item opens that cookbook’s detail page.
     * Keep the “Cookbooks” parent item clickable to return to the main Cookbooks grid.

### Enhancements to Implement

1. **Featured section layout**: Use tabs on homepage for clean split between All Recipes and Cookbooks.
2. **Empty state illustrations/messages**: Friendly onboarding when no cookbooks exist.
3. **Expandable Cookbooks in hamburger nav**: Show child items for direct access to individual cookbooks.

### Deliverables

* Updated `/cooksbooks` homepage with tabbed layout (All Recipes & Cookbooks).
* Empty state illustration/message with CTA button for creating first cookbook.
* Updated nav bar and hamburger menu with Cookbooks entry; expandable list of cookbooks in mobile nav.
* Short markdown summary listing new/updated components, routes tested, and how to validate (tabs switch, empty state shows, nav expands, links work).

Do not build advanced features like sharing/export yet — keep this phase focused on homepage integration and navigation polish.

---

## **Technical Considerations**

### Data Migration
- [ ] Plan for existing user data migration
- [ ] Create backup and restore functionality
- [ ] Test migration with various data scenarios

### Performance
- [ ] Optimize cookbook loading and rendering
- [ ] Implement lazy loading for large collections
- [ ] Cache frequently accessed data

### Accessibility
- [ ] Ensure all new components are keyboard navigable
- [ ] Add proper ARIA labels and descriptions
- [ ] Test with screen readers

### Testing
- [ ] Unit tests for all new components
- [ ] Integration tests for data flow
- [ ] End-to-end tests for user workflows

---

## **Success Metrics**

### User Engagement
- [ ] Number of cookbooks created per user
- [ ] Average recipes per cookbook
- [ ] Time spent on cookbook pages

### Technical Performance
- [ ] Page load times for cookbook pages
- [ ] Search response times
- [ ] Mobile responsiveness scores

### User Experience
- [ ] User feedback on new features
- [ ] Navigation usage patterns
- [ ] Error rates and user support requests

---

## **Future Enhancements**

### Advanced Features
- [ ] Cookbook sharing and collaboration
- [ ] Recipe import from cookbooks
- [ ] Cookbook templates and themes
- [ ] Advanced search and filtering

### Integration
- [ ] Export cookbooks to PDF
- [ ] Print-friendly cookbook layouts
- [ ] Social sharing of cookbooks
- [ ] Integration with external recipe sources

---

*This document will be updated as the implementation progresses and new requirements are identified.*
