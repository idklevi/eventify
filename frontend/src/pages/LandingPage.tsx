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
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[45%] h-[45%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Hero */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-slate-900/60 rounded-full px-4 py-2 text-sm font-medium mb-8 border border-slate-800 backdrop-blur-md">
              <Zap className="w-4 h-4 text-yellow-400" />
              Discover events happening near you
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight text-white">
              Find events that
              <span className="bg-gradient-to-r from-brand-400 to-indigo-400 bg-clip-text text-transparent block">
                move you.
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              From intimate workshops to massive concerts — discover, register, and never miss out on what matters to you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/events" className="btn-primary btn-lg group text-base">
                Browse Events
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/register" className="btn btn-lg bg-slate-900/60 text-white border border-slate-800 hover:bg-slate-800/80 backdrop-blur-md text-base">
                Create Your Event
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-center gap-10 mt-16 text-slate-400">
              {[
                { icon: Calendar, label: '500+ Events' },
                { icon: Users,    label: '10k+ Members' },
                { icon: Globe,    label: '50+ Cities' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm font-medium">
                  <Icon className="w-4 h-4 text-indigo-400" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="section-title text-center mb-8 text-white">Browse by Category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {EVENT_CATEGORIES.map(cat => {
              const meta = CATEGORY_META[cat]
              return (
                <Link
                  key={cat}
                  to={`/events?category=${cat}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm hover:bg-slate-800/50 hover:border-slate-700 transition-all group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">{meta.emoji}</span>
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white">{meta.label}</span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-yellow-500 uppercase tracking-wide">Featured</span>
                </div>
                <h2 className="section-title text-white">Handpicked Events</h2>
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
              <p className="text-slate-400 text-center py-12">No featured events right now. Check back soon!</p>
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
          <div className="glass-card bg-slate-900/40 border-slate-800/80 backdrop-blur-md rounded-3xl p-12 text-white text-center shadow-modal relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-indigo-500/10 opacity-30 pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative z-10">Ready to host your own event?</h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto relative z-10">
              Join thousands of organisers who trust Eventify to power their events.
            </p>
            <Link to="/register" className="btn-primary btn-lg font-semibold relative z-10 shadow-lg">
              Start for Free
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
