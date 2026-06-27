import { type ReactNode } from 'react'

export interface Column {
  key: string
  label: string
  render?: (val: unknown, row: Record<string, unknown>) => ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  className?: string
  rowClassName?: (row: Record<string, unknown>, idx: number) => string
}

export default function DataTable({ columns, data, className = '', rowClassName }: DataTableProps) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-gray-200 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400 text-sm">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className={`hover:bg-blue-50 transition-colors ${rowClassName ? rowClassName(row, idx) : idx % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}`}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-2.5 text-sm text-gray-800 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
