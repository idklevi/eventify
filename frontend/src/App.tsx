import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useIsAuthenticated, useIsAdmin, useIsOrganiser } from '@/store/authStore'

import Layout from '@/components/layout/Layout'
import AuthLayout from '@/components/layout/AuthLayout'

import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import EventsPage from '@/pages/EventsPage'
import EventDetailPage from '@/pages/EventDetailPage'
import CreateEventPage from '@/pages/CreateEventPage'
import EditEventPage from '@/pages/EditEventPage'
import MyRegistrationsPage from '@/pages/MyRegistrationsPage'
import ProfilePage from '@/pages/ProfilePage'
import UserDashboardPage from '@/pages/UserDashboardPage'
import OrganiserDashboardPage from '@/pages/OrganiserDashboardPage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import NotFoundPage from '@/pages/NotFoundPage'

function RequireAuth() {
  const isAuthenticated = useIsAuthenticated()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function RequireOrganiser() {
  const isOrganiser = useIsOrganiser()
  return isOrganiser ? <Outlet /> : <Navigate to="/dashboard" replace />
}

function RequireAdmin() {
  const isAdmin = useIsAdmin()
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />
}

function RedirectIfAuth() {
  const isAuthenticated = useIsAuthenticated()
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 8px 24px -4px rgb(0 0 0 / 0.12)',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* Public landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth pages (redirect if already logged in) */}
        <Route element={<RedirectIfAuth />}>
          <Route element={<AuthLayout />}>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Public browsing within main layout */}
        <Route element={<Layout />}>
          <Route path="/events"       element={<EventsPage />} />
          <Route path="/events/:id"   element={<EventDetailPage />} />

          {/* Protected routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard"          element={<UserDashboardPage />} />
            <Route path="/my-registrations"   element={<MyRegistrationsPage />} />
            <Route path="/profile"            element={<ProfilePage />} />

            <Route element={<RequireOrganiser />}>
              <Route path="/organiser/dashboard"  element={<OrganiserDashboardPage />} />
              <Route path="/events/create"        element={<CreateEventPage />} />
              <Route path="/events/:id/edit"      element={<EditEventPage />} />
            </Route>

            <Route element={<RequireAdmin />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
