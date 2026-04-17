import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  /** The resolved value actually applied to <html> — never 'system' */
  resolvedTheme: 'light' | 'dark'
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  return resolved
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: getSystemTheme(),

      setTheme: (theme: Theme) => {
        const resolved = applyTheme(theme)
        set({ theme, resolvedTheme: resolved })
      },
    }),
    {
      name: 'eventify-theme',
      // Re-apply the persisted theme immediately after hydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          const resolved = applyTheme(state.theme)
          state.resolvedTheme = resolved
        }
      },
    }
  )
)

/** Call once at app startup to apply the saved theme before first render */
export function initTheme() {
  const stored = localStorage.getItem('eventify-theme')
  try {
    const parsed = JSON.parse(stored || '{}')
    applyTheme(parsed?.state?.theme ?? 'system')
  } catch {
    applyTheme('system')
  }

  // Keep in sync if the user changes system preference while app is open
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = useThemeStore.getState().theme
    if (currentTheme === 'system') {
      applyTheme('system')
      useThemeStore.setState({ resolvedTheme: getSystemTheme() })
    }
  })
}
