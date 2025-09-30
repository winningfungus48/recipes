import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { RecipesProvider } from './context/RecipesContext'
import ErrorBoundary from './components/ErrorBoundary'
import LandingPage from './pages/LandingPage'
import RecipeListPage from './pages/RecipeListPage'
import NewRecipePage from './pages/NewRecipePage'
import ManualRecipePage from './pages/ManualRecipePage'
import ImportRecipePage from './pages/ImportRecipePage'
import BulkImportPage from './pages/BulkImportPage'
import ManagePage from './pages/ManagePage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import EditRecipePage from './pages/EditRecipePage'

function App() {
  return (
    <ErrorBoundary>
      <RecipesProvider>
        <Router>
          <div className="min-h-screen bg-cream-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/recipes" element={<RecipeListPage />} />
              <Route path="/new" element={<ManualRecipePage />} />
              <Route path="/newrecipe" element={<NewRecipePage />} />
              <Route path="/import" element={<ImportRecipePage />} />
              <Route path="/import/bulk" element={<BulkImportPage />} />
              <Route path="/manage" element={<ManagePage />} />
              <Route path="/recipes/:id" element={<RecipeDetailPage />} />
              <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
            </Routes>
          </div>
        </Router>
      </RecipesProvider>
    </ErrorBoundary>
  )
}

export default App
