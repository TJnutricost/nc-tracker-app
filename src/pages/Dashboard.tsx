import { format, parseISO } from 'date-fns'
import { CalendarClock, BarChart2, Activity, ChevronUp, ChevronDown, Minus, ExternalLink } from 'lucide-react'
import TopBar from '../components/layout/TopBar'
import StatusBadge from '../components/ui/StatusBadge'
import {
  mockProjects, mockProjectData, mockPageAnalytics,
  mockNutricostSummary, mockNutricostWeekly,
} from '../data/mockData'
import {
  formatCurrency, formatPercent, formatNumber,
  formatChangePct, formatDeltaPts, trendBg,
} from '../utils/formatters'
import type { ProjectDataRow, PageAnalyticsRow } from '../types'

// ---------------------------------------------------------------------------
// Derived data — mirrors Project Dashboard.html section logic
// ---------------------------------------------------------------------------

const activeProjects = mockProjects.filter(p => p.status === 'Active')

const latestProjectSnapshot: Record<string, ProjectDataRow> = {}
for (const row of mockProjectData) {
  if (row.periodType !== 'Daily') continue
  const prev = latestProjectSnapshot[row.projectId]
  if (!prev || row.date > prev.date) latestProjectSnapshot[row.projectId] = row
}

const latestPageSnapshot: Record<string, PageAnalyticsRow> = {}
for (const row of mockPageAnalytics) {
  if (row.periodType !== 'Daily') continue
  const prev = latestPageSnapshot[row.projectId]
  if (!prev || row.date > prev.date) latestPageSnapshot[row.projectId] = row
}

const baselineCR: Record<string, number> = {}
for (const row of mockPageAnalytics) {
  if (row.periodType === 'Baseline') baselineCR[row.projectId] = row.benchmarkCR ?? 0
}

const storeSummary = mockNutricostSummary[2] // LATEST DAILY SNAPSHOT

