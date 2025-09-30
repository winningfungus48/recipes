# GitHub Pages Hosting & Deployment Guide

## Overview

This project is deployed to GitHub Pages at: **https://winningfungus48.github.io/recipes/**

The deployment uses a **subpath structure** (`/recipes/`) rather than root domain deployment.

## Architecture

### Project Structure
```
recipes/
├── recipe-app/          # React app source code
├── dist/                # Build output (generated)
├── assets/              # Static assets (copied from dist/)
├── index.html           # Main entry point
├── 404.html             # SPA fallback
├── .nojekyll            # Disable Jekyll processing
└── .github/workflows/   # GitHub Actions
```

### Key Configuration Files

| File | Purpose | Configuration |
|------|---------|---------------|
| `recipe-app/vite.config.ts` | Vite build config | `base: '/recipes/'` |
| `recipe-app/src/App.tsx` | React Router | `basename="/recipes"` |
| `.github/workflows/deploy.yml` | CI/CD pipeline | Automated build & deploy |
| `scripts/verify-gh-pages.mjs` | Post-deploy verification | Asset URL validation |

## Deployment Process

### Automated Deployment (Recommended)

1. **Push to main branch** - Triggers GitHub Action
2. **Build phase** - Installs deps, builds React app
3. **Deploy phase** - Uploads `dist/` to GitHub Pages
4. **Verify phase** - Validates all asset URLs are accessible

### Manual Deployment (Emergency)

```bash
# 1. Build the project
cd recipe-app
npm run build

# 2. Copy build output to root
cd ..
copy dist\index.html index.html
copy dist\index.html 404.html
xcopy dist\assets assets\ /E /Y

# 3. Commit and push
git add .
git commit -m "deploy: manual deployment"
git push origin main
```

## Adding New Routes

### 1. Add Route to React Router
```tsx
// In recipe-app/src/App.tsx
<Route path="/new-route" element={<NewComponent />} />
```

### 2. Add Navigation Links
```tsx
// Desktop navigation (Header.tsx)
<Link to="/new-route">New Route</Link>

// Mobile navigation (MobileNavigationDrawer.tsx)
<Link to="/new-route" onClick={onClose}>New Route</Link>
```

### 3. Deploy Changes
- Push to main branch
- GitHub Action handles the rest automatically

## Troubleshooting

### Common Issues

#### 404 Errors for Assets
**Symptoms:** Console shows 404 errors for JS/CSS files
**Cause:** Vite base path mismatch
**Fix:** Ensure `vite.config.ts` has `base: '/recipes/'`

#### Routes Not Working
**Symptoms:** Direct URL access returns 404
**Cause:** Missing SPA fallback
**Fix:** Ensure `404.html` exists and mirrors `index.html`

#### Build Failures
**Symptoms:** GitHub Action fails during build
**Cause:** Dependency or build configuration issues
**Fix:** Check `recipe-app/package.json` and `vite.config.ts`

### Verification

Run the verification script locally:
```bash
node scripts/verify-gh-pages.mjs
```

Or check GitHub Actions logs for verification results.

## Configuration Rules

### ✅ DO
- Keep `base: '/recipes/'` in `vite.config.ts`
- Keep `basename="/recipes"` in Router
- Use relative paths in navigation
- Test locally before pushing
- Run verification script after changes

### ❌ DON'T
- Change Vite base path without updating Router
- Deploy manually unless necessary
- Remove `.nojekyll` file
- Use absolute paths in navigation
- Skip verification after deployment

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `SITE_URL` | Base URL for verification | `https://winningfungus48.github.io/recipes/` |

## Monitoring

- **GitHub Actions**: Check deployment status
- **Browser Console**: Monitor for 404 errors
- **Verification Script**: Automated asset validation
- **GitHub Pages**: View deployment logs

## Emergency Procedures

### Rollback Deployment
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

### Force Rebuild
```bash
# Trigger manual workflow run via GitHub UI
# Or push empty commit
git commit --allow-empty -m "force rebuild"
git push origin main
```

### Clear Cache
- GitHub Pages cache clears automatically
- Browser cache: Hard refresh (Ctrl+F5)
- CDN cache: Wait 5-10 minutes

## Support

For deployment issues:
1. Check GitHub Actions logs
2. Run verification script
3. Review this documentation
4. Check browser console for errors
