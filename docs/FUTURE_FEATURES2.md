# Future Features

**Status**: 🔄 **ONGOING**
**Type**: Feature roadmap
**Focus**: Vetted, prioritized list of features — updated March 2026

---

## 🎯 Overview

This document is the living feature roadmap for the Recipe App (future: "Cooks Books"). Features are organized by priority tier, not category, so the top of the document always reflects what to work on next.

### Ground rules
- Mobile-first is not a phase — it is the default requirement for every component going forward
- AI has changed the feasibility of several features that were previously "hard" or "far future" — these have been re-evaluated and repositioned accordingly
- Features gated on a backend are clearly marked — do not attempt them before a backend is chosen
- Community/social features are explicitly deferred until Phase 4 infrastructure exists

---

## 📊 Current Phase Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 — Ingredient model fix | ⚠️ Verify | Legacy string ingredients may still exist in localStorage — must resolve before AI scaling |
| Phase 1 — Core MVP | ✅ Complete | Manual entry, search, filter, recipe CRUD |
| Phase 2 — Smart Imports | ✅ Complete | Bulk CSV/JSON import, tag management, advanced filters, favorites |
| Mobile-first revamp | 🔥 Current | Cross-cutting — applies to all existing and new UI |
| Phase 3 — AI Features | 🔜 Next | Smart scaling, substitutions, mid-cook rescue |
| Phase 4 — Cookbooks & Meal Planning | ⬜ Planned | Collections, meal plans, shopping lists |
| Phase 5 — Community | ⬜ Future | Requires backend — do not start until Phase 4 is solid |

---

## 🔥 Tier 1 — Do Now (Mobile Revamp + AI Foundation)

These are the current focus. Nothing from a lower tier should be started until these are in good shape.

### Mobile-First UI Revamp

**This is the top priority.** Every screen needs to be audited and rebuilt with mobile as the primary context.

Checklist that applies to every component:
- Minimum 44px touch targets on all interactive elements
- No interactions that depend on hover state
- Bottom-sheet / drawer patterns instead of dropdowns on small screens
- Test at 375px viewport width (iPhone SE) — this is the constraint to design for
- Responsive grid: 1-col on mobile → 2-col on tablet → 3-col on desktop
- Sticky action bars instead of floating buttons
- Font sizes readable without zooming (minimum 16px body text on mobile)
- Inputs that don't cause layout shift when the keyboard appears

Specific screens to prioritize in order:
1. **Recipe detail view** — this is the screen used most in the kitchen. Ingredients must be readable at arm's length, steps should be large and tappable, section headers should stay visible while scrolling.
2. **Recipe list / home** — card grid needs to reflow gracefully. Filters should collapse into a bottom drawer on mobile.
3. **Recipe form (add/edit)** — forms are notoriously bad on mobile. Each field needs proper input types, large tap targets, and no keyboard-covering issues.
4. **Navigation** — consider a bottom tab bar on mobile instead of a top nav, which is thumb-unfriendly.
5. **Import flows** — URL and bulk import pages.
6. **Tag/category management page** — currently lowest priority for mobile since it's an admin-style screen.

### Mobile responsiveness audit (complete — all app routes)

**Method:** Static review of every route in `recipe-app/src/App.tsx` plus shared components, against the Tier 1 checklist, March 2026. **Device testing** on iOS Safari and Chrome Android is still recommended for keyboard, safe-area, and real tap accuracy.

**Scope:** Landing, recipe list/detail/edit, new-recipe hub, manual add, import URL, bulk import, manage, meal plan list/create-edit/detail, shopping list list/detail. *Edit recipe reuses `RecipeForm` — same findings as manual add (row 3).*

#### Cross-cutting checklist

