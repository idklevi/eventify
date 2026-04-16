import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { EventFilters, EventCategory } from '@/types'
import { CATEGORY_META, EVENT_CATEGORIES, cn } from '@/utils/helpers'

interface EventFiltersProps {
  filters: EventFilters
  onChange: (filters: Partial<EventFilters>) => void
  onReset: () => void
}

export default function EventFiltersBar({ filters, onChange, onReset }: EventFiltersProps) {
  const hasActive = !!(filters.search || filters.category || filters.location || filters.dateFrom || filters.dateTo || filters.paid !== '')

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search events by name, description, or location..."
          className="input pl-12 pr-4 py-3 text-base"
          value={filters.search || ''}
          onChange={e => onChange({ search: e.target.value, page: 0 })}
        />
        {filters.search && (
          <button onClick={() => onChange({ search: '', page: 0 })} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <SlidersHorizontal className="w-4 h-4" />
          Filters:
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange({ category: '', page: 0 })}
            className={cn(
              'badge cursor-pointer transition-all',
              !filters.category ? 'bg-brand-600 text-white' : 'badge-gray hover:bg-surface-200'
            )}
          >
            All
          </button>
          {EVENT_CATEGORIES.map(cat => {
            const meta = CATEGORY_META[cat]
            return (
              <button
                key={cat}
                onClick={() => onChange({ category: cat as EventCategory, page: 0 })}
                className={cn(
                  'badge cursor-pointer transition-all',
                  filters.category === cat ? 'bg-brand-600 text-white' : cn('hover:bg-surface-200', meta.color)
                )}
              >
                {meta.emoji} {meta.label}
              </button>
            )
          })}
        </div>

        {/* Paid filter */}
        <select
          className="input !w-auto !py-1.5 text-sm"
          value={String(filters.paid)}
          onChange={e => onChange({ paid: e.target.value === '' ? '' : e.target.value === 'true', page: 0 })}
        >
          <option value="">All prices</option>
          <option value="false">Free only</option>
          <option value="true">Paid only</option>
        </select>

        {/* Sort */}
        <select
          className="input !w-auto !py-1.5 text-sm"
          value={`${filters.sortBy}-${filters.sortDir}`}
          onChange={e => {
            const [sortBy, sortDir] = e.target.value.split('-')
            onChange({ sortBy, sortDir: sortDir as 'asc' | 'desc', page: 0 })
          }}
        >
          <option value="date-asc">Date: Soonest</option>
          <option value="date-desc">Date: Latest</option>
          <option value="name-asc">Name: A–Z</option>
          <option value="createdAt-desc">Newest</option>
        </select>

        {hasActive && (
          <button onClick={onReset} className="btn-ghost btn-sm text-red-500 hover:bg-red-50">
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
