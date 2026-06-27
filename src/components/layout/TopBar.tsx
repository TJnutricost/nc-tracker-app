import { RefreshCw } from 'lucide-react'

interface TopBarProps {
  title: string
}

export default function TopBar({ title }: TopBarProps) {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <RefreshCw size={14} />
          <span>Last refreshed: Jun 27, 2026 8:42 AM</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
          TJ
        </div>
      </div>
    </div>
  )
}
