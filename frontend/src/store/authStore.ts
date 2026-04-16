import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '@/types'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (user: AuthUser) => void
  logout: () => void
  updateUser: (updates: Partial<AuthUser>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user) => {
        localStorage.setItem('token', user.token)
        set({ user, token: user.token, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'eventify-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)

// Helper hooks
export const useCurrentUser = () => useAuthStore((s) => s.user)
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated)
export const useHasRole = (role: string) =>
  useAuthStore((s) => s.user?.roles?.includes(role) ?? false)
export const useIsAdmin = () => useHasRole('ROLE_ADMIN')
export const useIsOrganiser = () =>
  useAuthStore((s) =>
    s.user?.roles?.some(r => r === 'ROLE_ORGANISER' || r === 'ROLE_ADMIN') ?? false
  )
