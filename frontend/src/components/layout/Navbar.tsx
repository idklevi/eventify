import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Menu, X, Calendar, ChevronDown,
  User, LayoutDashboard, LogOut, Shield, PlusCircle, Ticket,
} from 'lucide-react'
import { useAuthStore, useCurrentUser, useIsAuthenticated, useIsAdmin, useIsOrganiser } from '@/store/authStore'
import { getInitials, cn } from '@/utils/helpers'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { logout }       = useAuthStore()
  const user             = useCurrentUser()
  const isAuthenticated  = useIsAuthenticated()
  const isAdmin          = useIsAdmin()
  const isOrganiser      = useIsOrganiser()
  const navigate         = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
    setDropdownOpen(false)
  }

  const navLinks = [
    { to: '/events', label: 'Browse Events' },
    ...(isOrganiser ? [{ to: '/organiser/dashboard', label: 'My Events'    }] : []),
    ...(!isOrganiser && isAuthenticated ? [{ to: '/my-registrations', label: 'My Tickets' }] : []),
    ...(isAdmin ? [{ to: '/admin/dashboard', label: 'Admin' }] : []),
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-600 dark:text-brand-400">
            <Calendar className="w-6 h-6" />
            <span>Eventify</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">

            {/* ── Theme toggle ── */}
            <ThemeToggle />

            {isAuthenticated && isOrganiser && (
              <Link to="/events/create" className="btn-primary btn-sm">
                <PlusCircle className="w-4 h-4" />
                Create Event
              </Link>
            )}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center text-sm font-semibold overflow-hidden">
                    {user?.profileImageUrl
                      ? <img src={user.profileImageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      : getInitials(user?.name || 'U')
                    }
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', dropdownOpen && 'rotate-180')} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-dropdown border border-slate-200 dark:border-slate-700 py-2 z-20 animate-slide-down">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <DropdownItem to="/dashboard"         icon={<LayoutDashboard className="w-4 h-4" />} onClick={() => setDropdownOpen(false)}>Dashboard</DropdownItem>
                      <DropdownItem to="/profile"           icon={<User            className="w-4 h-4" />} onClick={() => setDropdownOpen(false)}>Profile</DropdownItem>
                      {!isOrganiser && (
                        <DropdownItem to="/my-registrations" icon={<Ticket         className="w-4 h-4" />} onClick={() => setDropdownOpen(false)}>My Tickets</DropdownItem>
                      )}
                      {isAdmin && (
                        <DropdownItem to="/admin/dashboard"  icon={<Shield         className="w-4 h-4" />} onClick={() => setDropdownOpen(false)}>Admin Panel</DropdownItem>
                      )}
                      <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"    className="btn-ghost btn-sm">Sign in</Link>
                <Link to="/register" className="btn-primary btn-sm">Get started</Link>
              </div>
            )}
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-1 animate-slide-down">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => cn(
                'flex items-center px-4 py-2.5 rounded-xl text-sm font-medium',
                isActive
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                  : 'text-slate-600 dark:text-slate-300'
              )}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <>
              <NavLink to="/profile" className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300" onClick={() => setMenuOpen(false)}>Profile</NavLink>
              <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400">
                Sign out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login"    className="btn-secondary flex-1 text-center" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/register" className="btn-primary  flex-1 text-center" onClick={() => setMenuOpen(false)}>Sign up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

function DropdownItem({
  to, icon, children, onClick,
}: { to: string; icon: React.ReactNode; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      <span className="text-slate-400 dark:text-slate-500">{icon}</span>
      {children}
    </Link>
  )
}
