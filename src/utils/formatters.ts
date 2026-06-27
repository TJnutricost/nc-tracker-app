import { format, parseISO } from 'date-fns'

export const formatCurrency = (val?: number): string => {
  if (val === undefined || val === null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(val)
}

export const formatPercent = (val?: number): string => {
  if (val === undefined || val === null) return '—'
  return `${val.toFixed(2)}%`
}

export const formatNumber = (val?: number): string => {
  if (val === undefined || val === null) return '—'
  return new Intl.NumberFormat('en-US').format(Math.round(val))
}

export const formatDate = (val?: string): string => {
  if (!val || val === 'BASELINE') return val || '—'
  try {
    return format(parseISO(val), 'MMM d, yyyy')
  } catch {
    return val
  }
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