// ---------------------------------------------------------------------------
// Mini delta badge
// ---------------------------------------------------------------------------
function Delta({ val, mode = 'pct' }: { val?: number; mode?: 'pct' | 'pts' }) {
  if (val === undefined || val === null) return <span className="text-gray-400 text-xs">—</span>
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded ${trendBg(val)}`}>
      {val === 0 ? <Minus size={8} /> : val > 0 ? <ChevronUp size={8} /> : <ChevronDown size={8} />}
      {mode === 'pts' ? formatDeltaPts(val) : formatChangePct(val)}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Storewide KPI bar
// ---------------------------------------------------------------------------
function StorewideKpis() {
  const s = storeSummary
  const kpis = [
    { label: 'Orders',     value: formatNumber(s.orders),    ly: formatNumber(s.lyOrders),    delta: s.ordersChangePct },
    { label: 'Revenue',    value: formatCurrency(s.revenue), ly: formatCurrency(s.lyRevenue), delta: s.revenueChangePct },
    { label: 'Sessions',   value: formatNumber(s.sessions),  ly: formatNumber(s.lySessions),  delta: s.sessionsChangePct },
    { label: 'Conv. Rate', value: formatPercent(s.cr),       ly: formatPercent(s.lyCr),       delta: s.crChangePct },
    { label: 'AOV',        value: formatCurrency(s.aov),     ly: formatCurrency(s.lyAov),     delta: s.aovChangePct },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
        <Activity size={14} className="text-blue-600" />
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Latest Daily Snapshot — Storewide</span>
        <span className="ml-auto text-[11px] text-gray-400">{s.period}</span>
      </div>
      <div className="grid grid-cols-5 divide-x divide-gray-100">
        {kpis.map(k => (
          <div key={k.label} className="px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">{k.label}</p>
            <p className="text-xl font-bold text-gray-900">{k.value}</p>
            <p className="text-[11px] text-gray-400 mt-1">LY {k.ly}</p>
            <div className="mt-2"><Delta val={k.delta} /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Active Projects cards
// ---------------------------------------------------------------------------
function ActiveProjectsSection() {
  if (activeProjects.length === 0) {
    return <div className="text-sm text-gray-400 bg-white rounded-xl border border-gray-200 p-8 text-center">No active projects</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {activeProjects.map(proj => (
        <div key={proj.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex">
          <div className="w-1.5 shrink-0 bg-emerald-500" />
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <code className="text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">{proj.id}</code>
              <StatusBadge status={proj.status} />
            </div>
            <p className="font-semibold text-gray-900 text-sm mb-2 leading-snug">{proj.name}</p>
            <StatusBadge status={proj.projectType} type="type" />
            <div className="flex items-center gap-4 mt-3 text-[11px]">
              <span className={proj.projectDataTracking === 'Yes' ? 'text-emerald-600' : 'text-gray-300'}>
                <BarChart2 size={11} className="inline mr-0.5" />Project Data
              </span>
              <span className={proj.pageAnalyticsTracking === 'Yes' ? 'text-emerald-600' : 'text-gray-300'}>
                <Activity size={11} className="inline mr-0.5" />Page Analytics
              </span>
            </div>
            {proj.launchDate && (
              <p className="flex items-center gap-1 mt-2 text-[11px] text-gray-400">
                <CalendarClock size={11} />
                {format(parseISO(proj.launchDate), 'MMM d, yyyy')}
                {proj.endDate && ` → ${format(parseISO(proj.endDate), 'MMM d, yyyy')}`}
              </p>
            )}
            {proj.pageUrl && (
              <a
                href={proj.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 mt-1.5 text-[11px] text-blue-500 hover:underline truncate"
              >
                <ExternalLink size={10} />
                <span className="truncate">{proj.pageUrl.replace('https://nutricost.com', '')}</span>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Latest Project-Level Daily Snapshot
// ---------------------------------------------------------------------------
function LatestProjectSnapshot() {
  const rows = activeProjects
    .map(p => ({ project: p, data: latestProjectSnapshot[p.id] }))
    .filter(r => r.data)

  if (rows.length === 0)
    return <p className="text-sm text-gray-400 py-4">No project-level daily data yet.</p>

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {['Project', 'Date', 'Sessions', 'Orders', 'Revenue', 'CR%', 'AOV', 'CR vs Baseline'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map(({ project, data }) => (
            <tr key={project.id} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-2.5 whitespace-nowrap">
                <code className="text-xs font-bold text-blue-700">{project.id}</code>
                <span className="ml-2 text-xs text-gray-500">{project.name}</span>
              </td>
              <td className="px-4 py-2.5 text-xs text-gray-600 whitespace-nowrap">{format(parseISO(data.date), 'MMM d, yyyy')}</td>
              <td className="px-4 py-2.5 text-sm font-medium text-gray-900 whitespace-nowrap">{formatNumber(data.sessions)}</td>
              <td className="px-4 py-2.5 text-sm font-medium text-gray-900 whitespace-nowrap">{formatNumber(data.orders)}</td>
              <td className="px-4 py-2.5 text-sm font-medium text-gray-900 whitespace-nowrap">{formatCurrency(data.revenue)}</td>
              <td className="px-4 py-2.5 text-sm font-medium text-gray-900 whitespace-nowrap">{formatPercent(data.conversionRate)}</td>
              <td className="px-4 py-2.5 text-sm font-medium text-gray-900 whitespace-nowrap">{formatCurrency(data.aov)}</td>
              <td className="px-4 py-2.5 whitespace-nowrap"><Delta val={data.crVsBaseline} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Latest Page Daily Snapshot
// ---------------------------------------------------------------------------
function LatestPageSnapshot() {
  const rows = mockProjects
    .filter(p => p.pageAnalyticsTracking === 'Yes')
    .map(p => ({ project: p, data: latestPageSnapshot[p.id] }))
    .filter(r => r.data)

  if (rows.length === 0)
    return <p className="text-sm text-gray-400 py-4">No page analytics data yet.</p>

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {['Project', 'Page', 'Date', 'Sessions', 'Purchases', 'Page CR', 'Benchmark CR', 'CR vs Benchmark'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map(({ project, data }) => (
            <tr key={project.id} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-2.5 whitespace-nowrap">
                <code className="text-xs font-bold text-blue-700">{project.id}</code>
              </td>
              <td className="px-4 py-2.5 text-xs text-gray-600 whitespace-nowrap">{data.pageLabel}</td>
              <td className="px-4 py-2.5 text-xs text-gray-600 whitespace-nowrap">{format(parseISO(data.date), 'MMM d, yyyy')}</td>
              <td className="px-4 py-2.5 text-sm font-medium text-gray-900 whitespace-nowrap">{formatNumber(data.sessions)}</td>
              <td className="px-4 py-2.5 text-sm font-medium text-gray-900 whitespace-nowrap">{formatNumber(data.purchases)}</td>
              <td className="px-4 py-2.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{formatPercent(data.conversionRate)}</td>
              <td className="px-4 py-2.5 text-xs text-gray-400 whitespace-nowrap">{formatPercent(data.benchmarkCR)}</td>
              <td className="px-4 py-2.5 whitespace-nowrap"><Delta val={data.crVsBenchmark} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Current vs Benchmark
// ---------------------------------------------------------------------------
interface BenchmarkRow {
  project: typeof activeProjects[number]
  daysLive: number | null
  benchmarkCR: number
  currentCR: number
  crDeltaPts: number
  currentAOV: number | undefined
  pageCurrentCR: number | undefined
  pageBenchmarkCR: number | undefined
  pageCRDelta: number | undefined
}

function CurrentVsBenchmark() {
  const rows: BenchmarkRow[] = activeProjects.flatMap(p => {
    const latest = latestProjectSnapshot[p.id]
    const pageLat = latestPageSnapshot[p.id]
    if (!latest) return []
    const benchCR = baselineCR[p.id] ?? latest.conversionRate ?? 0
    const currentCR = latest.conversionRate ?? 0
    const crDeltaPts = currentCR - benchCR
    const launchD = p.launchDate ? new Date(p.launchDate) : null
    const daysLive = launchD ? Math.floor((Date.now() - launchD.getTime()) / 86400000) : null
    return [{ project: p, daysLive, benchmarkCR: benchCR, currentCR, crDeltaPts, currentAOV: latest.aov, pageCurrentCR: pageLat?.conversionRate, pageBenchmarkCR: pageLat?.benchmarkCR, pageCRDelta: pageLat?.crVsBenchmark }]
  })

  if (rows.length === 0)
    return <p className="text-sm text-gray-400 py-4">No active project data yet.</p>

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {['Project', 'Days Live', 'Benchmark CR', 'Current CR', 'CR vs Benchmark', 'Page CR', 'Page Benchmark', 'Page CR Δ', 'Current AOV'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map(row => (
            <tr key={row.project.id} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-2.5 whitespace-nowrap">
                <code className="text-xs font-bold text-blue-700">{row.project.id}</code>
                <span className="ml-2 text-xs text-gray-500">{row.project.name}</span>
              </td>
              <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{row.daysLive !== null ? `${row.daysLive}d` : '—'}</td>
              <td className="px-4 py-2.5 text-sm text-gray-400 whitespace-nowrap">{formatPercent(row.benchmarkCR)}</td>
              <td className="px-4 py-2.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{formatPercent(row.currentCR)}</td>
              <td className="px-4 py-2.5 whitespace-nowrap">
                <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded ${trendBg(row.crDeltaPts)}`}>
                  {row.crDeltaPts === 0 ? <Minus size={9} /> : row.crDeltaPts > 0 ? <ChevronUp size={9} /> : <ChevronDown size={9} />}
                  {formatDeltaPts(row.crDeltaPts)}
                </span>
              </td>
              <td className="px-4 py-2.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{formatPercent(row.pageCurrentCR)}</td>
              <td className="px-4 py-2.5 text-sm text-gray-400 whitespace-nowrap">{formatPercent(row.pageBenchmarkCR)}</td>
              <td className="px-4 py-2.5 whitespace-nowrap"><Delta val={row.pageCRDelta} /></td>
              <td className="px-4 py-2.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(row.currentAOV)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Store Weekly Rollup
