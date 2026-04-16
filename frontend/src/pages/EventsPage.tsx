import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { eventService } from '@/services/eventify'
import type { Event, EventFilters } from '@/types'
import EventCard from '@/components/events/EventCard'
import EventFiltersBar from '@/components/events/EventFiltersBar'
import { FullPageSpinner, EmptyState, Pagination, SectionHeader } from '@/components/ui'

const DEFAULT_FILTERS: EventFilters = {
  search: '', category: '', location: '', dateFrom: '', dateTo: '',
  paid: '', status: '', page: 0, size: 12, sortBy: 'date', sortDir: 'asc',
}

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState<EventFilters>({
    ...DEFAULT_FILTERS,
    category: (searchParams.get('category') as any) || '',
    search: searchParams.get('search') || '',
  })

  const fetchEvents = useCallback(async (f: EventFilters) => {
    setLoading(true)
    try {
      const result = await eventService.getAll(f)
      setEvents(result.content)
      setTotalPages(result.totalPages)
      setTotalElements(result.totalElements)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents(filters)
  }, [filters, fetchEvents])

  const handleFilterChange = (updates: Partial<EventFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }))
  }

  const handleReset = () => setFilters(DEFAULT_FILTERS)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SectionHeader
        title="Browse Events"
        description={!loading ? `${totalElements} event${totalElements !== 1 ? 's' : ''} found` : 'Finding events...'}
      />

      {/* Filters */}
      <div className="mb-8">
        <EventFiltersBar filters={filters} onChange={handleFilterChange} onReset={handleReset} />
      </div>

      {/* Grid */}
      {loading ? (
        <FullPageSpinner />
      ) : events.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-8 h-8" />}
          title="No events found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={
            <button onClick={handleReset} className="btn-primary">
              Clear Filters
            </button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            onPageChange={page => handleFilterChange({ page })}
          />
        </>
      )}
    </div>
  )
}
