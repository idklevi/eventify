import { cn } from '@/utils/helpers'

// ─── Spinner ──────────────────────────────────────────────
export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn('animate-spin text-brand-600', className ?? 'w-6 h-6')} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  )
}

export function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Spinner className="w-10 h-10" />
    </div>
  )
}

/** Alias kept for backwards compat */
export function LoadingSpinner() {
  return <FullPageSpinner />
}

// ─── PageContainer ────────────────────────────────────────
export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in', className)}>
      {children}
    </div>
  )
}

// ─── ErrorAlert ───────────────────────────────────────────
export function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
      {message}
    </div>
  )
}

// ─── RoleBadge ────────────────────────────────────────────
export function RoleBadge({ role }: { role: string }) {
  const clean = role.replace('ROLE_', '')
  const colors: Record<string, string> = {
    ADMIN:     'bg-red-50 text-red-700',
    ORGANISER: 'bg-brand-50 text-brand-700',
    USER:      'bg-blue-50 text-blue-700',
  }
  return <span className={cn('badge', colors[clean] ?? 'bg-slate-100 text-slate-600')}>{clean}</span>
}

// ─── EmptyState ───────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center text-slate-400">
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-semibold text-slate-900 text-lg">{title}</h3>
        {description && <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">{description}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

const colorMap = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   value: 'text-blue-700' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-600',  value: 'text-green-700' },
  purple: { bg: 'bg-brand-50',  icon: 'text-brand-600',  value: 'text-brand-700' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', value: 'text-orange-700' },
  red:    { bg: 'bg-red-50',    icon: 'text-red-600',    value: 'text-red-700' },
}

export function StatCard({ label, value, icon, trend, color = 'blue' }: StatCardProps) {
  const c = colorMap[color]
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          <p className={cn('text-3xl font-bold mt-1', c.value)}>{value}</p>
          {trend && <p className="text-xs text-slate-400 mt-1">{trend}</p>}
        </div>
        <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0', c.bg)}>
          <span className={c.icon}>{icon}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────
interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}
export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        className="btn-secondary btn-sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        ← Previous
      </button>
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                p === page ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-surface-100'
              )}
            >
              {p + 1}
            </button>
          )
        })}
      </div>
      <button
        className="btn-secondary btn-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        Next →
      </button>
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────
export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('badge', className)}>{children}</span>
}

// ─── SectionHeader ────────────────────────────────────────
export function SectionHeader({
  title, subtitle, description, action
}: {
  title: string
  subtitle?: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="section-title">{title}</h2>
        {(subtitle || description) && (
          <p className="text-slate-500 mt-1 text-sm">{subtitle ?? description}</p>
        )}
      </div>
      {action}
    </div>
  )
}
