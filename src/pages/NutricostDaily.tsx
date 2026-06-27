import { useState, useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ChevronUp, ChevronDown, Minus } from 'lucide-react'
import TopBar from '../components/layout/TopBar'
import {
  mockNutricostDaily,
  mockNutricostSummary,
  mockNutricostMonthly,
  mockNutricostWeekly,
} from '../data/mockData'
import {
  formatCurrency, formatCurrencyCompact, formatPercent, formatNumber,
  formatNumberCompact, formatChangePct, trendBg,
} from '../utils/formatters'
import type { NutricostDailyRow, NutricostPeriodRow, NutricostComparisonRow } from '../types'

// ---------------------------------------------------------------------------
// Metric definition used across all sections
// ---------------------------------------------------------------------------
interface MetricDef {
  key: 'orders' | 'revenue' | 'sessions' | 'cr' | 'aov'
  label: string
  format: (v: number) => string
  formatCompact: (v: number) => string
  lyKey: 'lyOrders' | 'lyRevenue' | 'lySessions' | 'lyCr' | 'lyAov'
  deltaKey: 'ordersChangePct' | 'revenueChangePct' | 'sessionsChangePct' | 'crChangePct' | 'aovChangePct'
}

const METRICS: MetricDef[] = [
  { key: 'orders',   label: 'Orders',   format: formatNumber,   formatCompact: formatNumberCompact,   lyKey: 'lyOrders',   deltaKey: 'ordersChangePct' },
  { key: 'revenue',  label: 'Revenue',  format: formatCurrency, formatCompact: formatCurrencyCompact, lyKey: 'lyRevenue',  deltaKey: 'revenueChangePct' },
  { key: 'sessions', label: 'Sessions', format: formatNumber,   formatCompact: formatNumberCompact,   lyKey: 'lySessions', deltaKey: 'sessionsChangePct' },
  { key: 'cr',       label: 'Conv. Rate', format: formatPercent, formatCompact: formatPercent,        lyKey: 'lyCr',       deltaKey: 'crChangePct' },
  { key: 'aov',      label: 'AOV',      format: formatCurrency, formatCompact: formatCurrency,        lyKey: 'lyAov',      deltaKey: 'aovChangePct' },
]

