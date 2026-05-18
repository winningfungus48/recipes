import { Minus, Plus } from 'lucide-react'

interface Props {
  servings: number
  onChange: (n: number) => void
}

export default function ScalingControl({ servings, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#7C9A6E]/30 bg-white p-4">
      <span className="text-sm font-semibold text-[#8B6F47]">Servings</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Decrease servings"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-[#FAF8F5] text-[#8B6F47]"
          onClick={() => onChange(Math.max(1, servings - 1))}
        >
          <Minus className="h-5 w-5" />
        </button>
        <span className="min-w-[2rem] text-center text-lg font-bold text-[#7C9A6E]">{servings}</span>
        <button
          type="button"
          aria-label="Increase servings"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-[#FAF8F5] text-[#8B6F47]"
          onClick={() => onChange(servings + 1)}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <p className="text-xs text-gray-500">Ingredient amounts scale below (math only).</p>
    </div>
  )
}
