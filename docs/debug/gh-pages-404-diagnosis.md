# GitHub Pages 404 Diagnosis Report

**Date:** 2025-01-29  
**Site:** https://winningfungus48.github.io/recipes/  
**Issue:** 404 errors for all asset files (JS/CSS)

## 1. What I Checked and Results

| Check | Result | Evidence |
|-------|--------|----------|
| GitHub Pages source branch | ✅ main | `git branch -a` shows only main branch |
| GitHub Pages subpath | ✅ /recipes/ | URL structure confirms subpath |
| .nojekyll in published root | ✅ YES | `dir | findstr nojekyll` shows file exists |
| Asset URLs in deployed index.html | ✅ /assets/... | `temp_index.html` shows `/assets/index-2ZrdR9d3.js` |
| Asset files exist in published branch | ✅ YES | `Invoke-WebRequest` returns 200 OK for assets |
| URLs rooted as /assets/ vs /recipes/assets/ | ✅ /assets/ | Deployed HTML shows `/assets/` paths |
| Vite base configuration | ❌ MISMATCH | `vite.config.ts` has `base: '/'` but site is at `/recipes/` |
| Router basename configuration | ❌ MISSING | `App.tsx` has no `basename="/recipes"` |
| Deploy workflow exists | ❌ NO | No `.github/workflows/` directory found |
| Manual copying of dist/assets | ✅ YES | Assets manually copied to root `assets/` directory |
| SPA fallback (404.html) | ✅ YES | `404.html` exists and mirrors `index.html` |
| Service worker | ✅ NO | No service worker files found |

## 2. Root Cause Analysis

**HIGHEST CONFIDENCE ROOT CAUSE:**
**Vite base path mismatch** - Vite is configured with `base: '/'` but the site is deployed at `/recipes/` subpath. This causes Vite to generate asset paths as `/assets/...` when they should be `/recipes/assets/...` for GitHub Pages subpath deployment.

**Rationale:** The deployed HTML shows `/assets/` paths, but GitHub Pages serves from `/recipes/` subpath, so the browser requests `https://winningfungus48.github.io/recipes/assets/...` which resolves to `https://winningfungus48.github.io/assets/...` (404).

## 3. Alternative Hypotheses Ruled Out

1. **Jekyll processing interference** - Ruled out: `.nojekyll` exists and assets return 200 OK when accessed directly
2. **Missing asset files** - Ruled out: All referenced files exist and return 200 OK
3. **Service worker caching** - Ruled out: No service worker files found

## 4. Minimal Remediation Plan

### Phase 1: Fix Current 404s
1. **Update `recipe-app/vite.config.ts`**: Change `base: '/'` to `base: '/recipes/'`
2. **Update `recipe-app/src/App.tsx`**: Add `basename="/recipes"` to `<Router>`
3. **Rebuild and redeploy**: Run `npm run build` and copy `dist/` contents to root

### Phase 2: Harden Deploy Process
1. **Create GitHub Action** (`.github/workflows/deploy.yml`): Automated build and deploy
2. **Create verification script** (`scripts/verify-gh-pages.mjs`): Post-deploy asset validation
3. **Create deployment docs** (`docs/hosting-deploy.md`): Rules and procedures

### Phase 3: Guardrails
- Vite: `base: '/recipes/'` (subpath deployment)
- Router: `BrowserRouter` with `basename="/recipes"` (consistent with Vite)
- Deploy: Single GitHub Action, no manual copying
- Verification: Automated asset URL testing

**Expected Outcome:** All asset 404s resolved, automated deployment, future-proof configuration.
