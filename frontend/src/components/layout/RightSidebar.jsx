import { useEffect, useState } from "react"
import api from "../../api/axios"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { fadeInUp } from "../../lib/motion"
import StreakCard from "./StreakCard"

export default function RightSidebar() {

  const [events, setEvents] = useState([])
  const [opportunities, setOpportunities] = useState([])
  const [myCommunities, setMyCommunities] = useState([])

  const navigate = useNavigate()

  const Section = ({ title, subtitle, actionLabel, onAction, children }) => {
    return (
      <motion.section
        className="glass-card p-5"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-text-primary leading-6 truncate">
              {title}
            </h3>
            {subtitle ? (
              <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-2 leading-normal">
                {subtitle}
              </p>
            ) : null}
          </div>

          {actionLabel ? (
            <button
              type="button"
              onClick={onAction}
              className="shrink-0 text-xs text-indigo-300 hover:text-indigo-200 transition"
            >
              {actionLabel}
            </button>
          ) : null}
        </div>

        <div className="space-y-2">
          {children}
        </div>
      </motion.section>
    )
  }

  const ListItem = ({ title, meta, onClick }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left group rounded-[0.85rem] bg-transparent hover:bg-white/5 border border-transparent transition-all duration-200 px-3 py-2.5"
      >
        <p className="text-sm font-medium text-text-primary/90 truncate group-hover:text-white transition-colors">
          {title}
        </p>
        {meta ? (
          <p className="text-[11px] text-text-secondary/70 truncate mt-0.5 group-hover:text-text-secondary transition-colors">
            {meta}
          </p>
        ) : null}
      </button>
    )
  }

  const loadData = async () => {
    try {
      const [eRes, oRes] = await Promise.all([
        api.get("/events"),
        api.get("/opportunities")
      ])

      setEvents(eRes.data.slice(0, 3))
      setOpportunities(oRes.data.slice(0, 3))

    } catch (err) {
      console.error(err)
    }
  }

  const loadCommunities = async () => {
    try {
      const res = await api.get("/communities/user/me")
      setMyCommunities(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
    loadCommunities()
  }, [])

  return (
    <motion.div
      className="w-72 xl:w-80 h-full min-h-0 max-h-full px-3 py-1 space-y-4 overflow-y-auto scrollbar-hide"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >

      <StreakCard />

      {/* 🔥 YOUR COMMUNITIES */}
      <Section
        title="Your Communities"
        subtitle="Jump back into the spaces you’ve joined."
        actionLabel="View all"
        onAction={() => navigate("/communities")}
      >
        {myCommunities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-transparent px-3 py-3">
            <p className="text-gray-300 text-sm">
              You haven’t joined any communities yet.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Find one in Explore and it’ll show up here.
            </p>
          </div>
        ) : (
          myCommunities.slice(0, 5).map(c => (
            <ListItem
              key={c._id}
              title={c.name}
              meta={c.description}
              onClick={() => navigate(`/community/${c._id}`)}
            />
          ))
        )}
      </Section>

      {/* EVENTS */}
      <Section
        title="Upcoming Events"
        subtitle="What’s happening next on campus."
        actionLabel="See all"
        onAction={() => navigate("/events")}
      >
        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-transparent px-3 py-3">
            <p className="text-gray-300 text-sm">No upcoming events right now.</p>
            <p className="text-gray-400 text-xs mt-1">Check back soon.</p>
          </div>
        ) : (
          events.map(event => (
            <ListItem
              key={event._id}
              title={event.title}
              meta={event.location}
              onClick={() => navigate(`/events/${event._id}`)}
            />
          ))
        )}
      </Section>

      {/* OPPORTUNITIES */}
      <Section
        title="Recent Opportunities"
        subtitle="Internships, jobs, and openings."
        actionLabel="See all"
        onAction={() => navigate("/opportunities")}
      >
        {opportunities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-transparent px-3 py-3">
            <p className="text-gray-300 text-sm">No opportunities right now.</p>
            <p className="text-gray-400 text-xs mt-1">
              New listings will appear here.
            </p>
          </div>
        ) : (
          opportunities.map(op => (
            <ListItem
              key={op._id}
              title={op.title}
              meta={op.company}
              onClick={() => navigate(`/opportunities/${op._id}`)}
            />
          ))
        )}
      </Section>

    </motion.div>
  )
}