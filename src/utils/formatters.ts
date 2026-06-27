import { format, parseISO } from 'date-fns'

export const formatCurrency = (val?: number): string => {
  if (val === undefined || val === null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2,
  }).format(val)
}

export const formatCurrencyCompact = (val?: number): string => {
  if (val === undefined || val === null) return '—'
  if (Math.abs(val) >= 1_000_000)
    return `$${(val / 1_000_000).toFixed(2)}M`
  if (Math.abs(val) >= 1_000)
    return `$${(val / 1_000).toFixed(1)}k`
  return formatCurrency(val)
}

export const formatPercent = (val?: number): string => {
  if (val === undefined || val === null) return '—'
  return `${val.toFixed(2)}%`
}

export const formatNumber = (val?: number): string => {
  if (val === undefined || val === null) return '—'
  return new Intl.NumberFormat('en-US').format(Math.round(val))
}

export const formatNumberCompact = (val?: number): string => {
  if (val === undefined || val === null) return '—'
  if (Math.abs(val) >= 1_000_000)
    return `${(val / 1_000_000).toFixed(2)}M`
  if (Math.abs(val) >= 1_000)
    return `${(val / 1_000).toFixed(1)}k`
  return formatNumber(val)
}

export const formatDate = (val?: string): string => {
  if (!val || val === 'BASELINE') return val || '—'
  try { return format(parseISO(val), 'MMM d, yyyy') } catch { return val }
}

export const formatDateShort = (val?: string): string => {
  if (!val || val === 'BASELINE') return val || '—'
  try { return format(parseISO(val), 'MMM d') } catch { return val }
}

// Change percent with sign (+63.4%)
export const formatChangePct = (val?: number): string => {
  if (val === undefined || val === null) return '—'
  const sign = val >= 0 ? '+' : ''
  return `${sign}${val.toFixed(1)}%`
}

// Delta in percentage points (+1.73 pts)
export const formatDeltaPts = (val?: number): string => {
  if (val === undefined || val === null) return '—'
  const sign = val >= 0 ? '+' : ''
  return `${sign}${val.toFixed(2)} pts`
}

export const getDeltaClass = (val?: number): string => {
  if (val === undefined || val === null) return 'text-gray-500'
  if (val > 0) return 'bg-green-100 text-green-700 font-medium'
  if (val < 0) return 'bg-red-100 text-red-700 font-medium'
  return 'bg-gray-100 text-gray-600'
}

export const getDeltaLabel = (val?: number): string => {
  if (val === undefined || val === null) return '—'
  const sign = val > 0 ? '+' : ''
  return `${sign}${val.toFixed(1)}%`
}

// Inline trend badge: green up / red down
export const trendColor = (val?: number): string => {
  if (val === undefined || val === null) return 'text-gray-400'
  return val >= 0 ? 'text-emerald-600' : 'text-red-500'
}

export const trendBg = (val?: number): string => {
  if (val === undefined || val === null) return 'bg-gray-100 text-gray-500'
  return val >= 0
    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
    : 'bg-red-50 text-red-700 border border-red-200'
}

export const trendArrow = (val?: number): string => {
  if (val === undefined || val === null) return '—'
  return val >= 0 ? '▲' : '▼'
}
