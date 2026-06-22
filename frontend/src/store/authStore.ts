import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthUser } from '@/types'

// ── Role constants ─────────────────────────────────────────
export const ROLES = {
  USER:      'ROLE_USER',
  ORGANISER: 'ROLE_ORGANISER',
  ADMIN:     'ROLE_ADMIN',
} as const
export type Role = typeof ROLES[keyof typeof ROLES]

// ── State shape ────────────────────────────────────────────
interface AuthState {
  user:            AuthUser | null
  token:           string | null
  isAuthenticated: boolean

  /** Call this right after authService.login() or authService.register() succeeds. */
  login:      (user: AuthUser) => void
  logout:     () => void
  /** Merge partial profile updates without a full re-login. */
  updateUser: (updates: Partial<AuthUser>) => void
}

// ── Store ──────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,

      login: (user) => {
        if (!user?.token) {
          console.error('[authStore] login() called without a token — ignoring.')
          return
        }

        // Belt-and-suspenders: also write to a flat key so api.ts can
        // read it synchronously before Zustand's persist has hydrated.
        localStorage.setItem('token', user.token)

        // Sanitize roles upon initial login
        if (user.roles) {
          user.roles = user.roles.map((r: string) => {
            const roleUpper = r.toUpperCase()
            if (roleUpper === 'ROLE_USER' || roleUpper === 'USER') return 'ROLE_USER'
            if (roleUpper === 'ROLE_ORGANISER' || roleUpper === 'ORGANISER') return 'ROLE_ORGANISER'
            if (roleUpper === 'ROLE_ADMIN' || roleUpper === 'ADMIN') return 'ROLE_ADMIN'
            return r
          })
        }

        set({
          user,
          token:           user.token,
          isAuthenticated: true,
        })
      },

      logout: () => {
        localStorage.removeItem('token')
        // The persist middleware will overwrite 'auth-storage' on the
        // next tick, but clear it immediately for instant effect.
        localStorage.removeItem('auth-storage')

        set({
          user:            null,
          token:           null,
          isAuthenticated: false,
        })
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),

    {
      name:    'auth-storage',
      storage: createJSONStorage(() => localStorage),

      // Persist the full auth slice; nothing is excluded because
      // isAuthenticated must survive a page refresh.
      partialize: (state): Pick<AuthState, 'user' | 'token' | 'isAuthenticated'> => ({
        user:            state.user,
        token:           state.token,
        isAuthenticated: state.isAuthenticated,
      }),

      // After rehydration, validate that the token still exists.
      // If someone manually deleted localStorage['token'] but the Zustand
      // key still says isAuthenticated:true, reset to logged-out.
      onRehydrateStorage: () => (state) => {
        if (!state) return
        if (state.isAuthenticated && !state.token) {
          state.isAuthenticated = false
          state.user = null
        }
        // Map user principal roles explicitly against Spring Boot's authorities
        if (state.user && state.user.roles) {
          state.user.roles = state.user.roles.map((r: string) => {
            const roleUpper = r.toUpperCase()
            if (roleUpper === 'ROLE_USER' || roleUpper === 'USER') return 'ROLE_USER'
            if (roleUpper === 'ROLE_ORGANISER' || roleUpper === 'ORGANISER') return 'ROLE_ORGANISER'
            if (roleUpper === 'ROLE_ADMIN' || roleUpper === 'ADMIN') return 'ROLE_ADMIN'
            return r
          })
        }
        // Sync the flat token key so api.ts reads it correctly.
        if (state.token) {
          localStorage.setItem('token', state.token)
        }
      },
    }
  )
)

// ── Selector hooks ─────────────────────────────────────────

/** The full AuthUser object, or null if logged out. */
export const useCurrentUser = () => useAuthStore((s) => s.user)

/** True when a valid token is present and the user is authenticated. */
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated)

/** True when the user holds the given role string exactly. */
export const useHasRole = (role: Role) =>
  useAuthStore((s) => s.user?.roles?.includes(role) ?? false)

/** True for ROLE_ADMIN only. */
export const useIsAdmin = () => useHasRole(ROLES.ADMIN)

/**
 * True for ROLE_ORGANISER OR ROLE_ADMIN.
 * Admins inherit organiser privileges for event management routes.
 */
export const useIsOrganiser = () =>
  useAuthStore((s) =>
    s.user?.roles?.some(r => r === ROLES.ORGANISER || r === ROLES.ADMIN) ?? false
  )

/**
 * Returns the user's primary display role as a human-readable label.
 * Useful for dashboard routing decisions.
 */
export const useDisplayRole = (): 'Admin' | 'Organiser' | 'User' | null =>
  useAuthStore((s) => {
    const roles = s.user?.roles ?? []
    if (roles.includes(ROLES.ADMIN))     return 'Admin'
    if (roles.includes(ROLES.ORGANISER)) return 'Organiser'
    if (roles.includes(ROLES.USER))      return 'User'
    return null
  })