import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react'
import { authService } from '@/services/eventify'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import { Spinner } from '@/components/ui'

const schema = z.object({
  name:     z.string().min(2, 'At least 2 characters'),
  email:    z.string().email('Invalid email'),
  password: z.string().min(6, 'At least 6 characters'),
  role:     z.enum(['ROLE_USER', 'ROLE_ORGANISER']),
})
type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'ROLE_USER' },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: FormValues) => {
    setError('')
    try {
      const user = await authService.register(data)
      login(user)
      toast.success(`Account created! Welcome, ${user.name}!`)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Create your account</h1>
        <p className="text-brand-300 mt-2">Join thousands of event lovers</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-modal">
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input {...register('name')} className="input pl-10" placeholder="Jane Smith" />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input {...register('email')} type="email" className="input pl-10" placeholder="you@example.com" />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('password')}
                type={showPwd ? 'text' : 'password'}
                className="input pl-10 pr-10"
                placeholder="Min. 6 characters"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Role selection */}
          <div>
            <label className="label">I want to...</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'ROLE_USER', title: 'Attend Events', desc: 'Browse and register for events', emoji: '🎟️' },
                { value: 'ROLE_ORGANISER', title: 'Host Events', desc: 'Create and manage events', emoji: '🎯' },
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`relative flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${selectedRole === opt.value
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-surface-200 hover:border-surface-300 bg-white'
                    }`}
                >
                  <input type="radio" {...register('role')} value={opt.value} className="sr-only" />
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="font-semibold text-sm text-slate-900">{opt.title}</span>
                  <span className="text-xs text-slate-500">{opt.desc}</span>
                  {selectedRole === opt.value && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-brand-600 rounded-full flex items-center justify-center">
                      <svg viewBox="0 0 12 10" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="1 5 4.5 9 11 1"/>
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3 text-base" disabled={isSubmitting}>
            {isSubmitting
              ? <span className="flex items-center justify-center gap-2"><Spinner className="w-5 h-5 text-white" /> Creating account...</span>
              : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
