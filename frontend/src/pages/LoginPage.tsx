import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { authService } from '@/services/eventify'
import { useAuthStore } from '@/store/authStore'
import { Spinner } from '@/components/ui'
import toast from 'react-hot-toast'

const schema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})
type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false)
  const [error,   setError]   = useState('')
  const { login } = useAuthStore()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from = (location.state as any)?.from?.pathname || '/dashboard'

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    setError('')
    try {
      const user = await authService.login(data)
      login(user)
      toast.success(`Welcome back, ${user.name}!`)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="text-brand-300 dark:text-brand-400 mt-2">Sign in to your Eventify account</p>
      </div>

      {/* Card — bright in both modes since it sits on a dark hero */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-modal border border-transparent dark:border-slate-700">

        {error && (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 mb-6 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('email')}
                type="email"
                className="input pl-10"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('password')}
                type={showPwd ? 'text' : 'password'}
                className="input pl-10 pr-10"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 text-base"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? <><Spinner className="w-5 h-5 text-white" /> Signing in...</>
              : 'Sign In'
            }
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
            Sign up free
          </Link>
        </div>

        {/* Demo credentials box */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
            Demo Accounts
          </p>
          <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
            <p>👤 <strong>User:</strong> user@eventify.com / password123</p>
            <p>🎯 <strong>Organiser:</strong> organiser@eventify.com / password123</p>
            <p>🛡️ <strong>Admin:</strong> admin@eventify.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
