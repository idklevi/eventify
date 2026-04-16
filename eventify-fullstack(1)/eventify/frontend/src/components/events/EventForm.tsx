import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { EventRequest, Event } from '@/types'
import { EVENT_CATEGORIES, CATEGORY_META } from '@/utils/helpers'

const schema = z.object({
  name:           z.string().min(3, 'At least 3 characters').max(200),
  description:    z.string().max(5000).optional().default(''),
  location:       z.string().min(2, 'Location required'),
  date:           z.string().min(1, 'Date required'),
  startTime:      z.string().optional().default(''),
  endTime:        z.string().optional().default(''),
  imageUrl:       z.string().url('Must be a valid URL').optional().or(z.literal('')).default(''),
  category:       z.enum(['MUSIC','TECH','SPORTS','FOOD','ART','BUSINESS','EDUCATION','HEALTH','OTHER']).default('OTHER'),
  paid:           z.boolean().default(false),
  price:          z.coerce.number().min(0).default(0),
  paymentDetails: z.string().optional().default(''),
  volunteerInfo:  z.string().optional().default(''),
  maxCapacity:    z.coerce.number().int().min(1).optional().nullable(),
})

type FormValues = z.infer<typeof schema>

interface EventFormProps {
  initialData?: Partial<Event>
  onSubmit: (data: EventRequest) => Promise<void>
  isLoading?: boolean
  submitLabel?: string
}

export default function EventForm({ initialData, onSubmit, isLoading, submitLabel = 'Save Event' }: EventFormProps) {
  const {
    register, handleSubmit, watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:           initialData?.name ?? '',
      description:    initialData?.description ?? '',
      location:       initialData?.location ?? '',
      date:           initialData?.date ?? '',
      startTime:      initialData?.startTime ?? '',
      endTime:        initialData?.endTime ?? '',
      imageUrl:       initialData?.imageUrl ?? '',
      category:       initialData?.category ?? 'OTHER',
      paid:           initialData?.paid ?? false,
      price:          initialData?.price ?? 0,
      paymentDetails: initialData?.paymentDetails ?? '',
      volunteerInfo:  initialData?.volunteerInfo ?? '',
      maxCapacity:    initialData?.maxCapacity ?? null,
    },
  })

  const isPaid = watch('paid')

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      {/* Basic Info */}
      <div className="card p-6 space-y-5">
        <h3 className="font-semibold text-slate-900 text-lg">Event Details</h3>

        <div>
          <label className="label">Event Name *</label>
          <input {...register('name')} className="input" placeholder="e.g. TechConf 2025" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            {...register('description')}
            className="input resize-none"
            rows={4}
            placeholder="Tell attendees what your event is about..."
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Location *</label>
            <input {...register('location')} className="input" placeholder="City, Venue" />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>
          <div>
            <label className="label">Category</label>
            <select {...register('category')} className="input">
              {EVENT_CATEGORIES.map(c => (
                <option key={c} value={c}>{CATEGORY_META[c].emoji} {CATEGORY_META[c].label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Date *</label>
            <input type="date" {...register('date')} className="input" />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <label className="label">Start Time</label>
            <input type="time" {...register('startTime')} className="input" />
          </div>
          <div>
            <label className="label">End Time</label>
            <input type="time" {...register('endTime')} className="input" />
          </div>
        </div>

        <div>
          <label className="label">Image URL</label>
          <input {...register('imageUrl')} className="input" placeholder="https://..." />
          {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
        </div>

        <div>
          <label className="label">Max Capacity</label>
          <input
            type="number"
            {...register('maxCapacity')}
            className="input"
            placeholder="Leave blank for unlimited"
            min={1}
          />
        </div>
      </div>

      {/* Payment */}
      <div className="card p-6 space-y-5">
        <h3 className="font-semibold text-slate-900 text-lg">Pricing</h3>

        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input type="checkbox" {...register('paid')} className="sr-only peer" />
            <div className="w-11 h-6 bg-surface-200 rounded-full peer-checked:bg-brand-600 transition-colors" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
          </div>
          <div>
            <p className="font-medium text-slate-800">Paid Event</p>
            <p className="text-xs text-slate-500">Attendees will need to pay to register</p>
          </div>
        </label>

        {isPaid && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-down">
            <div>
              <label className="label">Price (USD) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price')}
                  className="input pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="label">Payment Method / Link</label>
              <input {...register('paymentDetails')} className="input" placeholder="e.g. Pay via Stripe link..." />
            </div>
          </div>
        )}
      </div>

      {/* Volunteers */}
      <div className="card p-6 space-y-5">
        <h3 className="font-semibold text-slate-900 text-lg">Volunteers <span className="text-sm font-normal text-slate-400">(optional)</span></h3>
        <div>
          <label className="label">Volunteer Information</label>
          <textarea
            {...register('volunteerInfo')}
            className="input resize-none"
            rows={3}
            placeholder="Describe volunteer roles, requirements, and how to apply..."
          />
        </div>
      </div>

      <button type="submit" className="btn-primary w-full py-3 text-base" disabled={isLoading}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Saving...
          </span>
        ) : submitLabel}
      </button>
    </form>
  )
}
