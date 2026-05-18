/** Volume in ml for conversions */
const TSP_ML = 4.92892
const TBSP_ML = 14.7868
const CUP_US_ML = 236.588
const FLOZ_ML = 29.5735

export type VolumeUnit = 'tsp' | 'tbsp' | 'cup' | 'floz' | 'ml' | 'l'
export type WeightUnit = 'oz' | 'lb' | 'g' | 'kg'

export function volumeToMl(value: number, from: VolumeUnit): number {
  switch (from) {
    case 'tsp':
      return value * TSP_ML
    case 'tbsp':
      return value * TBSP_ML
    case 'cup':
      return value * CUP_US_ML
    case 'floz':
      return value * FLOZ_ML
    case 'ml':
      return value
    case 'l':
      return value * 1000
    default:
      return value
  }
}

export function mlToVolume(ml: number, to: VolumeUnit): number {
  switch (to) {
    case 'tsp':
      return ml / TSP_ML
    case 'tbsp':
      return ml / TBSP_ML
    case 'cup':
      return ml / CUP_US_ML
    case 'floz':
      return ml / FLOZ_ML
    case 'ml':
      return ml
    case 'l':
      return ml / 1000
    default:
      return ml
  }
}

export function weightToG(value: number, from: WeightUnit): number {
  switch (from) {
    case 'oz':
      return value * 28.3495
    case 'lb':
      return value * 453.592
    case 'g':
      return value
    case 'kg':
      return value * 1000
    default:
      return value
  }
}

export function gToWeight(g: number, to: WeightUnit): number {
  switch (to) {
    case 'oz':
      return g / 28.3495
    case 'lb':
      return g / 453.592
    case 'g':
      return g
    case 'kg':
      return g / 1000
    default:
      return g
  }
}

export function fToC(f: number): number {
  return ((f - 32) * 5) / 9
}

export function cToF(c: number): number {
  return (c * 9) / 5 + 32
}

/** US cup sizes in ml */
export const CUP_VARIANTS = {
  us: 240,
  metric: 250,
  japanese: 200,
  korean: 200,
  rice: 180,
} as const

export type CupVariant = keyof typeof CUP_VARIANTS

export function cupsToMl(cups: number, variant: CupVariant): number {
  return cups * CUP_VARIANTS[variant]
}

export function mlToCups(ml: number, variant: CupVariant): number {
  return ml / CUP_VARIANTS[variant]
}
