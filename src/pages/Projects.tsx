import { useState } from 'react'
import { Search, Plus, Pencil, X } from 'lucide-react'
import TopBar from '../components/layout/TopBar'
import StatusBadge from '../components/ui/StatusBadge'
import { mockProjects } from '../data/mockData'
import { formatDate } from '../utils/formatters'
import type { Project } from '../types'

const emptyProject: Project = {
  id: '',
  name: '',
  status: 'Planned',
  projectType: 'New Sale Page',
  pageUrl: '',
  launchDate: '',
  endDate: '',
  projectDataTracking: 'Yes',
  pageAnalyticsTracking: 'No',
  projectDataBenchmarkSource: '',
  pageBenchmarkSource: '',
  baselineCalculated: 'No',
  notes: '',
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [filterStatus, setFilterStatus] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<Project>(emptyProject)

  const filtered = projects.filter(p => {
    if (filterStatus !== 'All' && p.status !== filterStatus) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
    }
    return true
  })

  function openAdd() {
    setEditingProject(null)
    setFormData(emptyProject)
    setShowModal(true)
  }

  function openEdit(p: Project) {
    setEditingProject(p)
    setFormData({ ...p })
    setShowModal(true)
  }

  function handleSave() {
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? formData : p))
    } else {
      setProjects(prev => [...prev, { ...formData, id: formData.id || `PROJ-${Date.now()}` }])
    }
    setShowModal(false)
  }

  function field(key: keyof Project, label: string, type = 'text', options?: string[]) {
    return (
      <div key={key}>
        <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
        {options ? (
          <select
            value={String(formData[key] ?? '')}
            onChange={e => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input
            type={type}
            value={String(formData[key] ?? '')}
            onChange={e => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>
    )
  }

  return (
    <div>
      <TopBar title="Projects" />
      <div className="p-6">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {['All', 'Active', 'Completed', 'Planned', 'Paused', 'Archived'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <div className="ml-auto">
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Add Project
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Project ID', 'Project Name', 'Type', 'Status', 'Launch Date', 'Project Data', 'Page Analytics', 'Baseline', 'Notes', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((p, i) => (
                <tr key={p.id} className={`hover:bg-blue-50 transition-colors ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                  <td className="px-4 py-2.5 font-mono font-bold text-blue-700 text-sm whitespace-nowrap">{p.id}</td>
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900 whitespace-nowrap">{p.name}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap"><StatusBadge status={p.projectType} type="type" /></td>
                  <td className="px-4 py-2.5 whitespace-nowrap"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{formatDate(p.launchDate)}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{p.projectDataTracking}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{p.pageAnalyticsTracking}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{p.baselineCalculated}</td>
                  <td className="px-4 py-2.5 text-sm text-gray-500 max-w-[180px] truncate">{p.notes}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingProject ? `Edit Project: ${editingProject.id}` : 'Add New Project'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {field('id', 'Project ID')}
              {field('name', 'Project Name')}
              {field('status', 'Status', 'text', ['Active', 'Planned', 'Paused', 'Completed', 'Inactive', 'Archived'])}
              {field('projectType', 'Project Type', 'text', ['New Sale Page', 'Existing Page Revamp', 'Evergreen / Ongoing Page', 'Sitewide Sale Only'])}
              {field('pageUrl', 'Page URL')}
              {field('launchDate', 'Launch Date', 'date')}
              {field('endDate', 'End Date', 'date')}
              {field('projectDataTracking', 'Project Data Tracking', 'text', ['Yes', 'No'])}
              {field('pageAnalyticsTracking', 'Page Analytics Tracking', 'text', ['Yes', 'No'])}
              {field('projectDataBenchmarkSource', 'Project Data Benchmark Source')}
              {field('pageBenchmarkSource', 'Page Benchmark Source')}
              {field('baselineCalculated', 'Baseline Calculated', 'text', ['Yes', 'No'])}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                <textarea
                  value={formData.notes ?? ''}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
