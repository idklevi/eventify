import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { eventService } from '@/services/eventify'
import type { EventRequest } from '@/types'
import EventForm from '@/components/events/EventForm'
import toast from 'react-hot-toast'
import { useState } from 'react'

export default function CreateEventPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: EventRequest) => {
    setLoading(true)
    try {
      const event = await eventService.create(data)
      toast.success('Event created successfully! 🎉')
      navigate(`/events/${event.id}`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Create New Event</h1>
        <p className="text-slate-500 mt-1">Fill in the details to publish your event</p>
      </div>

      <EventForm onSubmit={handleSubmit} isLoading={loading} submitLabel="Publish Event" />
    </div>
  )
}
