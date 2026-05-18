/** Monday-based week; returns Monday 00:00:00 local for the week containing `d`. */
export function startOfWeekMonday(d = new Date()): Date {
  const x = new Date(d)
  const day = x.getDay()
  const diff = day === 0 ? -6 : 1 - day
  x.setDate(x.getDate() + diff)
  x.setHours(0, 0, 0, 0)
  return x
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

export function formatWeekRange(monday: Date): string {
  const sun = addDays(monday, 6)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  const y = monday.getFullYear() !== sun.getFullYear()
  const a = monday.toLocaleDateString('en-US', y ? { ...opts, year: 'numeric' } : opts)
  const b = sun.toLocaleDateString('en-US', { ...opts, year: 'numeric' })
  return `${a} – ${b}`
}

export function weekPlanId(monday: Date): string {
  return `week-${monday.toISOString().slice(0, 10)}`
}

export const WEEKDAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export type WeekdayKey = (typeof WEEKDAYS)[number]

export function weekdayLabel(key: WeekdayKey, monday: Date): string {
  const idx = WEEKDAYS.indexOf(key)
  const dt = addDays(monday, idx)
  const dayName = key.charAt(0).toUpperCase() + key.slice(1)
  const md = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${dayName} ${md}`
}