| Criterion | Status | Notes |
|-----------|--------|--------|
| 44px minimum touch targets | **Gap** | `EllipsisMenu`, favorite heart in `MobileHeader`, `StarRating` controls, `FilterPanel` “Filters” toggle, and `Header` menu button use small padding with ~16px icons — below 44×44px. Drawer links (`py-3 px-3`) are closer to the target. |
| No hover-only primary actions | **Mostly OK** | Tap/click paths exist for core tasks; `hover:` is used for emphasis, not as the only affordance. |
| Bottom sheet / drawer vs dropdowns on small screens | **Gap** | `FilterPanel` uses inline expand/collapse plus native `<select>` elements, not a bottom sheet. `EllipsisMenu` is a positioned dropdown, not a sheet. |
| 375px viewport | **OK** | Primary layouts stack to one column (`grid-cols-1`, `lg:` / `md:` for wider breakpoints). |
| Grid 1 → 2 → 3 | **Partial** | Recipe list grid: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3` matches the roadmap. Recipe detail uses `lg:grid-cols-2` for ingredients vs instructions (two-column split only at large widths). |
| Sticky action bars vs floating buttons | **Gap** | `RecipeDetail` uses a **floating** `fixed bottom-4 right-4` `EllipsisMenu`, which conflicts with the preference for sticky action bars. |
| 16px minimum body text on mobile | **Partial** | `input-field` and body inherit browser base (typically 16px). Many labels and helpers use `text-sm` (14px), which is acceptable for labels; avoid `text-sm` for long reading copy where readability matters. |
| Keyboard / layout shift | **Not addressed** | No systematic handling (e.g. scroll-into-view on focus, `scroll-padding`, safe-area insets) for long forms when the mobile keyboard opens. |

#### Screen-by-screen (Tier 1 priority order)

| # | Screen | Verdict | Key findings |
|---|--------|---------|----------------|
| 1 | **Recipe detail** (`RecipeDetail.tsx`, `RecipeDetailPage.tsx`) | **Needs work** | Mobile `MobileHeader` uses `StarRating` with `interactive={false}` — rating cannot be changed on mobile in header. Tags are `hidden md:flex`, so mobile users do not see tags. Ingredients/steps use default text sizing; section headers are not sticky while scrolling. Back link is not padded to 44px. Duplicate edit/delete affordance: header ellipsis plus floating FAB. |
| 2 | **Recipe list / home** (`RecipeListPage.tsx`, `LandingPage.tsx`, `RecipeCard.tsx`) | **Partial** | Grid/list reflow is solid. Filters remain accordion + `<select>`, not a bottom drawer. `RecipeCard` list mode reuses small heart / star targets. `LayoutToggle` is close to 44px height but not explicit. Landing “popular search” chips use `py-1` — small tap targets. |
| 3 | **Recipe form** (`RecipeForm.tsx`, add/edit pages) | **Partial** | Shared `input-field` gives reasonable control height. Very long form (sections, many fields) with no sticky save/cancel bar; keyboard covering lower fields not explicitly mitigated. |
| 4 | **Navigation** (`Header.tsx`, `NavigationDrawer.tsx`) | **Partial** | Universal hamburger opens a right-edge drawer with adequately tall rows. No bottom tab bar (roadmap suggests considering one). Desktop nav hidden below `md` — OK, but thumb reach still favors top bar + menu. |
| 5 | **Import flows** (`ImportRecipePage.tsx`, `BulkImportPage.tsx`) | **Partial** | URL + “Import” button sit in a single horizontal `flex` row — cramped at 375px; should stack (`flex-col` on small screens) with full-width primary action. Bulk import preview tables will require horizontal scroll on phones (acceptable if visually obvious). |
| 6 | **Manage** (`ManagePage.tsx`) | **Gap (acceptable last)** | Dense tabs, lists, and inline actions — expect small targets and horizontal scroll; aligns with “lowest priority” until core flows improve. |
| 7 | **Meal plans list** (`MealPlanListPage.tsx`) | **Partial** | Same pattern as recipes: `flex-col` search row, inline filter expand, native `<select>` for sort — not a bottom sheet. Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` matches 1→2→3 intent. **Bug risk:** passes `viewMode` as a plain string into `LayoutToggle`, which expects an object with a `type` field — toggle highlighting/state is likely wrong at runtime; `gridIcon` / `listIcon` props are ignored by `LayoutToggle.tsx`. |
| 8 | **Meal plan cards** (`MealPlanCard.tsx`) | **Partial** | List mode: quick actions use `text-xs` / `py-1.5` — under 44px height. Favorite heart `p-0.5` in list mode; grid mode favorite uses `p-2` (closer). Card `hover:shadow-md` only. |
| 9 | **Meal plan create / edit** (`CreateMealPlanPage.tsx`) | **Partial** | Multi-step wizard with `Header`; long vertical flow. No `ResponsivePage` wrapper — `ResponsivePage` button min-height rules do not apply. Expect keyboard overlap on date/entry steps; no sticky save bar called out in markup review. |
| 10 | **Meal plan detail** (`MealPlanDetailPage.tsx`, `MealPlanDetail.tsx`) | **Partial** | Standard header + content; relies on shared patterns. Any embedded forms/modals should be checked for sheet vs dropdown on phone (not fully expanded in this pass beyond page shell). |
| 11 | **Shopping lists list** (`ShoppingListListPage.tsx`) | **Partial** | Mirrors meal plan list: inline filters, checkboxes, `<select>` sort, same grid breakpoint pattern. **Same `LayoutToggle` / `viewMode` shape bug** as row 7. |
| 12 | **Shopping list detail** (`ShoppingListDetailPage.tsx`, `ShoppingListItem.tsx`) | **Needs work** | Primary task is checking items off in store; checkbox control is **20×20px** (`w-5 h-5`) — below 44px. Edit/delete/save row actions use `p-1` + 16px icons. Dense toolbar (`flex` rows of icon buttons) likely thumb-unfriendly at 375px. Back link not sized to 44px. |
| 13 | **New recipe hub** (`NewRecipePage.tsx`, `Modal.tsx`, `OptionCard.tsx`) | **Partial** | Hub uses `ResponsivePage` + `Header` + option cards opening **center modals** (`Modal.tsx`: `items-center`, `max-w-2xl` etc.). Modals are usable on mobile but not bottom-sheet native; tall modals (full recipe form) need scroll inside dialog — verify scroll + keyboard. Close control: check `Modal` header hit target. |

