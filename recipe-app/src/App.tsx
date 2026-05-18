import { Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Home from './pages/Home'
import RecipeDetailPage from './pages/RecipeDetailPage'
import AddRecipePage from './pages/AddRecipePage'
import EditRecipePage from './pages/EditRecipePage'
import CookbooksPage from './pages/CookbooksPage'
import CookbookDetailPage from './pages/CookbookDetailPage'
import MealPlanPage from './pages/MealPlanPage'
import ShoppingListPage from './pages/ShoppingListPage'
import ToolsPage from './pages/ToolsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="recipes/:id" element={<RecipeDetailPage />} />
        <Route path="recipes/add" element={<AddRecipePage />} />
        <Route path="recipes/:id/edit" element={<EditRecipePage />} />
        <Route path="cookbooks" element={<CookbooksPage />} />
        <Route path="cookbooks/:id" element={<CookbookDetailPage />} />
        <Route path="meal-plan" element={<MealPlanPage />} />
        <Route path="shopping-list" element={<ShoppingListPage />} />
        <Route path="tools" element={<ToolsPage />} />
      </Route>
    </Routes>
  )
}
