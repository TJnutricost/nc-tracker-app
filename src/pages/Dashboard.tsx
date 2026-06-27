import { ShoppingCart, DollarSign, Users, TrendingUp } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import TopBar from '../components/layout/TopBar'
import MetricCard from '../components/ui/MetricCard'
import StatusBadge from '../components/ui/StatusBadge'
import DataTable, { type Column } from '../components/ui/DataTable'
import { mockProjects, mockNutricostDaily, mockProjectData } from '../data/mockData'
import { formatCurrency, formatPercent, formatNumber, getDeltaClass, getDeltaLabel, formatDate } from '../utils/formatters'
import type { ProjectDataRow } from '../types'

const activeProjects = mockProjects.filter(p => p.status === 'Active')
const latestDaily = mockNutricostDaily[mockNutricostDaily.length - 1]

const latestSnapshotMap: Record<string, ProjectDataRow> = {}
for (const row of mockProjectData) {
  if (row.periodType === 'Daily') {
    if (!latestSnapshotMap[row.projectId] || row.date > latestSnapshotMap[row.projectId].date) {
      latestSnapshotMap[row.projectId] = row
    }
  }
}
const latestSnapshots = Object.values(latestSnapshotMap) as unknown as Record<string, unknown>[]

const snapshotColumns: Column[] = [
  { key: 'projectId', label: 'Project', render: (v) => <span className="font-mono font-bold text-blue-700">{String(v)}</span> },
  { key: 'date', label: 'Date', render: (v) => formatDate(String(v)) },
  { key: 'sessions', label: 'Sessions', render: (v) => formatNumber(v as number) },
  { key: 'orders', label: 'Orders', render: (v) => formatNumber(v as number) },
  { key: 'revenue', label: 'Revenue', render: (v) => formatCurrency(v as number) },
  { key: 'conversionRate', label: 'CR%', render: (v) => formatPercent(v as number) },
  { key: 'aov', label: 'AOV', render: (v) => formatCurrency(v as number) },
  {
    key: 'crVsBaseline',
    label: 'CR vs Baseline',
    render: (v) => (
      <span className={`px-2 py-0.5 rounded text-xs ${getDeltaClass(v as number)}`}>
        {getDeltaLabel(v as number)}
      </span>
    ),
  },
]

const last30 = mockNutricostDaily.slice(-30)
const trendData = last30.map(row => {
  const skoffRow = mockProjectData.find(r => r.projectId === 'SKOFF' && r.date === row.date)
  const cfwRow = mockProjectData.find(r => r.projectId === 'CFW-G' && r.date === row.date)
  return {
    date: row.date,
    label: format(parseISO(row.date), 'MMM d'),
    'Storewide': row.revenue,
    'SKOFF': skoffRow?.revenue ?? null,
    'CFW-G': cfwRow?.revenue ?? null,
  }
})

export default function Dashboard() {
  return (
    <div>
      <TopBar title="Project Dashboard" />
      <div className="p-6 space-y-8">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Storewide Today</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Orders"
              value={formatNumber(latestDaily.orders)}
              subtitle={formatDate(latestDaily.date)}
              icon={<ShoppingCart size={20} className="text-blue-600" />}
              iconBg="bg-blue-100"
            />
            <MetricCard
              title="Revenue"
              value={formatCurrency(latestDaily.revenue)}
              subtitle={formatDate(latestDaily.date)}
              icon={<DollarSign size={20} className="text-green-600" />}
              iconBg="bg-green-100"
            />
            <MetricCard
              title="Sessions"
              value={formatNumber(latestDaily.sessions)}
              subtitle={formatDate(latestDaily.date)}
              icon={<Users size={20} className="text-purple-600" />}
              iconBg="bg-purple-100"
            />
            <MetricCard
              title="Conv. Rate"
              value={formatPercent(latestDaily.conversionRate)}
              subtitle={formatDate(latestDaily.date)}
              icon={<TrendingUp size={20} className="text-amber-600" />}
              iconBg="bg-amber-100"
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeProjects.map(project => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex overflow-hidden">
                <div className="w-1.5 bg-green-500 shrink-0" />
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono font-bold text-blue-700 text-sm">{project.id}</span>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="font-semibold text-gray-900 text-sm mb-2">{project.name}</p>
                  <div className="mb-2">
                    <StatusBadge status={project.projectType} type="type" />
                  </div>
                  <div className="flex gap-3 text-xs text-gray-600 mb-2">
                    <span>Project Data: {project.projectDataTracking === 'Yes' ? '✓' : '✗'}</span>
                    <span>Page Analytics: {project.pageAnalyticsTracking === 'Yes' ? '✓' : '✗'}</span>
                  </div>
                  {project.launchDate && (
                    <p className="text-xs text-gray-500">Launch: {formatDate(project.launchDate)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest Daily Snapshot</h2>
          <DataTable columns={snapshotColumns} data={latestSnapshots} />
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Trend — Last 30 Days</h2>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trendData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={4} />
                <YAxis tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [formatCurrency(v as number), '']} />
                <Legend />
                <Line type="monotone" dataKey="Storewide" stroke="#005EB8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="SKOFF" stroke="#16A34A" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                <Line type="monotone" dataKey="CFW-G" stroke="#9333EA" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

      </div>
    </div>
  )
}
