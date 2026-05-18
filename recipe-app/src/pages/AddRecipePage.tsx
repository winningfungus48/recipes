import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../context/RecipeContext'
import RecipeForm from '../components/recipe/RecipeForm'

export default function AddRecipePage() {
  const { addRecipe } = useRecipes()
  const navigate = useNavigate()
  return (
    <RecipeForm
      onSave={(r) => {
        addRecipe(r)
        navigate(`/recipes/${r.id}`)
      }}
      onCancel={() => navigate('/')}
    />
  )
}
