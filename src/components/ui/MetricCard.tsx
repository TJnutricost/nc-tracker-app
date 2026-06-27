import { type ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  trend?: number
  icon?: ReactNode
  iconBg?: string
}

export default function MetricCard({ title, value, subtitle, trend, icon, iconBg = 'bg-blue-100' }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center ml-3 shrink-0`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
