import { useEffect, useState } from 'react'
import { Users, Calendar, Ticket, Building2, ToggleLeft, ToggleRight, Shield } from 'lucide-react'
import { userService } from '@/services/eventify'
import type { User, AdminStats } from '@/types'
import { formatDate, cn } from '@/utils/helpers'
import { PageContainer, StatCard, RoleBadge, LoadingSpinner, SectionHeader } from '@/components/ui/index'
import toast from 'react-hot-toast'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<number | null>(null)

  useEffect(() => {
    Promise.all([
      userService.getAdminStats(),
      userService.getAllUsers(),
    ]).then(([s, page]) => {
      setStats(s)
      setUsers(page.content)
    }).finally(() => setLoading(false))
  }, [])

  const handleToggleStatus = async (id: number) => {
    setTogglingId(id)
    try {
      await userService.toggleStatus(id)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u))
      toast.success('User status updated')
    } catch (e: any) {
      toast.error(e.message || 'Failed to update status')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-0.5">Platform overview and user management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard label="Total Users" value={stats?.totalUsers ?? 0} icon={<Users className="w-5 h-5" />} color="blue" />
        <StatCard label="Total Events" value={stats?.totalEvents ?? 0} icon={<Calendar className="w-5 h-5" />} color="purple" />
        <StatCard label="Registrations" value={stats?.totalRegistrations ?? 0} icon={<Ticket className="w-5 h-5" />} color="green" />
        <StatCard label="Organisers" value={stats?.totalOrganisers ?? 0} icon={<Building2 className="w-5 h-5" />} color="orange" />
      </div>

      {/* Upcoming vs total */}
      {stats && (
        <div className="card p-5 mb-8 flex flex-wrap items-center gap-6">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Upcoming Events</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-48 bg-surface-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full"
                  style={{ width: stats.totalEvents ? `${(stats.upcomingEvents / stats.totalEvents) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {stats.upcomingEvents} / {stats.totalEvents}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Users table */}
      <SectionHeader
        title="All Users"
        subtitle={`${users.length} registered users`}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  {['User', 'Email', 'Role', 'Events', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {users.map(user => (
                  <tr key={user.id} className={cn('transition-colors', user.active ? 'hover:bg-surface-50' : 'bg-red-50/30 hover:bg-red-50/50')}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {user.name[0]}
                        </div>
                        <span className="font-medium text-slate-900 whitespace-nowrap">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{user.email}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map(r => <RoleBadge key={r} role={r} />)}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-700 font-medium text-center">{user.eventCount}</td>
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className={cn('badge', user.active ? 'badge-green' : 'badge-red')}>
                        {user.active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        disabled={togglingId === user.id}
                        className={cn(
                          'btn btn-sm border whitespace-nowrap',
                          user.active
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-100'
                        )}
                      >
                        {user.active
                          ? <><ToggleLeft className="w-3.5 h-3.5" /> Suspend</>
                          : <><ToggleRight className="w-3.5 h-3.5" /> Activate</>
                        }
                      </button>
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
