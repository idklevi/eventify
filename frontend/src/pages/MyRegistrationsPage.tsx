import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Ticket, Calendar, MapPin, Clock, XCircle, Loader2 } from 'lucide-react'
import { registrationService } from '@/services/eventify'
import type { Registration } from '@/types'
import { formatDate, formatDateTime, cn } from '@/utils/helpers'
import { LoadingSpinner, EmptyState, PageContainer, SectionHeader } from '@/components/ui/index'
import toast from 'react-hot-toast'

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<number | null>(null)

  useEffect(() => {
    registrationService.getMyRegistrations()
      .then(setRegistrations)
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id: number) => {
    if (!confirm('Cancel this registration?')) return
    setCancelling(id)
    try {
      await registrationService.cancel(id)
      setRegistrations(prev => prev.map(r => r.id === id
        ? { ...r, status: 'CANCELLED' as const }
        : r
      ))
      toast.success('Registration cancelled')
    } catch (e: any) {
      toast.error(e.message || 'Failed to cancel')
    } finally {
      setCancelling(null)
    }
  }

  const active = registrations.filter(r => r.status === 'CONFIRMED')
  const past = registrations.filter(r => r.status !== 'CONFIRMED')

  return (
    <PageContainer>
      <SectionHeader
        title="My Registrations"
        subtitle={`You have ${active.length} active registration${active.length !== 1 ? 's' : ''}`}
      />

      {loading ? (
        <LoadingSpinner />
      ) : registrations.length === 0 ? (
        <EmptyState
          icon={<Ticket className="w-8 h-8" />}
          title="No registrations yet"
          description="You haven't signed up for any events. Browse events to get started."
          action={<Link to="/events" className="btn-primary">Browse Events</Link>}
        />
      ) : (
        <div className="space-y-8">
          {/* Active */}
          {active.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Upcoming ({active.length})
              </h2>
              <div className="space-y-3">
                {active.map(reg => (
                  <RegistrationRow
                    key={reg.id}
                    reg={reg}
                    onCancel={handleCancel}
                    cancelling={cancelling === reg.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Past/Cancelled */}
          {past.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-500 mb-4">
                Past & Cancelled ({past.length})
              </h2>
              <div className="space-y-3 opacity-60">
                {past.map(reg => (
                  <RegistrationRow key={reg.id} reg={reg} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  )
}

function RegistrationRow({ reg, onCancel, cancelling }: {
  reg: Registration
  onCancel?: (id: number) => void
  cancelling?: boolean
}) {
  const event = reg.event
  const statusColors: Record<string, string> = {
    CONFIRMED: 'badge-green',
    CANCELLED: 'badge-red',
    WAITLISTED: 'badge-yellow',
  }

  return (
    <div className="card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Event image */}
      <div className="w-full sm:w-20 h-20 rounded-xl overflow-hidden bg-surface-100 shrink-0">
        <img
          src={event?.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200'}
          alt={event?.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/events/${event?.id}`}
            className="font-semibold text-slate-900 hover:text-brand-600 truncate transition-colors"
          >
            {event?.name ?? 'Event Deleted'}
          </Link>
          <span className={cn('badge shrink-0', statusColors[reg.status] ?? 'badge-gray')}>
            {reg.status}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          {event?.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-400" />
              {formatDate(event.date)}
            </span>
          )}
          {event?.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-400" />
              {event.location}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-300" />
            Registered {formatDateTime(reg.registrationTime)}
          </span>
        </div>
      </div>

      {/* Cancel */}
      {onCancel && reg.status === 'CONFIRMED' && (
        <button
          onClick={() => onCancel(reg.id)}
          disabled={cancelling}
          className="btn-outline btn-sm text-red-500 border-red-200 hover:bg-red-50 shrink-0"
        >
          {cancelling
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <XCircle className="w-3.5 h-3.5" />
          }
          Cancel
        </button>
      )}
    </div>
  )
}
