import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-brand-50 text-brand-400 flex items-center justify-center mb-6">
        <Calendar className="w-10 h-10" />
      </div>
      <h1 className="text-8xl font-bold text-brand-100 leading-none">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mt-2">Page not found</h2>
      <p className="text-slate-500 mt-2 mb-8 max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
        <Link to="/" className="btn-primary">Take me home</Link>
      </div>
    </div>
  )
}
