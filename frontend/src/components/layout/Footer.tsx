import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-surface-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-brand-600 font-bold text-lg">
            <Calendar className="w-5 h-5" />
            Eventify
          </Link>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link to="/events" className="hover:text-slate-900 transition-colors">Browse Events</Link>
            <Link to="/register" className="hover:text-slate-900 transition-colors">Sign Up</Link>
          </div>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} Eventify</p>
        </div>
      </div>
    </footer>
  )
}
