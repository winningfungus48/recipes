import { NavLink } from 'react-router-dom'
import { BookOpen, Calendar, ChefHat, Home, ShoppingCart, Wrench } from 'lucide-react'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium min-h-[44px] ${
    isActive
      ? 'bg-[#7C9A6E]/15 text-[#7C9A6E]'
      : 'text-[#8B6F47] hover:bg-[#F0EBE3]'
  }`

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-[#8B6F47]/20 bg-white p-4">
      <div className="mb-8 flex items-center gap-2 px-2">
        <ChefHat className="h-8 w-8 text-[#7C9A6E]" aria-hidden />
        <span className="font-semibold text-[#8B6F47]">Cooks Books</span>
      </div>
      <nav className="flex flex-col gap-1">
        <NavLink to="/" end className={linkClass}>
          <Home className="h-5 w-5 shrink-0" aria-hidden />
          Recipes
        </NavLink>
        <NavLink to="/cookbooks" className={linkClass}>
          <BookOpen className="h-5 w-5 shrink-0" aria-hidden />
          Cookbooks
        </NavLink>
        <NavLink to="/meal-plan" className={linkClass}>
          <Calendar className="h-5 w-5 shrink-0" aria-hidden />
          Meal Plan
        </NavLink>
        <NavLink to="/shopping-list" className={linkClass}>
          <ShoppingCart className="h-5 w-5 shrink-0" aria-hidden />
          Shopping List
        </NavLink>
        <NavLink to="/tools" className={linkClass}>
          <Wrench className="h-5 w-5 shrink-0" aria-hidden />
          Tools
        </NavLink>
      </nav>
    </aside>
  )
}
