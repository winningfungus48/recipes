import { useMemo, useState } from 'react'
import {
  CUP_VARIANTS,
  type CupVariant,
  fToC,
  gToWeight,
  mlToVolume,
  volumeToMl,
  weightToG,
  type VolumeUnit,
  type WeightUnit,
} from '../utils/unitConverter'
import { parseIngredientString } from '../utils/ingredientParser'
import { scaleIngredient } from '../services/scalingService'

const TABS = ['Units', 'Cups', 'Scaler', 'Reference'] as const

export default function ToolsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Units')
  const [volMode, setVolMode] = useState(true)
  const [volA, setVolA] = useState({ value: 1, unit: 'cup' as VolumeUnit })
  const [wtA, setWtA] = useState({ value: 1, unit: 'g' as WeightUnit })
  const [tempF, setTempF] = useState(32)

  const volB = useMemo(() => {
    const ml = volumeToMl(volA.value, volA.unit)
    return {
      tsp: mlToVolume(ml, 'tsp'),
      tbsp: mlToVolume(ml, 'tbsp'),
      cup: mlToVolume(ml, 'cup'),
      floz: mlToVolume(ml, 'floz'),
      ml: mlToVolume(ml, 'ml'),
      l: mlToVolume(ml, 'l'),
    }
  }, [volA])

  const wtB = useMemo(() => {
    const g = weightToG(wtA.value, wtA.unit)
    return {
      oz: gToWeight(g, 'oz'),
      lb: gToWeight(g, 'lb'),
      g: gToWeight(g, 'g'),
      kg: gToWeight(g, 'kg'),
    }
  }, [wtA])

  const [cupAmt, setCupAmt] = useState(1)
  const [cupVar, setCupVar] = useState<CupVariant>('us')

  const [scaleIn, setScaleIn] = useState('2 cups flour\n1/2 tsp salt')
  const [origServ, setOrigServ] = useState(4)
  const [targetServ, setTargetServ] = useState(8)

  const scaledLines = useMemo(() => {
    const ratio = targetServ / Math.max(1, origServ)
    return scaleIn
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const ing = parseIngredientString(line)
        const s = scaleIngredient(ing, ratio)
        return `${s.amount} ${s.unit} ${s.name}${s.notes ? ', ' + s.notes : ''}`.trim()
      })
  }, [scaleIn, origServ, targetServ])

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-[#8B6F47]">Tools</h1>
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`min-h-[44px] rounded-full px-4 text-sm font-semibold ${
              tab === t ? 'bg-[#7C9A6E] text-white' : 'bg-white text-[#8B6F47] ring-1 ring-[#8B6F47]/20'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Units' ? (
        <div className="space-y-8 rounded-2xl border bg-white p-4">
          <div className="flex gap-2">
            <button
              type="button"
              className={`min-h-[44px] flex-1 rounded-xl ${volMode ? 'bg-[#D47C2E] text-white' : 'bg-[#F0EBE3]'}`}
              onClick={() => setVolMode(true)}
            >
              Volume
            </button>
            <button
              type="button"
              className={`min-h-[44px] flex-1 rounded-xl ${!volMode ? 'bg-[#D47C2E] text-white' : 'bg-[#F0EBE3]'}`}
              onClick={() => setVolMode(false)}
            >
              Weight
            </button>
          </div>
          {volMode ? (
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Value
                <input
                  type="number"
                  className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
                  value={volA.value}
                  onChange={(e) => setVolA((v) => ({ ...v, value: parseFloat(e.target.value) || 0 }))}
                />
              </label>
              <select
                className="min-h-[48px] w-full rounded-xl border px-3"
                value={volA.unit}
                onChange={(e) => setVolA((v) => ({ ...v, unit: e.target.value as VolumeUnit }))}
              >
                {(['tsp', 'tbsp', 'cup', 'floz', 'ml', 'l'] as const).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600">Equivalents</p>
              <ul className="text-sm">
                <li>tsp: {volB.tsp.toFixed(2)}</li>
                <li>tbsp: {volB.tbsp.toFixed(2)}</li>
                <li>cup: {volB.cup.toFixed(3)}</li>
                <li>fl oz: {volB.floz.toFixed(2)}</li>
                <li>ml: {volB.ml.toFixed(1)}</li>
                <li>L: {volB.l.toFixed(4)}</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm font-medium">
                Value
                <input
                  type="number"
                  className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
                  value={wtA.value}
                  onChange={(e) => setWtA((v) => ({ ...v, value: parseFloat(e.target.value) || 0 }))}
                />
              </label>
              <select
                className="min-h-[48px] w-full rounded-xl border px-3"
                value={wtA.unit}
                onChange={(e) => setWtA((v) => ({ ...v, unit: e.target.value as WeightUnit }))}
              >
                {(['oz', 'lb', 'g', 'kg'] as const).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              <ul className="text-sm">
                <li>oz: {wtB.oz.toFixed(2)}</li>
                <li>lb: {wtB.lb.toFixed(3)}</li>
                <li>g: {wtB.g.toFixed(1)}</li>
                <li>kg: {wtB.kg.toFixed(4)}</li>
              </ul>
            </div>
          )}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-[#8B6F47]">Temperature</h3>
            <label className="mt-2 block text-sm">
              °F
              <input
                type="number"
                className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
                value={tempF}
                onChange={(e) => setTempF(parseFloat(e.target.value) || 0)}
              />
            </label>
            <p className="mt-2 text-sm">°C: {fToC(tempF).toFixed(1)}</p>
            <p className="text-sm text-gray-500">212°F = {fToC(212).toFixed(0)}°C (boil)</p>
          </div>
        </div>
      ) : null}

      {tab === 'Cups' ? (
        <div className="rounded-2xl border bg-white p-4">
          <label className="text-sm font-medium">Cups</label>
          <input
            type="number"
            className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
            value={cupAmt}
            onChange={(e) => setCupAmt(parseFloat(e.target.value) || 0)}
          />
          <label className="mt-4 block text-sm font-medium">Cup type</label>
          <select
            className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
            value={cupVar}
            onChange={(e) => setCupVar(e.target.value as CupVariant)}
          >
            {(Object.keys(CUP_VARIANTS) as CupVariant[]).map((k) => (
              <option key={k} value={k}>
                {k} ({CUP_VARIANTS[k]} ml)
              </option>
            ))}
          </select>
          <p className="mt-4 text-sm">
            ≈ <strong>{(cupAmt * CUP_VARIANTS[cupVar]).toFixed(0)}</strong> ml
          </p>
        </div>
      ) : null}

      {tab === 'Scaler' ? (
        <div className="rounded-2xl border bg-white p-4">
          <label className="text-sm font-medium">Ingredients (one per line)</label>
          <textarea
            className="mt-1 min-h-[120px] w-full rounded-xl border p-3 font-mono text-sm"
            value={scaleIn}
            onChange={(e) => setScaleIn(e.target.value)}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Original servings
              <input
                type="number"
                min={1}
                className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
                value={origServ}
                onChange={(e) => setOrigServ(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
            </label>
            <label className="text-sm">
              Target servings
              <input
                type="number"
                min={1}
                className="mt-1 min-h-[48px] w-full rounded-xl border px-3"
                value={targetServ}
                onChange={(e) => setTargetServ(Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
            </label>
          </div>
          <h3 className="mt-6 font-semibold text-[#7C9A6E]">Scaled</h3>
          <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-[#FAF8F5] p-3 text-sm">{scaledLines.join('\n')}</pre>
        </div>
      ) : null}

      {tab === 'Reference' ? (
        <div className="rounded-2xl border bg-white p-4 text-sm">
          <table className="w-full border-collapse">
            <tbody>
              {[
                ['3 tsp', '1 tbsp'],
                ['16 tbsp', '1 cup'],
                ['1 cup', '8 fl oz'],
                ['1 lb', '16 oz'],
              ].map(([a, b]) => (
                <tr key={a} className="border-b">
                  <td className="py-2 pr-4">{a}</td>
                  <td className="py-2">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
