import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, Calendar, Users, TrendingUp, Edit, Trash2, Loader2 } from 'lucide-react'
import { eventService, userService } from '@/services/eventify'
import type { Event, OrganiserStats } from '@/types'
import { formatDate, cn } from '@/utils/helpers'
import { PageContainer, StatCard, EmptyState, LoadingSpinner, SectionHeader } from '@/components/ui/index'
import toast from 'react-hot-toast'

export default function OrganiserDashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [stats, setStats] = useState<OrganiserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      eventService.getAll({ size: 50 }),
      userService.getOrganiserStats(),
    ]).then(([page, s]) => {
      setEvents(page.content)
      setStats(s)
    }).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this event? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await eventService.delete(id)
      setEvents(prev => prev.filter(e => e.id !== id))
      toast.success('Event deleted')
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <PageContainer>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Organiser Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your events and track performance</p>
        </div>
        <Link to="/events/create" className="btn-primary">
          <PlusCircle className="w-4 h-4" /> Create Event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <StatCard label="Total Events" value={stats?.totalEvents ?? 0} icon={<Calendar className="w-5 h-5" />} color="purple" />
        <StatCard label="Total Registrations" value={stats?.totalRegistrations ?? 0} icon={<Users className="w-5 h-5" />} color="blue" />
        <StatCard label="Upcoming Events" value={stats?.upcomingEvents ?? 0} icon={<TrendingUp className="w-5 h-5" />} color="green" />
      </div>

      <SectionHeader title="Your Events" subtitle={`${events.length} event${events.length !== 1 ? 's' : ''} created`} />

      {loading ? (
        <LoadingSpinner />
      ) : events.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-8 h-8" />}
          title="No events yet"
          description="Create your first event to start accepting registrations."
          action={<Link to="/events/create" className="btn-primary"><PlusCircle className="w-4 h-4" /> Create Event</Link>}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  {['Event', 'Date', 'Location', 'Price', 'Registrations', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {events.map(event => (
                  <tr key={event.id} className="hover:bg-surface-50 transition-colors">
                    <td className="px-5 py-4">
                      <Link to={`/events/${event.id}`} className="font-medium text-slate-900 hover:text-brand-600 transition-colors">
                        {event.name}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{formatDate(event.date)}</td>
                    <td className="px-5 py-4 text-slate-500 max-w-[160px] truncate">{event.location}</td>
                    <td className="px-5 py-4">
                      {event.paid
                        ? <span className="badge badge-blue">${event.price}</span>
                        : <span className="badge badge-green">Free</span>
                      }
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {event.registrationCount}
                        {event.maxCapacity && <span className="text-slate-400 font-normal">/ {event.maxCapacity}</span>}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/events/${event.id}/edit`} className="btn-secondary btn-sm">
                          <Edit className="w-3.5 h-3.5" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(event.id)}
                          disabled={deletingId === event.id}
                          className="btn btn-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                        >
                          {deletingId === event.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
