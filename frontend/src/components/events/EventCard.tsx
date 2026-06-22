import { Link } from 'react-router-dom'
import { MapPin, Calendar, Users, Clock } from 'lucide-react'
import type { Event } from '@/types'
import { formatDate, formatCurrency, CATEGORY_META, cn } from '@/utils/helpers'

interface EventCardProps {
  event: Event
  className?: string
}

export default function EventCard({ event, className }: EventCardProps) {
  const cat = CATEGORY_META[event.category] ?? CATEGORY_META.OTHER
  const isFull = event.atCapacity
  const capacityPct = event.maxCapacity
    ? Math.min(100, Math.round((event.registrationCount / event.maxCapacity) * 100))
    : null

  return (
    <Link
      to={`/events/${event.id}`}
      className={cn(
        'card group flex flex-col overflow-hidden transition-all duration-200',
        'hover:shadow-card-hover hover:-translate-y-0.5 border border-slate-800 bg-slate-900/40 backdrop-blur-sm',
        className
      )}
    >
      {/* Image */}
      <div className="relative h-48 bg-slate-950 overflow-hidden">
        <img
          src={event.imageUrl || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80`}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80'
          }}
        />
        {/* Overlays */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={cn('badge', cat.color)}>
            {cat.emoji} {cat.label}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {event.paid
            ? <span className="badge bg-slate-800/90 text-slate-200 font-semibold shadow-sm">{formatCurrency(event.price)}</span>
            : <span className="badge bg-green-500/20 text-green-300 border border-green-500/30 font-semibold">Free</span>
          }
        </div>
        {isFull && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">SOLD OUT</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-semibold text-white line-clamp-2 group-hover:text-brand-400 transition-colors">
            {event.name}
          </h3>
          {event.description && (
            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{event.description}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-slate-400 mt-auto">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-400 shrink-0" />
            {formatDate(event.date)}
            {event.startTime && (
              <span className="flex items-center gap-1 ml-1">
                <Clock className="w-3.5 h-3.5" />
                {event.startTime.slice(0, 5)}
              </span>
            )}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </span>
        </div>

        {/* Capacity bar */}
        {capacityPct !== null && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {event.registrationCount} / {event.maxCapacity}
              </span>
              <span className={cn(capacityPct >= 90 ? 'text-red-400' : capacityPct >= 70 ? 'text-orange-400' : 'text-green-400')}>
                {capacityPct}% full
              </span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  capacityPct >= 90 ? 'bg-red-500' : capacityPct >= 70 ? 'bg-orange-500' : 'bg-green-500'
                )}
                style={{ width: `${capacityPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Organiser */}
        {event.organiser && (
          <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-900/40 text-brand-300 text-xs font-bold flex items-center justify-center">
              {event.organiser.name[0]}
            </div>
            <span className="text-xs text-slate-400">by <span className="font-medium text-slate-300">{event.organiser.name}</span></span>
          </div>
        )}
      </div>
    </Link>
  )
}