#### Implementation note — `ResponsivePage`

`ResponsivePage.tsx` embeds a `<style jsx>` block with nested CSS. The app does not depend on `styled-jsx` in `package.json`; confirm in a real browser whether those mobile rules apply. If not, move equivalent rules into `index.css` or Tailwind utilities so 48px button rules are reliable.

#### Suggested fix order (next implementation pass)

1. **Fix `LayoutToggle` usage** on `MealPlanListPage` and `ShoppingListListPage`: pass an object shaped like `ViewMode` (e.g. wrap string state as `{ type: viewMode }`), or extend `LayoutToggle` to accept a string; wire optional custom icons if desired.  
2. Recipe detail: remove redundant floating FAB or merge with a single sticky/bar pattern; enlarge back + overflow actions; show tags on mobile; larger type for ingredients/steps; restore interactive rating on mobile or move it to an obvious control.  
3. Global: enforce `min-h-[44px] min-w-[44px]` (or `mobile-touch-target`) on icon-only and compact controls (`EllipsisMenu`, hearts, filter toggles, menu button, **shopping list checkboxes**).  
4. Filters (recipes, meal plans, shopping lists): mobile bottom sheet (or full-height slide-over) replacing inline expand + heavy `<select>` where feasible.  
5. Import URL row: stack layout on small breakpoints.  
6. Long forms (recipe, meal plan wizard, modal forms): sticky footer with primary save; focus management when keyboard opens.  
7. Prototype bottom tab bar for primary destinations when recipe flows are stable.

