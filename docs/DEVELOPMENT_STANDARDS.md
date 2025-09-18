# 🎯 Development Standards & Requirements

This document defines the comprehensive development standards, workflow requirements, and coding guidelines for the Recipe App project.

---

## 🔄 **Mandatory Development Workflow**

When beginning a new phase or given a new task, follow this **exact sequence**:

1. **📋 Process Information**: Thoroughly analyze the requirements and context
2. **❓ Ask Clarifying Questions**: Identify any ambiguities or missing details
3. **📝 Process Answers**: Incorporate clarifications into the implementation plan
4. **📋 Propose Modular Tasks**: Break down work into specific, manageable tasks
5. **✅ Complete Each Task**: Implement one task at a time with full completion
6. **🧪 Regression Test**: Test changed areas and ensure no breaking changes
7. **📊 Report Completion**: Provide status update and await approval before starting the next task

---

## 🤖 **Core Cursor Requirements**

- **Do NOT run any PowerShell commands unless explicitly approved by me**
- Always ask for permission before executing terminal commands
- Use file-based operations (read, write, edit) instead of terminal commands when possible
- Follow the established folder structure and naming conventions
- Create modular, reusable components that can scale across phases
- Maintain clean, well-commented code with consistent formatting
- Test components thoroughly before marking tasks as complete

---

## 🏗️ **Senior Developer Best Practices**

### **Code Quality & Architecture**
- Write self-documenting code with clear variable/function names
- Implement proper error handling and edge case management
- Use TypeScript for type safety and better developer experience
- Follow SOLID principles and design patterns where appropriate
- Keep functions small and focused (single responsibility principle)

### **Performance & Optimization**
- Implement proper React optimization techniques (memo, useMemo, useCallback)
- Consider bundle size and lazy loading for better performance
- Optimize re-renders and avoid unnecessary state updates
- Use proper key props for list rendering

### **Security & Data Handling**
- Sanitize user inputs and validate data before processing
- Implement proper data validation schemas
- Handle sensitive data appropriately (even in local storage)
- Follow secure coding practices for future backend integration

### **Maintainability & Documentation**
- Write comprehensive JSDoc comments for complex functions
- Create clear component prop interfaces and documentation
- Use consistent naming conventions across the entire codebase
- Implement proper logging for debugging and monitoring

### **Testing & Quality Assurance**
- Write unit tests for utility functions and complex logic
- Test edge cases and error scenarios
- Ensure accessibility compliance (ARIA labels, keyboard navigation)
- Validate responsive design across different screen sizes

### **Development Workflow**
- Break down complex features into smaller, manageable tasks
- Implement features incrementally with working states at each step
- Use semantic commit messages and clear PR descriptions
- Plan for future scalability and feature extensions

---

## 📋 **Task Management & Phase Breakdown**

### **Core Principles**
- **One Task at a Time**: Never work on multiple features simultaneously
- **Atomic Commits**: Each commit should represent one complete, testable change
- **Working State Priority**: Always maintain a working application state between tasks
- **Feature Isolation**: Complete one feature fully before starting the next
- **Incremental Testing**: Test each small change before moving to the next task
- **Clear Task Boundaries**: Define specific start/end points for each task
- **Dependency Management**: Identify and resolve task dependencies before starting
- **Rollback Strategy**: Ensure each task can be easily undone if issues arise
- **Quality Gates**: Each task must pass basic functionality tests before completion
- **Documentation Updates**: Update relevant docs immediately after each task completion

### **Phase Implementation Strategy**

**Before Starting Any Phase:**
1. **Read Phase Documentation**: Thoroughly review the phase requirements in `docs/phases/`
2. **Create Task List**: Break down the phase into 3-5 specific, actionable tasks
3. **Identify Dependencies**: Map out which tasks depend on others
4. **Set Success Criteria**: Define clear completion criteria for each task
5. **Plan Testing Strategy**: Determine how to test each task incrementally

