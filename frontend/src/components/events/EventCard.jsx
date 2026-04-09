import { motion } from "framer-motion"
import { buttonTap, cardHover, fadeInUp } from "../../lib/motion"
import { CalendarDays, MapPin, Users } from "lucide-react";

export default function EventCard({event}){

  const formatDate = (date)=>{
    const d = new Date(date)
    return d.toLocaleString("en-IN",{
      month:"short",
      day:"numeric",
      year:"numeric",
      hour:"numeric",
      minute:"2-digit"
    })
  }

  const register = ()=>{
    if(event.registrationLink){
      window.open(event.registrationLink,"_blank")
    }
  }

  return(

    <motion.div
      className="glass-card overflow-hidden"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={cardHover}
    >

      {/* IMAGE */}
      {/* <img
        src="https://images.unsplash.com/photo-1552664730-d307ca884978"
        className="w-full h-48 object-cover"
      /> */}
{event.image ? (
  <img
    src={event.image}
    alt="event"
    className="w-full h-48 object-cover"
  />
) : (
  <img
    src="https://images.unsplash.com/photo-1552664730-d307ca884978"
    alt="fallback"
    className="w-full h-48 object-cover"
  />
)}
      <div className="p-6 space-y-4">

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-white">
          {event.title}
        </h2>

        {/* DESC */}
        <p className="text-gray-300 text-sm">
          {event.description}
        </p>

        {/* TAGS */}
        <div className="flex gap-2 flex-wrap">
          {event.tags?.map(tag => (
            <span
              key={tag}
              className="pill-badge"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* INFO */}
        <div className="text-gray-400 text-sm space-y-1">
  
  <p className="flex items-center gap-2">
    <CalendarDays size={14} className="text-[#2DD4BF]" />
    {formatDate(event.date)}
  </p>

  <p className="flex items-center gap-2">
    <MapPin size={14} className="text-rose-400" />
    {event.location}
  </p>

  <p className="flex items-center gap-2">
    <Users size={14} className="text-blue-400" />
    {event.registeredUsers?.length || 0} attending
  </p>

</div>

        {/* BUTTON */}
        <div className="border-t border-white/10 pt-4">
          <motion.button
            onClick={register}
            whileHover={{ scale: 1.03 }}
            whileTap={buttonTap}
            className="w-full btn-primary font-semibold text-sm py-3 rounded-xl"
          >
            Register Interest
          </motion.button>
        </div>

      </div>

    </motion.div>

  )
}