### Visual Revamp

While doing the mobile pass, refresh the visual design:
- Revisit spacing, type scale, and color application across the app
- Ensure the kitchen-inspired palette (sage green, wood brown, off-white) is applied consistently
- Add dark mode support — `prefers-color-scheme` by default, Tailwind `dark:` classes throughout. Critical for low-light kitchen use.
- Recipe cards: more visual hierarchy, better use of the image slot, cleaner metadata display

### Cook Mode

A dedicated, distraction-free view for active cooking — separate from the regular recipe detail view:
- Large text, maximum contrast
- Step-by-step progression with a "Next step" tap target that fills the bottom of the screen
- Screen stays awake (Wake Lock API)
- Timers auto-detected from instruction text and surfaced as tappable chips
- No editing controls visible — cook mode is read-only

### Phase 0 Verification — Ingredient Model

Confirm whether localStorage data still contains string ingredients. If yes:
- Run the migration function to parse legacy strings into structured `{ amount, unit, name, notes }` objects on app load
- This is a prerequisite for AI scaling to work correctly
- Add a `version` field to the localStorage schema if not already present

---

## 📌 Tier 2 — Soon (Phase 3 AI Features)

Build these after the mobile revamp is solid. All three live on the recipe detail view.

### AI Smart Scaling

- User adjusts serving count via a +/- control on the recipe detail view
- All ingredient amounts recalculate mathematically based on the ratio to the original servings
- Claude API call flags ingredients that don't scale linearly — baking powder, salt, yeast, eggs, leavening agents — with a short inline note explaining why
- Non-linear warnings appear next to the affected ingredient, not in a modal
- Requires structured Ingredient objects — Phase 0 migration must be complete first

### AI Ingredient Substitution

- User taps any ingredient in the recipe
- Claude receives the full ingredient object + the complete recipe context + cooking method
- Returns 2-3 substitutes with a note on how each affects the dish (texture, flavor, bake time)
- Displayed in a slide-up bottom sheet on mobile, a side panel on desktop
- Gracefully disabled if the API is unavailable

### AI Mid-Cook Rescue

- "Help, I'm stuck" button on the recipe detail / cook mode view
- User types what's going wrong ("my sauce split", "the dough is too wet", "it's not browning")
- Claude receives the full recipe as context plus the user's description
- Returns practical, specific troubleshooting steps — not generic advice
- Displayed in a conversational panel; user can follow up with another message

### AI URL Import (replaces mock scraper)

- Replace the existing mock URL scraper with Claude-powered extraction
- User pastes any recipe URL → Claude reads the page content and structures the recipe
- Works across any site, handles varying formats, no site-specific selectors to maintain
- Show a preview/edit screen before saving so the user can correct any mistakes
- Falls back gracefully if the URL is paywalled or inaccessible

### AI Photo / Screenshot Import

- User uploads a photo of a recipe — cookbook page, handwritten card, magazine spread, screenshot
- Claude's vision capability extracts and structures the recipe
- Same preview/edit flow as URL import before saving
- Covers the manual "screenshot from TikTok" use case without needing any TikTok-specific infrastructure

---

## 🗓 Tier 3 — Later (Phase 4: Cookbooks & Meal Planning)

Build these once Phase 3 AI features are stable. All are LocalStorage-viable — no backend required yet.

### Named Cookbooks (Collections)

- Users create named cookbooks with optional description and cover image
- Add/remove recipes from cookbooks
- Cookbook list view with cover image, recipe count, and last-updated date
- Cover image upload functional (currently placeholder)
- Export cookbook as PDF or plain text list
- Cookbooks stored in LocalStorage under a separate key from recipes

### Weekly Meal Planner

- Assign recipes to days of the week
- Calendar-style view, mobile-friendly (scrollable week)
- Multiple recipes per day (breakfast, lunch, dinner slots or freeform)
- Meal plans stored and retrievable by name/date

