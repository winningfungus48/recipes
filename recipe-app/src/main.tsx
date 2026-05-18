import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { runMigration } from './utils/migration'
import ErrorBoundary from './components/ErrorBoundary'
import { RecipeProvider } from './context/RecipeContext'
import { CookbookProvider } from './context/CookbookContext'
import { MealPlanProvider } from './context/MealPlanContext'
import App from './App.tsx'
import './index.css'

runMigration()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <RecipeProvider>
          <CookbookProvider>
            <MealPlanProvider>
              <App />
            </MealPlanProvider>
          </CookbookProvider>
        </RecipeProvider>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
