import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { eventService } from '@/services/eventify'
import type { Event, EventRequest } from '@/types'
import EventForm from '@/components/events/EventForm'
import { FullPageSpinner } from '@/components/ui'
import toast from 'react-hot-toast'

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    eventService.getById(Number(id))
      .then(setEvent)
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (data: EventRequest) => {
    if (!id) return
    setSaving(true)
    try {
      await eventService.update(Number(id), data)
      toast.success('Event updated successfully!')
      navigate(`/events/${id}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update event')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <FullPageSpinner />

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Edit Event</h1>
        <p className="text-slate-500 mt-1">Update the details for <span className="font-medium">{event?.name}</span></p>
      </div>

      {event && (
        <EventForm
          initialData={event}
          onSubmit={handleSubmit}
          isLoading={saving}
          submitLabel="Save Changes"
        />
      )}
    </div>
  )
}
