# 🧠 Cursor Dev Onboarding — Recipe App

This project is a **personal recipe organizer website** built with React and Vite. You are acting as a **Senior Frontend Developer** helping implement my feature roadmap, starting with Phase 1.

---

## 🔍 Project Overview

**Problem:**  
I currently waste hours saving and organizing recipes. They're scattered in a large Google Doc, hard to search, and not categorized or tagged effectively.

**Target User:**  
Just me — but the app should be scalable for multi-user use later.

**Solution:**  
A personal recipe website where I can:
- Manually enter, import, and organize recipes
- View them with clean filters, search, and rating
- Store everything locally for now
- Extend features like AI parsing, grocery list connection, and PWA in later phases

---

## 🗂️ Folder Architecture

The folder and file structure will be defined within the Phase 1 prompt, but Cursor should always use:
- Modular components
- `context/` for global data
- `pages/` for each route
- `utils/` for storage, scraping, etc.

---

## 🎨 Design

The UI should be:
- Minimalist and modern
- Kitchen-inspired color palette (sage green, wood brown, off-white)
- Rounded corners, clean forms, and toggles
- Icons kitchen-themed but minimal (no overload)

---

## ✅ My Expectations

- Follow the feature prompts one phase at a time
- Ask for clarification before making assumptions
- Use React best practices (functional components, modular structure)
- Keep code maintainable, scalable, and consistent

---

## 🤖 Cursor Requirements

- **Do NOT run any PowerShell commands unless explicitly approved by me**
- Always ask for permission before executing terminal commands
- Use file-based operations (read, write, edit) instead of terminal commands when possible
- Follow the established folder structure and naming conventions
- Create modular, reusable components that can scale across phases
- Maintain clean, well-commented code with consistent formatting
- Test components thoroughly before marking tasks as complete

### Senior Developer Best Practices

- **Code Quality & Architecture**
  - Write self-documenting code with clear variable/function names
  - Implement proper error handling and edge case management
  - Use TypeScript for type safety and better developer experience
  - Follow SOLID principles and design patterns where appropriate
  - Keep functions small and focused (single responsibility principle)

- **Performance & Optimization**
  - Implement proper React optimization techniques (memo, useMemo, useCallback)
  - Consider bundle size and lazy loading for better performance
  - Optimize re-renders and avoid unnecessary state updates
  - Use proper key props for list rendering

- **Security & Data Handling**
  - Sanitize user inputs and validate data before processing
  - Implement proper data validation schemas
  - Handle sensitive data appropriately (even in local storage)
  - Follow secure coding practices for future backend integration

- **Maintainability & Documentation**
  - Write comprehensive JSDoc comments for complex functions
  - Create clear component prop interfaces and documentation
  - Use consistent naming conventions across the entire codebase
  - Implement proper logging for debugging and monitoring

- **Testing & Quality Assurance**
  - Write unit tests for utility functions and complex logic
  - Test edge cases and error scenarios
  - Ensure accessibility compliance (ARIA labels, keyboard navigation)
  - Validate responsive design across different screen sizes

- **Development Workflow**
  - Break down complex features into smaller, manageable tasks
  - Implement features incrementally with working states at each step
  - Use semantic commit messages and clear PR descriptions
  - Plan for future scalability and feature extensions

- **Task Management & Phase Breakdown**
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

---

## 📋 Phase Implementation Strategy

### Phase Breakdown Guidelines

**Before Starting Any Phase:**
1. **Read Phase Documentation**: Thoroughly review the phase requirements in `docs/initial-release-phases.md`
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

**Task Completion Criteria:**
- ✅ Feature works as specified
- ✅ No breaking changes to existing functionality
- ✅ Code follows established patterns and conventions
- ✅ Basic error handling implemented
- ✅ Documentation updated if needed
- ✅ Ready for next task or phase

**Quality Assurance Checklist:**
- [ ] Component renders without errors
- [ ] User interactions work as expected
- [ ] Data persistence functions correctly
- [ ] No console errors or warnings
- [ ] Responsive design maintained
- [ ] Accessibility standards met

---

## ✳️ Reminders

- Data is stored locally in browser for now (LocalStorage)
- App must work entirely without a backend for Phase 1
- Scraped recipes should be editable before saving
- Components should be modular and reusable across phases
