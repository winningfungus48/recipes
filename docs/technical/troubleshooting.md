# 🔧 Troubleshooting Guide

This document provides comprehensive troubleshooting information, common issues, solutions, and recovery procedures for the recipe app.

---

## 🚨 **Critical Issues & Solutions**

### **Issue #1: Server Connection Failures (RESOLVED)**
**Problem**: `npm run dev` fails with `ENOENT: no such file or directory, open 'C:\Dev\recipes\package.json'`

**Root Cause**: Terminal running from wrong directory (`C:\Dev\recipes` instead of `C:\Dev\recipes\recipe-app`)

**Solution**:
```powershell
# Always ensure correct directory
cd C:\Dev\recipes\recipe-app
pwd  # Verify: C:\Dev\recipes\recipe-app

# Use new stable commands
npm run dev:clean    # Clean port and start
npm run dev:restart  # Clean port and restart
```

**Prevention**: Always check working directory before running npm commands

### **Issue #1.1: Vite Stability Issues (RESOLVED)**
**Problem**: Frequent localhost crashes and connection drops

**Root Cause**: Vite 4.x incompatibility with React 18.3.1

**Solution**: Upgraded to Vite 5.4.20 with stability optimizations
- Added HMR overlay for better error reporting
- Optimized dependency pre-bundling
- Manual chunk splitting for better performance
- Strict port handling

---

### **Issue #2: Data Not Loading (IMPROVED)**
**Problem**: App shows "0 recipes" despite having imported data

**Root Cause**: Mismatch between file storage (`localStorage.json`) and browser storage (`localStorage`)

**Solution**:
1. **Use improved HTML tool**: Open `load-test-recipes.html` in browser
2. **Click "Load 10 Test Recipes"** button (with validation)
3. **Click "Check Current Recipe Count"** to verify
4. **Navigate to recipes page** to see data

**Files Created**:
- `load-test-recipes.html` - Enhanced browser-based data injection with validation
- `inject-recipes.html` - Legacy injection tool
- `load-recipes-to-browser.js` - Console-based injection script

**Improvements**:
- Comprehensive validation with warnings vs errors
- Data integrity verification
- Better error reporting and recovery

---

### **Issue #3: React Router Warnings**
**Problem**: Console shows React Router future flag warnings

**Root Cause**: React Router v6 warnings about v7 compatibility

**Status**: **IGNORE** - These are cosmetic warnings only, don't affect functionality

**Note**: Future flags caused server crashes, so warnings are acceptable

---

## 🔧 **WORKING CONFIGURATION**

### **Server Setup**
- **Directory**: `C:\Dev\recipes\recipe-app`
- **Command**: `npm run dev`
- **Port**: 3000
- **URL**: `http://localhost:3000/recipes`

### **Dependencies**
- **React**: 18.3.1
- **React Router**: 6.30.1
- **Vite**: 4.5.14
- **TypeScript**: 5.9.2

### **Data Storage**
- **App Storage**: Browser localStorage (key: `myRecipesData`)
- **Import Files**: `localStorage.json` (file-based, needs injection)
- **Injection Tool**: `inject-recipes.html`

---

## 🚀 **QUICK START COMMANDS**

### **Start Server**
```powershell
cd C:\Dev\recipes\recipe-app
npm run dev
```

### **Load Recipes**
1. Open `file:///C:/Dev/recipes/recipe-app/inject-recipes.html`
2. Click "Load 12 Recipes into App"
3. Visit `http://localhost:3000/recipes`

### **Check Server Status**
```powershell
netstat -ano | findstr "LISTENING.*:3000"
```

### **Kill All Processes**
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*npm*"} | Stop-Process -Force
```

---

## 📋 **TROUBLESHOOTING CHECKLIST**

### **Server Won't Start**
- [ ] Check working directory: `pwd` should show `C:\Dev\recipes\recipe-app`
- [ ] Verify package.json exists: `ls package.json`
- [ ] Check for TypeScript errors: `npx tsc --noEmit`
- [ ] Kill existing processes and restart

### **App Shows 0 Recipes**
- [ ] Verify server is running on port 3000
- [ ] Check browser console for errors
- [ ] Use injection tool to load data
- [ ] Verify localStorage has data: `localStorage.getItem('myRecipesData')`

### **React Router Warnings**
- [ ] **IGNORE** - These are cosmetic only
- [ ] Don't add future flags (causes crashes)
- [ ] Focus on functionality, not warnings

---

## 🎯 **CURRENT STATUS (Last Updated: 2025-09-15)**

### **Working Components**
- ✅ Server starts successfully
- ✅ App loads without errors
- ✅ All routes functional
- ✅ Data injection tools ready

### **Known Issues**
- ⚠️ React Router warnings (cosmetic only)
- ⚠️ Data needs manual injection (by design)

### **Next Steps**
- Load recipes using injection tool
- Test all app functionality
- Prepare for Phase 3 development

---

## 📁 **KEY FILES**

### **Configuration**
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Server configuration
- `tsconfig.json` - TypeScript settings

### **Data Management**
- `localStorage.json` - Imported recipe data
- `inject-recipes.html` - Data injection tool
- `bulk-import.js` - CSV import script

### **Troubleshooting**
- `troubleshooting.md` - This file
- `import-errors.json` - Import error reports

---

## 🔄 **RECOVERY PROCEDURES**

### **Complete Reset**
1. Kill all processes
2. Navigate to correct directory
3. Start server
4. Load data via injection tool

### **Data Recovery**
1. Check `localStorage.json` exists
2. Use `inject-recipes.html` to reload
3. Verify in browser console

### **Server Recovery**
1. Check directory: `cd C:\Dev\recipes\recipe-app`
2. Kill processes: `Get-Process | Where-Object...`
3. Restart: `npm run dev`

---

*This log should be updated whenever new issues are discovered or resolved.*
