import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, Table2, BarChart3, TrendingUp, Settings } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/projects', label: 'Projects', icon: FolderKanban, exact: false },
  { to: '/project-data', label: 'Project Data', icon: Table2, exact: false },
  { to: '/page-analytics', label: 'Page Analytics', icon: BarChart3, exact: false },
  { to: '/nutricost', label: 'Nutricost Daily', icon: TrendingUp, exact: false },
  { to: '/settings', label: 'Settings', icon: Settings, exact: false },
]

export default function Sidebar() {
  return (
    <div className="w-60 min-h-screen bg-slate-800 flex flex-col fixed left-0 top-0 bottom-0 z-10">
      <div className="px-5 py-6 border-b border-slate-700">
        <div className="text-white text-xl font-bold tracking-tight">NC Tracker</div>
        <div className="text-blue-400 text-xs font-medium mt-0.5">Nutricost</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-slate-700">
        <p className="text-slate-500 text-xs">© 2026 Nutricost</p>
      </div>
    </div>
  )
}
