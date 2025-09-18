# Phase 3: AI Assistant Foundation

**Status**: 🔄 **PLANNED**  
**Duration**: AI integration phase  
**Focus**: AI-powered recipe extraction, summarization, and smart cleanup

---

## 🎯 **Phase Overview**

Phase 3 introduces AI-powered features to enhance recipe management with intelligent extraction, summarization, and smart cleanup capabilities. This phase focuses on making recipe import and management more intelligent and user-friendly.

### **Key Objectives**
- Screenshot upload with AI extraction
- Instruction summarization (TL;DR mode)
- Smart cleanup for URL imports
- Suggested tags based on content
- Enhanced data schema for AI features

---

## 📋 **Implementation Checklist**

### **Screenshot Upload with AI Extraction**
- [ ] **AI Upload Route** (`/upload/ai`)
  - [ ] Image upload functionality
  - [ ] AI service integration for recipe extraction
  - [ ] Extract: title, ingredients, instructions, cookTime, tags
  - [ ] Pre-filled recipe form with extracted values
  - [ ] User confirmation/editing before saving

### **Instruction Summarization**
- [ ] **TL;DR Mode**
  - [ ] "Summarize Instructions" button on recipe detail page
  - [ ] AI-generated 2-3 sentence overview
  - [ ] Collapsible "Quick Summary" section
  - [ ] Never overwrites original instructions

### **Smart Cleanup for URL Imports**
- [ ] **Smart Cleanup Toggle**
  - [ ] Add toggle to `/import` page
  - [ ] AI-powered blog-style fluff removal
  - [ ] Show original and cleaned versions
  - [ ] User choice of which version to keep

### **Suggested Tags Based on Content**
- [ ] **Content Analysis**
  - [ ] Analyze title + ingredients for tag suggestions
  - [ ] Display suggested tags below tag input
  - [ ] Manual tag addition (never auto-inserted)
  - [ ] Common tags: chicken, high protein, vegetarian, gluten-free

### **Data Schema Updates**
- [ ] **New AI Fields**
  - [ ] `summary` (string) - AI-generated TL;DR
  - [ ] `aiSource` (enum: "url", "screenshot", "none")
  - [ ] `parsedFromImage` (boolean)

### **QA & Fallback Requirements**
- [ ] **User Control**
  - [ ] All AI outputs editable before saving
  - [ ] Mock AI APIs with delayed hardcoded results
  - [ ] Full compatibility with Phases 1-2 recipes

---

## 🔗 **Routes to Create/Modify**

| Route | Description |
|-------|-------------|
| `/upload/ai` | Upload screenshot → parse to editable form |
| `/recipes/:id` | Show "Quick Summary" (if available) |
| `/import` | Add "Smart Cleanup" toggle for URL parsing |

---

## 🎯 **Success Criteria**

- [ ] AI extraction working for recipe screenshots
- [ ] Instruction summarization functional
- [ ] Smart cleanup improving URL imports
- [ ] Tag suggestions helpful and accurate
- [ ] All AI features user-controllable
- [ ] Backward compatibility maintained

---

*Last Updated: 2025-01-15*  
*Status: 🔄 PLANNED*
