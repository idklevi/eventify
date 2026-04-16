import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, Edit3, Save, X, Loader2, ShieldCheck } from 'lucide-react'
import { userService } from '@/services/eventify'
import type { User as UserType } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { formatDate, getInitials, cn } from '@/utils/helpers'
import { PageContainer, SectionHeader, RoleBadge, LoadingSpinner } from '@/components/ui/index'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phoneNumber: z.string().optional(),
  bio: z.string().max(500).optional(),
  profileImageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})
type FormValues = z.infer<typeof schema>

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const { updateUser } = useAuthStore()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    userService.getProfile()
      .then(p => { setProfile(p); reset({ name: p.name, phoneNumber: p.phoneNumber ?? '', bio: p.bio ?? '', profileImageUrl: p.profileImageUrl ?? '' }) })
      .finally(() => setLoading(false))
  }, [])

  const onSubmit = async (data: FormValues) => {
    setSaving(true)
    try {
      const updated = await userService.updateProfile(data)
      setProfile(updated)
      updateUser({ name: updated.name })
      toast.success('Profile updated!')
      setEditing(false)
    } catch (e: any) {
      toast.error(e.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageContainer><LoadingSpinner /></PageContainer>
  if (!profile) return null

  return (
    <PageContainer className="max-w-2xl">
      <SectionHeader title="My Profile" subtitle="Manage your account information" />

      <div className="space-y-5">
        {/* Avatar + name card */}
        <div className="card p-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-brand-100 text-brand-700 text-2xl font-bold flex items-center justify-center overflow-hidden shrink-0">
            {profile.profileImageUrl
              ? <img src={profile.profileImageUrl} alt="" className="w-full h-full object-cover" />
              : getInitials(profile.name)
            }
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
            <p className="text-sm text-slate-500">{profile.email}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {profile.roles.map(r => <RoleBadge key={r} role={r} />)}
            </div>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-secondary btn-sm shrink-0">
              <Edit3 className="w-4 h-4" /> Edit
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Events Created', value: profile.eventCount },
            { label: 'Registrations', value: profile.registrationCount },
            { label: 'Member Since', value: formatDate(profile.createdAt, 'MMM yyyy') },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Edit form */}
        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
            <h3 className="font-semibold text-slate-900 border-b border-surface-200 pb-3">Edit Profile</h3>

            <div>
              <label className="label">Full Name</label>
              <input {...register('name')} className="input" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">Phone Number</label>
              <input {...register('phoneNumber')} className="input" placeholder="+1 234 567 8900" />
            </div>

            <div>
              <label className="label">Bio</label>
              <textarea {...register('bio')} className="input resize-none" rows={3} placeholder="Tell us a little about yourself..." />
              {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
            </div>

            <div>
              <label className="label">Profile Image URL</label>
              <input {...register('profileImageUrl')} className="input" placeholder="https://..." />
              {errors.profileImageUrl && <p className="text-xs text-red-500 mt-1">{errors.profileImageUrl.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                <X className="w-4 h-4" /> Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </form>
        ) : (
          /* Read-only view */
          <div className="card p-6 space-y-5">
            <h3 className="font-semibold text-slate-900 border-b border-surface-200 pb-3">Account Details</h3>
            <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={profile.name} />
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={profile.email} />
            {profile.phoneNumber && <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={profile.phoneNumber} />}
            {profile.bio && (
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Bio</p>
                <p className="text-sm text-slate-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}
            <div className="pt-2 border-t border-surface-200 flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Account secured with JWT authentication
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-400">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  )
}
