import { useNavigate, useParams } from 'react-router-dom'
import { useRecipes } from '../context/RecipeContext'
import RecipeForm from '../components/recipe/RecipeForm'

export default function EditRecipePage() {
  const { id } = useParams()
  const { recipes, updateRecipe } = useRecipes()
  const navigate = useNavigate()
  const recipe = recipes.find((r) => r.id === id)

  if (!recipe) {
    return <p className="p-8 text-center text-[#8B6F47]">Recipe not found.</p>
  }

  return (
    <RecipeForm
      initial={recipe}
      onSave={(r) => {
        updateRecipe(r)
        navigate(`/recipes/${r.id}`)
      }}
      onCancel={() => navigate(`/recipes/${recipe.id}`)}
    />
  )
}
