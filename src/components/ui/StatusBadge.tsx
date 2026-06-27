interface StatusBadgeProps {
  status: string
  type?: 'status' | 'type'
}

const statusColors: Record<string, string> = {
  'Active': 'bg-green-100 text-green-800',
  'Completed': 'bg-gray-100 text-gray-700',
  'Planned': 'bg-blue-100 text-blue-800',
  'Paused': 'bg-amber-100 text-amber-800',
  'Archived': 'bg-slate-100 text-slate-600',
  'Inactive': 'bg-slate-100 text-slate-600',
  'New Sale Page': 'bg-purple-100 text-purple-800',
  'Existing Page Revamp': 'bg-indigo-100 text-indigo-800',
  'Evergreen / Ongoing Page': 'bg-teal-100 text-teal-800',
  'Sitewide Sale Only': 'bg-orange-100 text-orange-800',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass = statusColors[status] ?? 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  )
}
