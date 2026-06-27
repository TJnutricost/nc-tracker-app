import { type ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  message: string
  icon?: ReactNode
}

export default function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <div className="mb-3 text-gray-300">
        {icon ?? <Inbox size={48} />}
      </div>
      <p className="text-sm">{message}</p>
    </div>
  )
}
