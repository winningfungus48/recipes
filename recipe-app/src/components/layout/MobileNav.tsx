import { NavLink } from 'react-router-dom'
import { BookOpen, Calendar, Home, ShoppingCart, Wrench } from 'lucide-react'

const tab =
  'flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1 text-[11px] font-medium'

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-[#8B6F47]/20 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <NavLink to="/" end className={({ isActive }) => `${tab} ${isActive ? 'text-[#7C9A6E]' : 'text-[#8B6F47]/80'}`}>
        <Home className="h-6 w-6" aria-hidden />
        Recipes
      </NavLink>
      <NavLink
        to="/cookbooks"
        className={({ isActive }) => `${tab} ${isActive ? 'text-[#7C9A6E]' : 'text-[#8B6F47]/80'}`}
      >
        <BookOpen className="h-6 w-6" aria-hidden />
        Cookbooks
      </NavLink>
      <NavLink
        to="/meal-plan"
        className={({ isActive }) => `${tab} ${isActive ? 'text-[#7C9A6E]' : 'text-[#8B6F47]/80'}`}
      >
        <Calendar className="h-6 w-6" aria-hidden />
        Meal Plan
      </NavLink>
      <NavLink
        to="/shopping-list"
        className={({ isActive }) => `${tab} ${isActive ? 'text-[#7C9A6E]' : 'text-[#8B6F47]/80'}`}
      >
        <ShoppingCart className="h-6 w-6" aria-hidden />
        Shop
      </NavLink>
      <NavLink
        to="/tools"
        className={({ isActive }) => `${tab} ${isActive ? 'text-[#7C9A6E]' : 'text-[#8B6F47]/80'}`}
      >
        <Wrench className="h-6 w-6" aria-hidden />
        Tools
      </NavLink>
    </nav>
  )
}
