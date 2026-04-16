import { Outlet, Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 flex flex-col">
      {/* Top bar */}
      <div className="p-6">
        <Link to="/" className="inline-flex items-center gap-2 text-white font-bold text-xl">
          <Calendar className="w-6 h-6" />
          <span>Eventify</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <Outlet />
      </div>

      <p className="text-center text-brand-400/60 text-sm py-6">
        © {new Date().getFullYear()} Eventify. All rights reserved.
      </p>
    </div>
  )
}