### Auto-Generated Shopping List

- Generated from a selected meal plan
- Aggregates all ingredients across all recipes in the plan
- Deduplicates and combines quantities where units match (e.g., 1 cup + 2 cups flour → 3 cups flour)
- Groups by category: produce, dairy, pantry, meat, other
- Check off items as purchased
- Copy to clipboard or share as plain text

### AI Meal Planning Suggestions

- Claude suggests a week of meals from the user's cookbook
- Takes into account variety, dietary preferences (pulled from tags), and day-of-week context
- User can accept suggestions, swap individual days, or regenerate
- Output feeds directly into the meal planner

### AI Nutritional Estimates

- On-demand per recipe, not automatically calculated on save
- Claude estimates approximate macros per serving based on ingredients
- Clearly labeled as estimates, not medical-grade data
- Stored optionally on the recipe — user opts in

### Built-in Cooking Timers

- Timers auto-detected from instruction text ("bake for 25 minutes", "simmer for 10 minutes")
- Surfaced as tappable chips in cook mode
- Multiple concurrent timers supported
- Uses browser Notification API when timer completes (with permission)

### Dark Mode

- `prefers-color-scheme` respected by default
- Manual toggle available in settings
- Tailwind `dark:` utility classes throughout
- Particularly important for kitchen use at night

### Export / Print

- Clean printable recipe card layout (single recipe)
- Print-optimized CSS: no nav, no buttons, ingredient list and instructions side by side where space allows
- Export entire cookbook to PDF via browser print
- Export recipes as JSON for backup

---

## 🌐 Tier 4 — TikTok & Social Import (Medium Priority)

TikTok import is genuinely feasible with modern AI but is not the current focus. Build after the mobile revamp and core AI features are stable.

### TikTok Recipe Import — Implementation Plan

Three extraction vectors, in order of priority:

**Vector 1 — Caption / description (do first)**
- User pastes a TikTok video URL
- App calls a third-party metadata API (Supadata, ScrapeCreators, or similar) to fetch the video's caption/description text
- Send caption text to Claude with a structured extraction prompt
- Claude returns a recipe JSON mapped to the Recipe data model
- Show preview/edit screen before saving
- No backend required — works entirely client-side via a proxied REST call
- Coverage: ~50-60% of recipe TikToks have enough detail in the caption

