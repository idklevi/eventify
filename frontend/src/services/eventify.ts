import api from './api'
import type {
  LoginRequest, RegisterRequest, AuthUser,
  Event, EventRequest, EventFilters,
  User, ProfileUpdateRequest,
  Registration, AdminStats, OrganiserStats,
  ApiResponse, PageResponse
} from '@/types'

// ─── Auth ──────────────────────────────────────────────────
export const authService = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthUser>>('/auth/login', data).then(r => r.data.data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<AuthUser>>('/auth/register', data).then(r => r.data.data),
}

// ─── Events ────────────────────────────────────────────────
export const eventService = {
  getAll: (filters: Partial<EventFilters> = {}) => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v !== undefined && v !== null)
    )
    return api.get<ApiResponse<PageResponse<Event>>>('/events', { params }).then(r => r.data.data)
  },

  getById: (id: number) =>
    api.get<ApiResponse<Event>>(`/events/${id}`).then(r => r.data.data),

  getFeatured: () =>
    api.get<ApiResponse<Event[]>>('/events/featured').then(r => r.data.data),

  create: (data: EventRequest) =>
    api.post<ApiResponse<Event>>('/events', data).then(r => r.data.data),

  update: (id: number, data: EventRequest) =>
    api.put<ApiResponse<Event>>(`/events/${id}`, data).then(r => r.data.data),

  delete: (id: number) =>
    api.delete<ApiResponse<void>>(`/events/${id}`).then(r => r.data),
}

// ─── Registrations ─────────────────────────────────────────
export const registrationService = {
  getMyRegistrations: () =>
    api.get<ApiResponse<Registration[]>>('/registrations/my').then(r => r.data.data),

  getEventRegistrations: (eventId: number) =>
    api.get<ApiResponse<Registration[]>>(`/registrations/event/${eventId}`).then(r => r.data.data),

  register: (eventId: number) =>
    api.post<ApiResponse<Registration>>(`/registrations/event/${eventId}`).then(r => r.data.data),

  cancel: (registrationId: number) =>
    api.delete<ApiResponse<void>>(`/registrations/${registrationId}`).then(r => r.data),
}

// ─── Users ─────────────────────────────────────────────────
export const userService = {
  getProfile: () =>
    api.get<ApiResponse<User>>('/profile').then(r => r.data.data),

  updateProfile: (data: ProfileUpdateRequest) =>
    api.put<ApiResponse<User>>('/profile', data).then(r => r.data.data),

  // Admin
  getAllUsers: (page = 0, size = 20) =>
    api.get<ApiResponse<PageResponse<User>>>('/admin/users', { params: { page, size } })
      .then(r => r.data.data),

  toggleStatus: (id: number) =>
    api.patch<ApiResponse<void>>(`/admin/users/${id}/toggle-status`).then(r => r.data),

  getAdminStats: () =>
    api.get<ApiResponse<AdminStats>>('/admin/stats').then(r => r.data.data),

  getOrganiserStats: () =>
    api.get<ApiResponse<OrganiserStats>>('/organiser/stats').then(r => r.data.data),
}
