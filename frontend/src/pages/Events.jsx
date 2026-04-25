import { useEffect, useState } from "react"
import api from "../api/axios"
import { motion } from "framer-motion"
import { staggerContainer } from "../lib/motion"
import { trackEvent } from "../utils/analytics"

import EventCard from "../components/events/EventCard"
import CreateEventModal from "../components/events/CreateEventModal"
import PageShell from "../components/layout/PageShell"
import Skeleton from "../components/ui/Skeleton"

export default function Events() {

  const [events, setEvents] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadEvents = async () => {
    try {
      const res = await api.get("/events")
      setEvents(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    trackEvent('page_view_component', { page: 'Events' });
    loadEvents()
    window.addEventListener("global-refresh", loadEvents)
    return () => window.removeEventListener("global-refresh", loadEvents)
  }, [])

  return (
    <PageShell
      eyebrow="Calendar"
      title="Events"
      subtitle="Discover workshops, competitions, and meetups across your network."
      actions={
        <button
          onClick={() => {
            trackEvent('button_click', { button_name: 'create_event_open' });
            setShowCreate(true);
          }}
          className="btn-primary text-sm font-medium px-4 py-2 rounded-xl w-full md:w-auto"
        >
          Create Event
        </button>
      }
    >

      {/* EVENTS */}
      <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="visible">

        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="glass p-4 md:p-6 rounded-2xl flex flex-col md:flex-row gap-4 md:gap-6 items-start">
              <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-3 w-full">
                <Skeleton className="w-3/4 md:w-1/2 h-6" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 md:w-3/4 h-4" />
                <div className="flex gap-4 mt-4">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-24 h-4" />
                </div>
              </div>
            </div>
          ))
        ) : events.length === 0 ? (
          <div className="text-center text-slate-400 py-10">
            No events found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {events.map(event => (
              <EventCard key={event._id} event={event} refresh={loadEvents} />
            ))}
          </div>
        )}

      </motion.div>

      {showCreate &&
        <CreateEventModal
          close={() => setShowCreate(false)}
          refresh={loadEvents}
        />
      }

    </PageShell>
  )
}