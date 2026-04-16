import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Clock, Users, DollarSign, Heart, Edit, ArrowLeft, Share2 } from 'lucide-react'
import { eventService } from '@/services/eventify'
import { registrationService } from '@/services/eventify'
import type { Event } from '@/types'
import { useCurrentUser, useIsAuthenticated, useIsOrganiser } from '@/store/authStore'
import { formatDate, formatCurrency, CATEGORY_META } from '@/utils/helpers'
import { FullPageSpinner, EmptyState } from '@/components/ui'
import toast from 'react-hot-toast'

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [registered, setRegistered] = useState(false)

  const user = useCurrentUser()
  const isAuthenticated = useIsAuthenticated()
  const isOrganiser = useIsOrganiser()
  const navigate = useNavigate()

  const isOwner = isOrganiser && event?.organiser?.email === user?.email

  useEffect(() => {
    if (!id) return
    eventService.getById(Number(id))
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleRegister = async () => {
    if (!isAuthenticated) { navigate('/login'); return }
    setRegistering(true)
    try {
      await registrationService.register(Number(id))
      setRegistered(true)
      setEvent(prev => prev ? { ...prev, registrationCount: prev.registrationCount + 1 } : prev)
      toast.success('Successfully registered! 🎉')
    } catch (err: any) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  if (loading) return <FullPageSpinner />
  if (!event) return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <EmptyState title="Event not found" description="This event may have been removed." action={<Link to="/events" className="btn-primary">Browse Events</Link>} />
    </div>
  )

  const cat = CATEGORY_META[event.category] ?? CATEGORY_META.OTHER
  const capacityPct = event.maxCapacity ? Math.min(100, Math.round((event.registrationCount / event.maxCapacity) * 100)) : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link to="/events" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero image */}
          <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 bg-surface-200">
            <img
              src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
              alt={event.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200' }}
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`badge ${cat.color}`}>{cat.emoji} {cat.label}</span>
              {event.featured && <span className="badge bg-yellow-400 text-yellow-900">⭐ Featured</span>}
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              {isOwner && (
                <Link to={`/events/${event.id}/edit`} className="btn btn-sm bg-white/90 text-slate-700 hover:bg-white shadow">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </Link>
              )}
              <button onClick={handleShare} className="btn btn-sm bg-white/90 text-slate-700 hover:bg-white shadow">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title & description */}
          <div className="card p-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{event.name}</h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { icon: Calendar, label: 'Date', value: formatDate(event.date, 'EEE, dd MMM yyyy') },
                { icon: Clock,    label: 'Time', value: event.startTime ? `${event.startTime.slice(0,5)}${event.endTime ? ' – ' + event.endTime.slice(0,5) : ''}` : 'TBD' },
                { icon: MapPin,   label: 'Location', value: event.location },
                { icon: Users,    label: 'Attendees', value: `${event.registrationCount}${event.maxCapacity ? ` / ${event.maxCapacity}` : ''}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col gap-1 p-3 rounded-xl bg-surface-50">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{label}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
                </div>
              ))}
            </div>

            {event.description && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">About this event</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </div>
            )}
          </div>

          {/* Volunteer info */}
          {event.volunteerInfo && (
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" /> Volunteer Opportunities
              </h3>
              <p className="text-slate-600 leading-relaxed">{event.volunteerInfo}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Registration card */}
          <div className="card p-6 sticky top-24 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Price</p>
                <p className="text-3xl font-bold text-slate-900 mt-0.5">
                  {event.paid ? formatCurrency(event.price) : <span className="text-green-600">Free</span>}
                </p>
              </div>
              {event.atCapacity && <span className="badge-red text-sm font-semibold">Sold Out</span>}
            </div>

            {/* Capacity bar */}
            {capacityPct !== null && (
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>{event.registrationCount} registered</span>
                  <span>{event.maxCapacity! - event.registrationCount} spots left</span>
                </div>
                <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${capacityPct}%` }} />
                </div>
              </div>
            )}

            {/* Action button */}
            {isOwner ? (
              <Link to={`/events/${event.id}/edit`} className="btn-secondary w-full justify-center">
                <Edit className="w-4 h-4" /> Edit Event
              </Link>
            ) : registered ? (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
                <p className="text-green-700 font-semibold text-sm">✅ You're registered!</p>
                <Link to="/my-registrations" className="text-xs text-green-600 hover:underline mt-1 block">View my tickets</Link>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={event.atCapacity || registering}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50"
              >
                {registering ? 'Registering...' : event.atCapacity ? 'Sold Out' : isAuthenticated ? `Register ${event.paid ? '— ' + formatCurrency(event.price) : '(Free)'}` : 'Sign in to Register'}
              </button>
            )}

            {event.paid && event.paymentDetails && (
              <p className="text-xs text-slate-500 text-center">{event.paymentDetails}</p>
            )}

            {/* Organiser */}
            {event.organiser && (
              <div className="pt-4 border-t border-surface-200">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-3">Organised by</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center">
                    {event.organiser.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{event.organiser.name}</p>
                    <p className="text-xs text-slate-500">{event.organiser.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
