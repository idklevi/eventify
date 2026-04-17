import { Sun, Moon, Monitor } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { cn } from '@/utils/helpers'

type Theme = 'light' | 'dark' | 'system'

const OPTIONS: { value: Theme; icon: React.ReactNode; label: string }[] = [
  { value: 'light',  icon: <Sun  className="w-4 h-4" />, label: 'Light'  },
  { value: 'dark',   icon: <Moon className="w-4 h-4" />, label: 'Dark'   },
  { value: 'system', icon: <Monitor className="w-4 h-4" />, label: 'System' },
]

/**
 * Three-way toggle: Light / Dark / System.
 * Compact icon-only version for the Navbar.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  // Cycle through light → dark → system → light
  const handleClick = () => {
    const order: Theme[] = ['light', 'dark', 'system']
    const next = order[(order.indexOf(theme) + 1) % order.length]
    setTheme(next)
  }

  const current = OPTIONS.find(o => o.value === theme) ?? OPTIONS[0]

  return (
    <button
      onClick={handleClick}
      title={`Theme: ${current.label} — click to change`}
      aria-label="Toggle colour theme"
      className={cn(
        'btn-ghost btn-sm w-9 h-9 p-0 rounded-xl',
        'text-slate-500 dark:text-slate-400',
        'hover:bg-slate-100 dark:hover:bg-slate-800'
      )}
    >
      {current.icon}
    </button>
  )
}

/**
 * Full pill selector — use on a Settings/Profile page if preferred.
 */
export function ThemeSelector() {
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          title={opt.label}
          aria-label={`${opt.label} mode`}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            theme === opt.value
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          )}
        >
          {opt.icon}
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