**During Phase Implementation:**
1. **One Task Focus**: Work on only one task at a time until completion
2. **Working State**: Ensure the app remains functional after each task
3. **Incremental Commits**: Commit after each completed task with clear messages
4. **Immediate Testing**: Test functionality before moving to the next task
5. **Documentation Sync**: Update docs immediately after task completion

---

## ✅ **Task Completion Criteria**

Each task must meet these requirements before being marked complete:

- ✅ Feature works as specified
- ✅ No breaking changes to existing functionality
- ✅ Code follows established patterns and conventions
- ✅ Basic error handling implemented
- ✅ Documentation updated if needed
- ✅ Ready for next task or phase

---

## 🧪 **Quality Assurance Checklist**

Before completing any task, verify:

- [ ] Component renders without errors
- [ ] User interactions work as expected
- [ ] Data persistence functions correctly
- [ ] No console errors or warnings
- [ ] Responsive design maintained
- [ ] Accessibility standards met

---

## 📊 **Reporting Standards**

When reporting task completion, include:

1. **Task Summary**: What was implemented
2. **Files Modified**: List of changed files
3. **Testing Results**: What was tested and results
4. **Next Steps**: What the next task will be
5. **Questions/Concerns**: Any issues or clarifications needed

---

## 🎨 **Design Standards**

### **UI/UX Guidelines**
- **Minimalist and modern** design approach
- **Kitchen-inspired color palette**: sage green, wood brown, off-white
- **Rounded corners**, clean forms, and toggles
- **Kitchen-themed but minimal** icons (no overload)
- **Responsive design** for all screen sizes
- **Accessibility compliance** with ARIA labels and keyboard navigation

### **Component Standards**
- **Modular components** that can scale across phases
- **Consistent naming conventions** across the entire codebase
- **Proper prop interfaces** with TypeScript
- **Reusable patterns** for similar functionality
- **Clean separation of concerns** between components

---

## 🔧 **Technical Standards**

### **Project Architecture**
- **Modular components** in `src/components/`
- **Context management** in `src/context/`
- **Page components** in `src/pages/`
- **Utility functions** in `src/utils/`
- **Type definitions** in `src/types/`

### **Data Management**
- **LocalStorage** for data persistence (Phase 1-2)
- **No backend dependency** for Phase 1
- **Scraped recipes** should be editable before saving
- **Data validation** before storage
- **Error handling** for data operations

### **Code Organization**
- **Functional components** with React hooks
- **TypeScript** for type safety
- **Consistent file naming** (PascalCase for components, camelCase for utilities)
- **Proper imports** and exports
- **Clean code structure** with logical grouping

---

## ✳️ **Project-Specific Reminders**

- Data is stored locally in browser for now (LocalStorage)
- App must work entirely without a backend for Phase 1
- Scraped recipes should be editable before saving
- Components should be modular and reusable across phases
- Follow kitchen-inspired design (sage green, wood brown, off-white)
- Maintain minimalist and modern UI approach
- Always maintain a working application state
- Test thoroughly before marking tasks complete

---

## 🚀 **Quick Reference**

### **Essential Commands**
- **Start Development**: `npm run dev` (from `recipe-app/` directory)
- **Type Check**: `npx tsc --noEmit`
- **Build**: `npm run build`

### **Key Directories**
- **Source Code**: `src/`
- **Documentation**: `docs/`
- **Phase Docs**: `docs/phases/`
- **Technical Docs**: `docs/technical/`

### **Important Files**
- **Main App**: `src/App.tsx`
- **Recipe Context**: `src/context/RecipesContext.tsx`
- **Recipe Types**: `src/types/recipe.ts`
- **Storage Utils**: `src/utils/storage.ts`

---

*This document serves as the single source of truth for all development standards and requirements.*
*Last Updated: 2025-01-15*
*Version: 1.0*
