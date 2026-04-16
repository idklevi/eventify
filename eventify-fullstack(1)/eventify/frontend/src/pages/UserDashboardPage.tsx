// ─── UserDashboardPage.tsx ────────────────────────────────
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Ticket, User, ArrowRight } from 'lucide-react'
import { registrationService, userService } from '@/services/eventify'
import type { Registration, User as UserType } from '@/types'
import { useCurrentUser, useIsOrganiser, useIsAdmin } from '@/store/authStore'
import { formatDate, cn } from '@/utils/helpers'
import { StatCard, FullPageSpinner, SectionHeader } from '@/components/ui'

export default function UserDashboardPage() {
  const user = useCurrentUser()
  const isOrganiser = useIsOrganiser()
  const isAdmin = useIsAdmin()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [profile, setProfile] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      registrationService.getMyRegistrations(),
      userService.getProfile(),
    ]).then(([regs, prof]) => {
      setRegistrations(regs)
      setProfile(prof)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <FullPageSpinner />

  const upcoming = registrations.filter(r => r.status === 'CONFIRMED')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your events</p>
      </div>

      {/* Quick links for other roles */}
      {isOrganiser && (
        <div className="card p-4 mb-8 flex items-center justify-between bg-brand-50 border-brand-200">
          <p className="text-brand-800 font-medium">You're an organiser! Manage your events from the dashboard.</p>
          <Link to="/organiser/dashboard" className="btn-primary btn-sm">Organiser Dashboard <ArrowRight className="w-4 h-4" /></Link>
        </div>
      )}
      {isAdmin && (
        <div className="card p-4 mb-8 flex items-center justify-between bg-red-50 border-red-200">
          <p className="text-red-800 font-medium">You have admin access.</p>
          <Link to="/admin/dashboard" className="btn btn-sm bg-red-600 text-white hover:bg-red-700">Admin Panel <ArrowRight className="w-4 h-4" /></Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total Registrations" value={registrations.length} icon={<Ticket className="w-5 h-5" />} color="blue" />
        <StatCard label="Upcoming Events" value={upcoming.length} icon={<Calendar className="w-5 h-5" />} color="green" />
        <StatCard label="Account Status" value="Active" icon={<User className="w-5 h-5" />} color="purple" />
      </div>

      {/* Recent registrations */}
      <SectionHeader
        title="My Registrations"
        action={<Link to="/my-registrations" className="btn-secondary btn-sm">View all</Link>}
      />
      {registrations.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-slate-500 mb-4">You haven't registered for any events yet.</p>
          <Link to="/events" className="btn-primary">Browse Events</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-50 border-b border-surface-200">
              <tr>
                {['Event', 'Date', 'Location', 'Status'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200">
              {registrations.slice(0, 5).map(reg => (
                <tr key={reg.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <Link to={`/events/${reg.event?.id}`} className="hover:text-brand-600">{reg.event?.name ?? 'Deleted'}</Link>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{reg.event ? formatDate(reg.event.date) : '—'}</td>
                  <td className="px-6 py-4 text-slate-500">{reg.event?.location ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span className={cn('badge', reg.status === 'CONFIRMED' ? 'badge-green' : reg.status === 'CANCELLED' ? 'badge-red' : 'badge-yellow')}>
                      {reg.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
