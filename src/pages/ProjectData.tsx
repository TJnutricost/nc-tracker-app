import { useState, useMemo } from 'react'
import { Download } from 'lucide-react'
import TopBar from '../components/layout/TopBar'
import { mockProjectData, mockProjects } from '../data/mockData'
import { formatCurrency, formatPercent, formatNumber, getDeltaClass, getDeltaLabel, formatDate } from '../utils/formatters'
import type { ProjectDataRow } from '../types'

export default function ProjectData() {
  const [projectFilter, setProjectFilter] = useState('All')
  const [periodFilter, setPeriodFilter] = useState('All')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = useMemo(() => {
    return mockProjectData.filter(row => {
      if (projectFilter !== 'All' && row.projectId !== projectFilter) return false
      if (periodFilter !== 'All' && row.periodType !== periodFilter) return false
      if (dateFrom && row.date !== 'BASELINE' && row.date < dateFrom) return false
      if (dateTo && row.date !== 'BASELINE' && row.date > dateTo) return false
      return true
    })
  }, [projectFilter, periodFilter, dateFrom, dateTo])

  function exportCSV() {
    const headers = ['Project ID', 'Project Name', 'Date', 'Period', 'Sessions', 'Orders', 'Revenue', 'CR%', 'AOV', 'CR vs Baseline', 'AOV vs Baseline', 'Notes']
    const rows = filtered.map(r => [
      r.projectId, r.projectName, r.date, r.periodType,
      r.sessions ?? '', r.orders ?? '', r.revenue ?? '',
      r.conversionRate ?? '', r.aov ?? '',
      r.crVsBaseline ?? '', r.aovVsBaseline ?? '', r.notes ?? '',
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'project-data.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function rowClass(row: ProjectDataRow, idx: number) {
    if (row.periodType === 'Baseline') return 'bg-yellow-50 font-semibold'
    return idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
  }

  function deltaCell(val?: number) {
    return (
      <span className={`px-2 py-0.5 rounded text-xs ${getDeltaClass(val)}`}>
        {getDeltaLabel(val)}
      </span>
    )
  }

  return (
    <div>
      <TopBar title="Project Data" />
      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Projects</option>
            {mockProjects.map(p => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}
          </select>
          <select
            value={periodFilter}
            onChange={e => setPeriodFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {['All', 'Baseline', 'Daily', 'Weekly', 'Monthly', 'Current Avg'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={exportCSV}
            className="ml-auto flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Download size={15} />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {['Project ID', 'Project Name', 'Date', 'Period', 'Sessions', 'Orders', 'Revenue', 'CR%', 'AOV', 'CR vs Baseline', 'AOV vs Baseline', 'Notes'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((row, i) => (
                <tr key={i} className={`hover:bg-blue-50 transition-colors ${rowClass(row, i)}`}>
                  <td className="px-4 py-2.5 font-mono font-bold text-blue-700 text-sm whitespace-nowrap">{row.projectId}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-800 whitespace-nowrap">{row.projectName}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{formatDate(row.date)}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.periodType === 'Baseline' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-700'}`}>
                      {row.periodType}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{formatNumber(row.sessions)}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{formatNumber(row.orders)}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{formatCurrency(row.revenue)}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{formatPercent(row.conversionRate)}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">{formatCurrency(row.aov)}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{deltaCell(row.crVsBaseline)}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{deltaCell(row.aovVsBaseline)}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-500 max-w-[150px] truncate">{row.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">{filtered.length} rows</p>
      </div>
    </div>
  )
}
