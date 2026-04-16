// ─── Auth ──────────────────────────────────────────────────
export interface AuthUser {
  id: number
  name: string
  email: string
  roles: string[]
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role: 'ROLE_USER' | 'ROLE_ORGANISER'
}

// ─── Event ─────────────────────────────────────────────────
export type EventCategory = 'MUSIC' | 'TECH' | 'SPORTS' | 'FOOD' | 'ART' | 'BUSINESS' | 'EDUCATION' | 'HEALTH' | 'OTHER'
export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED'

export interface Event {
  id: number
  name: string
  description: string
  location: string
  date: string
  startTime?: string
  endTime?: string
  imageUrl?: string
  category: EventCategory
  status: EventStatus
  paid: boolean
  price: number
  paymentDetails?: string
  volunteerInfo?: string
  maxCapacity?: number
  registrationCount: number
  atCapacity: boolean
  featured: boolean
  organiser?: OrganiserInfo
  createdAt: string
}

export interface OrganiserInfo {
  id: number
  name: string
  email: string
  profileImageUrl?: string
}

export interface EventRequest {
  name: string
  description: string
  location: string
  date: string
  startTime?: string
  endTime?: string
  imageUrl?: string
  category: EventCategory
  paid: boolean
  price: number
  paymentDetails?: string
  volunteerInfo?: string
  maxCapacity?: number
}

// ─── User ──────────────────────────────────────────────────
export interface User {
  id: number
  name: string
  email: string
  phoneNumber?: string
  bio?: string
  profileImageUrl?: string
  active: boolean
  roles: string[]
  createdAt: string
  eventCount: number
  registrationCount: number
}

export interface ProfileUpdateRequest {
  name?: string
  phoneNumber?: string
  bio?: string
  profileImageUrl?: string
}

// ─── Registration ──────────────────────────────────────────
export type RegistrationStatus = 'CONFIRMED' | 'CANCELLED' | 'WAITLISTED'

export interface Registration {
  id: number
  status: RegistrationStatus
  registrationTime: string
  event: Event
  userId: number
  userName: string
}

// ─── API ───────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  errors?: string[]
  timestamp: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

// ─── Stats ─────────────────────────────────────────────────
export interface AdminStats {
  totalUsers: number
  totalEvents: number
  upcomingEvents: number
  totalRegistrations: number
  totalOrganisers: number
}

export interface OrganiserStats {
  totalEvents: number
  totalRegistrations: number
  upcomingEvents: number
}

// ─── Filters ───────────────────────────────────────────────
export interface EventFilters {
  search?: string
  category?: EventCategory | ''
  location?: string
  dateFrom?: string
  dateTo?: string
  paid?: boolean | ''
  status?: EventStatus | ''
  page: number
  size: number
  sortBy: string
  sortDir: 'asc' | 'desc'
}
