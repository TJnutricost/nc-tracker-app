import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts'
import { Calendar, ShoppingCart, DollarSign, Users, TrendingUp } from 'lucide-react'
import TopBar from '../components/layout/TopBar'
import MetricCard from '../components/ui/MetricCard'
import { mockNutricostDaily } from '../data/mockData'
import { formatCurrency, formatPercent, formatNumber, formatDate } from '../utils/formatters'
import type { NutricostDailyRow } from '../types'

type SortKey = keyof NutricostDailyRow
type SortDir = 'asc' | 'desc'

const latest = mockNutricostDaily[mockNutricostDaily.length - 1]

// Last 60 days chart data
const chartData = mockNutricostDaily.map(row => ({
  label: format(parseISO(row.date), 'MMM d'),
  date: row.date,
  revenue: row.revenue,
  lyRevenue: row.lyRevenue,
}))

// Weekly aggregation
function getWeeklyData() {
  const weeks: { week: string; revenue: number }[] = []
  let current: { week: string; revenue: number } | null = null
  for (const row of mockNutricostDaily) {
    const d = parseISO(row.date)
    const monday = new Date(d)
    monday.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    const weekKey = format(monday, 'MMM d')
    if (!current || current.week !== weekKey) {
      if (current) weeks.push(current)
      current = { week: weekKey, revenue: 0 }
    }
    current.revenue += row.revenue
  }
  if (current) weeks.push(current)
  return weeks.slice(-8)
}

const weeklyData = getWeeklyData()

export default function NutricostDaily() {
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const sorted = [...mockNutricostDaily].sort((a, b) => {
    const av = a[sortKey]
    const bv = b[sortKey]
    const cmp = String(av) < String(bv) ? -1 : String(av) > String(bv) ? 1 : 0
    return sortDir === 'asc' ? cmp : -cmp
  })

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const headers: { key: SortKey; label: string }[] = [
    { key: 'date', label: 'Date' },
    { key: 'orders', label: 'Orders' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'sessions', label: 'Sessions' },
    { key: 'conversionRate', label: 'CR%' },
    { key: 'aov', label: 'AOV' },
    { key: 'totalSalesExclTikTok', label: 'Sales excl. TikTok' },
    { key: 'lyOrders', label: 'LY Orders' },
    { key: 'lyRevenue', label: 'LY Revenue' },
    { key: 'lyConversionRate', label: 'LY CR%' },
  ]

  return (
    <div>
      <TopBar title="Nutricost Daily" />
      <div className="p-6 space-y-8">

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Latest Date"
            value={formatDate(latest.date)}
            icon={<Calendar size={18} className="text-blue-600" />}
            iconBg="bg-blue-100"
          />
          <MetricCard
            title="Orders"
            value={formatNumber(latest.orders)}
            icon={<ShoppingCart size={18} className="text-green-600" />}
            iconBg="bg-green-100"
          />
          <MetricCard
            title="Revenue"
            value={formatCurrency(latest.revenue)}
            icon={<DollarSign size={18} className="text-emerald-600" />}
            iconBg="bg-emerald-100"
          />
          <MetricCard
            title="Sessions"
            value={formatNumber(latest.sessions)}
            icon={<Users size={18} className="text-purple-600" />}
            iconBg="bg-purple-100"
          />
          <MetricCard
            title="Conv. Rate"
            value={formatPercent(latest.conversionRate)}
            icon={<TrendingUp size={18} className="text-amber-600" />}
            iconBg="bg-amber-100"
          />
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend — 60 Days + YoY</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={6} />
              <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [formatCurrency(v as number), '']} />
              <Legend />
              <Line type="monotone" dataKey="revenue" name="2026 Revenue" stroke="#005EB8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="lyRevenue" name="LY Revenue" stroke="#9CA3AF" strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Revenue (Last 8 Weeks)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [formatCurrency(v as number), '']} />
              <Bar dataKey="revenue" name="Weekly Revenue" fill="#005EB8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Data Table */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Data</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {headers.map(h => (
                    <th
                      key={h.key}
                      onClick={() => toggleSort(h.key)}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                    >
                      {h.label} {sortKey === h.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {sorted.map((row, i) => (
                  <tr key={row.date} className={`hover:bg-blue-50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                    <td className="px-4 py-2.5 text-sm font-medium text-gray-900 whitespace-nowrap">{formatDate(row.date)}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{formatNumber(row.orders)}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{formatCurrency(row.revenue)}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{formatNumber(row.sessions)}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{formatPercent(row.conversionRate)}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{formatCurrency(row.aov)}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{row.totalSalesExclTikTok ? formatCurrency(row.totalSalesExclTikTok) : '—'}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{row.lyOrders ? formatNumber(row.lyOrders) : '—'}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{row.lyRevenue ? formatCurrency(row.lyRevenue) : '—'}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{row.lyConversionRate ? formatPercent(row.lyConversionRate) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