// ---------------------------------------------------------------------------
// YTD Hero — 5 large metric comparison tiles
// ---------------------------------------------------------------------------
function YtdHero({ row }: { row: NutricostPeriodRow }) {
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700">{row.sectionLabel}</h2>
        <span className="text-xs text-gray-400">{row.period} vs {row.lyPeriod}</span>
      </div>
      <div className="grid grid-cols-5 gap-px rounded-xl overflow-hidden border border-gray-200 bg-gray-200 shadow-sm">
        {METRICS.map((m) => {
          const cur = row[m.key] as number
          const ly = row[m.lyKey] as number
          const delta = row[m.deltaKey] as number
          return (
            <div key={m.key} className="bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-2">{m.label}</p>
              <p className="text-2xl font-bold text-gray-900 leading-none">{m.format(cur)}</p>
              <p className="text-xs text-gray-400 mt-1.5">LY {m.formatCompact(ly)}</p>
              <div className="mt-2.5">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${trendBg(delta)}`}>
                  {delta >= 0 ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                  {formatChangePct(delta)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Period Snapshot rows — compact horizontal band per period
// ---------------------------------------------------------------------------
function PeriodSnapshotRow({ row }: { row: NutricostPeriodRow }) {
  return (
    <div className="flex items-stretch border-b border-gray-100 last:border-0">
      {/* Period label */}
      <div className="w-52 shrink-0 px-5 py-3.5 flex flex-col justify-center border-r border-gray-100">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-700">{row.sectionLabel}</p>
        <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{row.period}</p>
      </div>
      {/* Metrics */}
      <div className="flex-1 grid grid-cols-5 divide-x divide-gray-100">
        {METRICS.map((m) => {
          const cur = row[m.key] as number
          const ly = row[m.lyKey] as number
          const delta = row[m.deltaKey] as number
          return (
            <div key={m.key} className="px-4 py-3 flex flex-col justify-center">
              <p className="text-sm font-bold text-gray-900">{m.formatCompact(cur)}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">LY {m.formatCompact(ly)}</p>
              <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold mt-1.5 w-fit px-1.5 py-0.5 rounded ${trendBg(delta)}`}>
                {delta >= 0 ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
                {formatChangePct(delta)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared grouped-header comparison table (monthly or weekly)
// ---------------------------------------------------------------------------
const GROUP_COLORS = [
  { header: 'bg-blue-800',   sub: 'bg-blue-700',   body: '',           border: 'border-l-2 border-blue-200' },
  { header: 'bg-emerald-800', sub: 'bg-emerald-700', body: '',          border: 'border-l-2 border-emerald-200' },
  { header: 'bg-violet-800', sub: 'bg-violet-700',  body: '',           border: 'border-l-2 border-violet-200' },
  { header: 'bg-amber-700',  sub: 'bg-amber-600',   body: '',           border: 'border-l-2 border-amber-200' },
  { header: 'bg-rose-800',   sub: 'bg-rose-700',    body: '',           border: 'border-l-2 border-rose-200' },
]

const COMPARISON_METRICS: { label: string; key: 'orders'|'revenue'|'sessions'|'cr'|'aov'; lyKey: 'lyOrders'|'lyRevenue'|'lySessions'|'lyCr'|'lyAov'; deltaKey: 'ordersChangePct'|'revenueChangePct'|'sessionsChangePct'|'crChangePct'|'aovChangePct'; fmt: (v:number)=>string }[] = [
  { label: 'ORDERS',   key: 'orders',   lyKey: 'lyOrders',   deltaKey: 'ordersChangePct',   fmt: formatNumber },
  { label: 'REVENUE',  key: 'revenue',  lyKey: 'lyRevenue',  deltaKey: 'revenueChangePct',  fmt: formatCurrencyCompact },
  { label: 'SESSIONS', key: 'sessions', lyKey: 'lySessions', deltaKey: 'sessionsChangePct', fmt: formatNumberCompact },
  { label: 'CONV. RATE', key: 'cr',     lyKey: 'lyCr',       deltaKey: 'crChangePct',       fmt: formatPercent },
  { label: 'AOV',      key: 'aov',      lyKey: 'lyAov',      deltaKey: 'aovChangePct',      fmt: formatCurrency },
]

function ComparisonTable({ rows }: { rows: NutricostComparisonRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          {/* Group label row */}
          <tr>
            <th rowSpan={2} className="bg-slate-800 text-slate-200 text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider whitespace-nowrap border-r border-slate-700 align-middle">
              Period
            </th>
            {COMPARISON_METRICS.map((m, gi) => (
              <th
                key={m.key}
                colSpan={3}
                className={`${GROUP_COLORS[gi].header} text-white text-center text-[11px] font-bold uppercase tracking-widest py-2.5 border-l-2 border-white/20`}
              >
                {m.label}
              </th>
            ))}
          </tr>
          {/* Sub-header row */}
          <tr>
            {COMPARISON_METRICS.map((m, gi) => (
              <>
                <th key={`${m.key}-cur`} className={`${GROUP_COLORS[gi].sub} text-white/90 text-center text-[10px] font-semibold uppercase tracking-wide py-2 px-3 border-l-2 border-white/20 whitespace-nowrap`}>Current</th>
                <th key={`${m.key}-ly`}  className={`${GROUP_COLORS[gi].sub} text-white/70 text-center text-[10px] font-semibold uppercase tracking-wide py-2 px-3 whitespace-nowrap`}>LY</th>
                <th key={`${m.key}-d`}   className={`${GROUP_COLORS[gi].sub} text-white/70 text-center text-[10px] font-semibold uppercase tracking-wide py-2 px-3 whitespace-nowrap`}>Δ%</th>
              </>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-2.5 text-xs font-semibold text-gray-700 border-r border-gray-100 whitespace-nowrap bg-gray-50">
                <span className="block">{row.periodLabel}</span>
                <span className="text-[10px] text-gray-400 font-normal">{row.lyPeriodLabel}</span>
              </td>
              {COMPARISON_METRICS.map((m, gi) => {
                const cur = row[m.key] as number
                const ly = row[m.lyKey] as number
                const delta = row[m.deltaKey] as number
                return (
                  <>
                    <td key={`${m.key}-c`} className={`px-3 py-2.5 text-sm font-semibold text-gray-900 text-right whitespace-nowrap ${GROUP_COLORS[gi].border}`}>{m.fmt(cur)}</td>
                    <td key={`${m.key}-l`} className="px-3 py-2.5 text-sm text-gray-400 text-right whitespace-nowrap">{m.fmt(ly)}</td>
                    <td key={`${m.key}-d`} className="px-3 py-2.5 text-right whitespace-nowrap">
                      <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded ${trendBg(delta)}`}>
                        {delta === 0 ? <Minus size={9} /> : delta > 0 ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
                        {formatChangePct(delta)}
                      </span>
                    </td>
                  </>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Daily data table — grouped column headers matching the spreadsheet topology
// ---------------------------------------------------------------------------
const DAILY_GROUPS: { label: string; color: string; sub: string; cols: { label: string; fmt: (row: NutricostDailyRow) => string }[] }[] = [
  {
    label: 'ORDERS', color: 'bg-blue-800', sub: 'bg-blue-700',
    cols: [
      { label: 'Current',  fmt: r => formatNumber(r.orders) },
      { label: 'LY',       fmt: r => formatNumber(r.lyOrders) },
      { label: 'Δ%',       fmt: r => formatChangePct(r.ordersChangePct) },
    ],
  },
  {
    label: 'REVENUE', color: 'bg-emerald-800', sub: 'bg-emerald-700',
    cols: [
      { label: 'Current',  fmt: r => formatCurrencyCompact(r.revenue) },
      { label: 'LY',       fmt: r => formatCurrencyCompact(r.lyRevenue) },
      { label: 'Δ%',       fmt: r => formatChangePct(r.revenueChangePct) },
    ],
  },
  {
    label: 'SESSIONS', color: 'bg-violet-800', sub: 'bg-violet-700',
    cols: [
      { label: 'Current',  fmt: r => formatNumberCompact(r.sessions) },
      { label: 'LY',       fmt: r => formatNumberCompact(r.lySessions) },
      { label: 'Δ%',       fmt: r => formatChangePct(r.sessionsChangePct) },
    ],
  },
  {
    label: 'CONV. RATE', color: 'bg-amber-700', sub: 'bg-amber-600',
    cols: [
      { label: 'Current',  fmt: r => formatPercent(r.conversionRate) },
      { label: 'LY',       fmt: r => formatPercent(r.lyConversionRate) },
      { label: 'Δ%',       fmt: r => formatChangePct(r.crChangePct) },
    ],
  },
  {
    label: 'AOV', color: 'bg-rose-800', sub: 'bg-rose-700',
    cols: [
      { label: 'Current',  fmt: r => formatCurrency(r.aov) },
      { label: 'LY',       fmt: r => formatCurrency(r.lyAov) },
      { label: 'Δ%',       fmt: r => formatChangePct(r.aovChangePct) },
    ],
  },
]

function DeltaCell({ val }: { val: number }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded ${trendBg(val)}`}>
      {val === 0 ? <Minus size={8} /> : val > 0 ? <ChevronUp size={8} /> : <ChevronDown size={8} />}
      {formatChangePct(val)}
    </span>
  )
}

function GroupedDailyTable({ rows }: { rows: NutricostDailyRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          {/* Group label row */}
          <tr>
            <th rowSpan={2} className="bg-slate-800 text-slate-200 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-left border-r border-slate-700 align-middle whitespace-nowrap">
              Date
            </th>
            {DAILY_GROUPS.map((g) => (
              <th
                key={g.label}
                colSpan={3}
                className={`${g.color} text-white text-center text-[11px] font-bold uppercase tracking-widest py-2.5 border-l-2 border-white/20`}
              >
                {g.label}
              </th>
            ))}
          </tr>
          {/* Sub-header row */}
          <tr>
            {DAILY_GROUPS.map((g) =>
              g.cols.map((c) => (
                <th
                  key={`${g.label}-${c.label}`}
                  className={`${g.sub} text-white/80 text-center text-[10px] font-semibold uppercase tracking-wide py-2 px-3 first:border-l-2 first:border-white/20 whitespace-nowrap`}
                >
                  {c.label}
                </th>
              ))
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((row, ri) => (
            <tr key={row.date} className={`hover:bg-slate-50 transition-colors ${ri % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
              <td className="px-4 py-2 text-xs font-semibold text-gray-700 border-r border-gray-100 whitespace-nowrap bg-gray-50">
                {format(parseISO(row.date), 'EEE, MMM d')}
              </td>
              {/* Orders */}
              <td className="px-3 py-2 text-right text-xs font-semibold text-gray-900 border-l-2 border-blue-100 whitespace-nowrap">{formatNumber(row.orders)}</td>
              <td className="px-3 py-2 text-right text-xs text-gray-400 whitespace-nowrap">{formatNumber(row.lyOrders)}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap"><DeltaCell val={row.ordersChangePct} /></td>
              {/* Revenue */}
              <td className="px-3 py-2 text-right text-xs font-semibold text-gray-900 border-l-2 border-emerald-100 whitespace-nowrap">{formatCurrencyCompact(row.revenue)}</td>
              <td className="px-3 py-2 text-right text-xs text-gray-400 whitespace-nowrap">{formatCurrencyCompact(row.lyRevenue)}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap"><DeltaCell val={row.revenueChangePct} /></td>
              {/* Sessions */}
              <td className="px-3 py-2 text-right text-xs font-semibold text-gray-900 border-l-2 border-violet-100 whitespace-nowrap">{formatNumberCompact(row.sessions)}</td>
              <td className="px-3 py-2 text-right text-xs text-gray-400 whitespace-nowrap">{formatNumberCompact(row.lySessions)}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap"><DeltaCell val={row.sessionsChangePct} /></td>
              {/* CR */}
              <td className="px-3 py-2 text-right text-xs font-semibold text-gray-900 border-l-2 border-amber-100 whitespace-nowrap">{formatPercent(row.conversionRate)}</td>
              <td className="px-3 py-2 text-right text-xs text-gray-400 whitespace-nowrap">{formatPercent(row.lyConversionRate)}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap"><DeltaCell val={row.crChangePct} /></td>
              {/* AOV */}
              <td className="px-3 py-2 text-right text-xs font-semibold text-gray-900 border-l-2 border-rose-100 whitespace-nowrap">{formatCurrency(row.aov)}</td>
              <td className="px-3 py-2 text-right text-xs text-gray-400 whitespace-nowrap">{formatCurrency(row.lyAov)}</td>
              <td className="px-3 py-2 text-center whitespace-nowrap"><DeltaCell val={row.aovChangePct} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Revenue trend chart (last 60 days)
// ---------------------------------------------------------------------------
function RevenueTrend() {
  const chartData = mockNutricostDaily.slice(-60).map(r => ({
    label: format(parseISO(r.date), 'MMM d'),
    Revenue: r.revenue,
    'LY Revenue': r.lyRevenue,
  }))

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Revenue Trend — Last 60 Days vs LY</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={9} />
          <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10, fill: '#94a3b8' }} />
          <Tooltip
            formatter={(v) => [formatCurrency(Number(v))]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="Revenue" stroke="#005EB8" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="LY Revenue" stroke="#94a3b8" strokeWidth={1.5} dot={false} strokeDasharray="5 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function NutricostDaily() {
  const [showAllDaily, setShowAllDaily] = useState(false)
  const [activeTab, setActiveTab] = useState<'monthly' | 'weekly'>('monthly')

  const ytd = mockNutricostSummary[0]
  const snapshotRows = mockNutricostSummary.slice(2) // Latest Daily, Current Week, Current Month

  const dailyRows = useMemo(
    () => showAllDaily ? [...mockNutricostDaily].reverse() : [...mockNutricostDaily].slice(-30).reverse(),
    [showAllDaily]
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Nutricost Storewide Analytics" />

      <div className="p-6 space-y-8 max-w-[1600px]">

        {/* ── YTD Hero ── */}
        <YtdHero row={ytd} />

        {/* ── Period Snapshot Rows ── */}
        <section>
          <div className="flex items-baseline gap-3 mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Period Snapshots</h2>
            <span className="text-xs text-gray-400">Latest Daily · Current Week · Current Month</span>
          </div>
          {/* Column labels */}
          <div className="flex items-center mb-1">
            <div className="w-52 shrink-0" />
            <div className="flex-1 grid grid-cols-5">
              {METRICS.map(m => (
                <p key={m.key} className="px-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400">{m.label}</p>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {snapshotRows.map(row => (
              <PeriodSnapshotRow key={row.sectionLabel} row={row} />
            ))}
          </div>
        </section>

        {/* ── Revenue Trend Chart ── */}
        <RevenueTrend />

        {/* ── Monthly / Weekly Comparison Table ── */}
        <section>
          <div className="flex items-center gap-1 mb-3 border-b border-gray-200">
            {(['monthly', 'weekly'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'monthly' ? 'Monthly Comparison' : 'Weekly Comparison'}
              </button>
            ))}
          </div>
          <ComparisonTable rows={activeTab === 'monthly' ? mockNutricostMonthly : mockNutricostWeekly} />
        </section>

        {/* ── Daily Data Table ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Daily Data</h2>
              <span className="text-xs text-gray-400">
                {showAllDaily ? `All ${mockNutricostDaily.length} days` : 'Last 30 days'}
              </span>
            </div>
            <button
              onClick={() => setShowAllDaily(p => !p)}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              {showAllDaily ? 'Show last 30' : 'Show all'}
            </button>
          </div>
          <GroupedDailyTable rows={dailyRows} />
        </section>

      </div>
    </div>
  )
}