**Vector 2 — Audio transcript (add when backend exists)**
- Use a transcript API (Supadata's TikTok Transcript API returns spoken-word text from a URL without needing to download the video file)
- Send transcript to Claude with the same extraction prompt
- Higher coverage than captions — spoken cooking videos almost always contain the full recipe
- Requires a backend or server function to proxy the API call
- Build after caption extraction is live and a backend is chosen

**Vector 3 — Screen / OCR (do not build as automation)**
- Automated frame-by-frame OCR of TikTok video is unreliable: text is obscured by hands, motion, and platform UI overlays
- The "upload a screenshot manually" path (photo import, Tier 2) already covers the valid use case here
- Do not invest in automated screen extraction

**UX pattern**: single input field for the TikTok URL → app tries caption first, falls back to audio transcript if available → shows Claude's parsed recipe for review → user saves.

**Note on Terms of Service**: this approach uses public video metadata and auto-generated captions, not private user data. Use a reputable API provider that operates on public data only. For a personal single-user app this is low practical risk, but choose a provider accordingly.

### Other Social Import

- Instagram Reels: same pattern as TikTok — caption first, audio transcript as fallback
- YouTube Shorts: YouTube's auto-captions are very accessible via existing libraries
- Pinterest recipe links: URL import via Claude already handles most of these

---

## ⏳ Tier 5 — Future / Backend Required

These features are good ideas but require infrastructure decisions that haven't been made yet. Do not design around them until a backend is chosen.

### User Accounts & Authentication
- User registration, login, OAuth (Clerk or Supabase are the likely choices)
- User-specific recipe collections, settings, preferences
- Data migration from LocalStorage to user account on first login
- Minimal data collection approach — store only what's needed

### Cloud Sync & Backup
- Sync recipes across devices via user account
- Automatic cloud backup
- Data export (JSON, PDF, CSV) for portability
- Offline PWA functionality with sync-on-reconnect

### Cookbook Sharing
- Publish cookbooks publicly with a shareable link
- Browse community-published cookbooks
- Save other users' cookbooks to your collection
- Public and private cookbook settings

### Community Features *(requires backend + moderation strategy)*
- Community-contributed recipe browsing and filtering
- Recipe ratings and reviews
- User profiles
- Recipe attribution and licensing clarity

### App Rebranding — "Cooks Books"
- Tagline: "where cooks share their books"
- Update branding, logos, visual identity
- Update domain and marketing materials
- Low complexity when the time comes — defer until community features are closer

---

## ✂ Cut or Deprioritized

These features were in the original roadmap and have been consciously removed or deprioritized.

| Feature | Decision | Reason |
|---------|----------|--------|
| Audio recipe parsing (voice input) | Cut | Awkward UX even if technically possible. Not worth building. |
| Store integration & price comparison | Cut | API complexity, regional variation, maintenance burden. Not suited for a personal app. |
| Cook-with-me mode / live cooking | Cut | Requires realtime backend and complex UX. Nice idea, wrong stage. |
| React Native / native mobile apps | Defer indefinitely | A well-built PWA with offline support covers 90% of the use case. Build native only with a concrete reason. |
| Monetization (subscriptions, affiliate links, sponsored content) | Defer | Build after there is a meaningful user base and a backend to support it. |
| AES-256 LocalStorage encryption | Cut | Over-engineering for a personal single-user app with no PII. Standard HTTPS is sufficient. |
| Automated screen/OCR TikTok scraping | Cut | Too unreliable. Manual photo upload (photo import feature) covers the valid use case. |
| Social feed, following system, recipe contests | Defer to Phase 5 | Requires backend, moderation, trust & safety. Not ready. |

---

## 📐 Implementation Guidelines

### Mobile-first checklist (applies to every new component)
- Design at 375px first, then scale up
- 44px minimum touch targets
- No hover-only interactions
- Bottom sheets / drawers on mobile instead of dropdowns
- Test keyboard appearance on iOS Safari — it shrinks the viewport
- `font-size: 16px` minimum on inputs to prevent iOS auto-zoom
- Avoid fixed-position elements that conflict with the browser chrome on mobile

### AI integration rules
- All Claude API calls live in dedicated service files, never inside components
- Every AI feature must degrade gracefully if the API is unavailable — the app works fully without it
- Always pass full recipe context to Claude, not just the ingredient or question in isolation
- Use `claude-sonnet-4-20250514` for all AI features
- Keep API keys in environment variables, never hardcoded

### Data model rules
- Ingredients are always structured `{ amount, unit, name, notes? }` — never plain strings
- `servings` is required on every Recipe — it is the base for scaling
- LocalStorage key: `recipe-app-recipes` — maintain for continuity
- Include a `version` field in LocalStorage for migration support
- Use Context API for global state — no class components

### Feature prioritization criteria
- User impact: does it make the app noticeably better to use in the kitchen?
- Mobile fit: does it work well on a phone with one hand while cooking?
- Technical feasibility: can it be built without unresolved infrastructure decisions?
- Phase sequencing: does it depend on something earlier being complete?

---

## 📊 Status Legend

- 🔥 **Active** — being worked on now
- 🔜 **Next** — clearly sequenced, ready to start when current work is done
- ⬜ **Planned** — confirmed direction, not yet sequenced
- 💡 **Idea** — worth tracking, not yet committed
- ✂ **Cut** — consciously removed from the roadmap
- ⏳ **Deferred** — good idea, wrong time

---

*Last updated: March 2026*
*Status: 🔄 ONGOING*
