import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Users, Globe, Star, Zap } from 'lucide-react'
import { eventService } from '@/services/eventify'
import type { Event } from '@/types'
import EventCard from '@/components/events/EventCard'
import { FullPageSpinner } from '@/components/ui'
import { CATEGORY_META, EVENT_CATEGORIES } from '@/utils/helpers'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function LandingPage() {
  const [featured, setFeatured] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    eventService.getFeatured()
      .then(setFeatured)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900 text-white overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium mb-8 border border-white/10 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-yellow-400" />
            Discover events happening near you
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Find events that
            <span className="bg-gradient-to-r from-brand-400 to-blue-400 bg-clip-text text-transparent block">
              move you.
            </span>
          </h1>

          <p className="text-xl text-brand-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            From intimate workshops to massive concerts — discover, register, and never miss out on what matters to you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/events" className="btn-primary btn-lg group text-base">
              Browse Events
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register" className="btn btn-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 text-base">
              Create Your Event
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-10 mt-16 text-brand-300">
            {[
              { icon: Calendar, label: '500+ Events' },
              { icon: Users,    label: '10k+ Members' },
              { icon: Globe,    label: '50+ Cities' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium">
                <Icon className="w-4 h-4" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="section-title text-center mb-8">Browse by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
          {EVENT_CATEGORIES.map(cat => {
            const meta = CATEGORY_META[cat]
            return (
              <Link
                key={cat}
                to={`/events?category=${cat}`}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-brand-50 hover:border-brand-200 border border-transparent transition-all group"
              >
                <span className="text-2xl">{meta.emoji}</span>
                <span className="text-xs font-medium text-slate-600 group-hover:text-brand-700">{meta.label}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Events */}
      <section className="bg-surface-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">Featured</span>
              </div>
              <h2 className="section-title">Handpicked Events</h2>
            </div>
            <Link to="/events" className="btn-secondary hidden sm:flex">
              View all events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <FullPageSpinner />
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.slice(0, 6).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-12">No featured events right now. Check back soon!</p>
          )}

          <div className="text-center mt-10">
            <Link to="/events" className="btn-primary btn-lg">
              Explore All Events <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-brand-600 to-blue-600 rounded-3xl p-12 text-white text-center shadow-modal">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to host your own event?</h2>
          <p className="text-brand-200 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of organisers who trust Eventify to power their events.
          </p>
          <Link to="/register" className="btn btn-lg bg-white text-brand-700 hover:bg-brand-50 font-semibold shadow-lg">
            Start for Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
