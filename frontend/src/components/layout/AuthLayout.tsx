import { Outlet, Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden text-slate-100">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-white font-bold text-xl">
            <Calendar className="w-6 h-6 text-brand-400" />
            <span>Eventify</span>
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Outlet />
        </div>

        <p className="text-center text-slate-500 text-sm py-6">
          © {new Date().getFullYear()} Eventify. All rights reserved.
        </p>
      </div>
    </div>
  )
}