// ---------------------------------------------------------------------------
function StoreWeeklyRollup() {
  const weeks = mockNutricostWeekly.slice(0, 4)
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {['Week', 'Orders', 'Revenue', 'Sessions', 'CR%', 'AOV', 'Rev Δ vs LY', 'Orders Δ vs LY'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {weeks.map((w, i) => (
            <tr key={i} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-2.5 text-xs font-semibold text-gray-700 whitespace-nowrap">{w.periodLabel}</td>
              <td className="px-4 py-2.5 text-sm font-medium text-gray-900 whitespace-nowrap">{formatNumber(w.orders)}</td>
              <td className="px-4 py-2.5 text-sm font-medium text-gray-900 whitespace-nowrap">{formatCurrency(w.revenue)}</td>
              <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{formatNumber(w.sessions)}</td>
              <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{formatPercent(w.cr)}</td>
              <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{formatCurrency(w.aov)}</td>
              <td className="px-4 py-2.5 whitespace-nowrap"><Delta val={w.revenueChangePct} /></td>
              <td className="px-4 py-2.5 whitespace-nowrap"><Delta val={w.ordersChangePct} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------
function Section({ icon, title, subtitle, children }: {
  icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-gray-400 flex items-center">{icon}</span>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</h2>
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>
      {children}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar title="Project Dashboard" />
      <div className="p-6 space-y-8 max-w-[1600px]">

        <StorewideKpis />

        <Section icon={<Activity size={14} />} title="Active Projects" subtitle={`${activeProjects.length} active`}>
          <ActiveProjectsSection />
        </Section>

        <Section icon={<BarChart2 size={14} />} title="Latest Daily Snapshot" subtitle="by project">
          <LatestProjectSnapshot />
        </Section>

        <Section icon={<Activity size={14} />} title="Latest Page Daily Snapshot">
          <LatestPageSnapshot />
        </Section>

        <Section icon={<ChevronUp size={14} />} title="Current vs Benchmark">
          <CurrentVsBenchmark />
        </Section>

        <Section icon={<CalendarClock size={14} />} title="Store Weekly Rollup" subtitle="last 4 weeks vs LY">
          <StoreWeeklyRollup />
        </Section>

      </div>
    </div>
  )
}
