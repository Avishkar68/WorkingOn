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
  
      <div className="bg-white rounded-xl shadow overflow-hidden">
  
        {/* IMAGE */}
  
        <img
          src="https://images.unsplash.com/photo-1552664730-d307ca884978"
          className="w-full h-48 object-cover"
        />
  
        <div className="p-6 space-y-4">
  
          <h2 className="text-lg font-semibold">
            {event.title}
          </h2>
  
          <p className="text-gray-600">
            {event.description}
          </p>
  
  
          {/* TAGS */}
  
          <div className="flex gap-2 flex-wrap">
  
            {event.tags?.map(tag => (
  
              <span
                key={tag}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
  
            ))}
  
          </div>
  
  
          <div className="text-gray-600 text-sm">
            📅 {formatDate(event.date)}
          </div>
  
          <div className="text-gray-600 text-sm">
            📍 {event.location}
          </div>
  
          <div className="text-gray-600 text-sm">
            👥 {event.registeredUsers?.length || 0} attending
          </div>
  
  
          <div className="border-t pt-4">
  
            <button
              onClick={register}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg"
            >
              Register Interest
            </button>
  
          </div>
  
        </div>
  
      </div>
  
    )
  
  }