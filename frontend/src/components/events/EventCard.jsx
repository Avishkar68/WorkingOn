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

    <div className="glass rounded-2xl overflow-hidden hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition">

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
              className="bg-white/10 px-3 py-1 rounded-full text-xs text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* INFO */}
        <div className="text-gray-400 text-sm space-y-1">
          <p>📅 {formatDate(event.date)}</p>
          <p>📍 {event.location}</p>
          <p>👥 {event.registeredUsers?.length || 0} attending</p>
        </div>

        {/* BUTTON */}
        <div className="border-t border-white/10 pt-4">
          <button
            onClick={register}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            Register Interest
          </button>
        </div>

      </div>

    </div>

  )
}