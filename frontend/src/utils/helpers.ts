import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import type { EventCategory, EventStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string, fmt = 'dd MMM yyyy') {
  try { return format(parseISO(dateStr), fmt) } catch { return dateStr }
}

export function formatDateTime(dateStr: string) {
  try { return format(parseISO(dateStr), 'dd MMM yyyy, HH:mm') } catch { return dateStr }
}

export function timeAgo(dateStr: string) {
  try { return formatDistanceToNow(parseISO(dateStr), { addSuffix: true }) } catch { return '' }
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export const CATEGORY_META: Record<EventCategory, { label: string; emoji: string; color: string }> = {
  MUSIC:     { label: 'Music',     emoji: '🎵', color: 'bg-purple-50 text-purple-700' },
  TECH:      { label: 'Tech',      emoji: '💻', color: 'bg-blue-50 text-blue-700' },
  SPORTS:    { label: 'Sports',    emoji: '⚽', color: 'bg-green-50 text-green-700' },
  FOOD:      { label: 'Food',      emoji: '🍕', color: 'bg-orange-50 text-orange-700' },
  ART:       { label: 'Art',       emoji: '🎨', color: 'bg-pink-50 text-pink-700' },
  BUSINESS:  { label: 'Business',  emoji: '💼', color: 'bg-slate-100 text-slate-700' },
  EDUCATION: { label: 'Education', emoji: '📚', color: 'bg-yellow-50 text-yellow-700' },
  HEALTH:    { label: 'Health',    emoji: '🌿', color: 'bg-teal-50 text-teal-700' },
  OTHER:     { label: 'Other',     emoji: '✨', color: 'bg-gray-50 text-gray-600' },
}

export const STATUS_META: Record<EventStatus, { label: string; color: string }> = {
  UPCOMING:  { label: 'Upcoming',  color: 'badge-blue' },
  ONGOING:   { label: 'Ongoing',   color: 'badge-green' },
  COMPLETED: { label: 'Completed', color: 'badge-gray' },
  CANCELLED: { label: 'Cancelled', color: 'badge-red' },
}

export function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + '…' : str
}

export const EVENT_CATEGORIES: EventCategory[] = [
  'MUSIC', 'TECH', 'SPORTS', 'FOOD', 'ART', 'BUSINESS', 'EDUCATION', 'HEALTH', 'OTHER'
]
