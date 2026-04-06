import { NavLink } from "react-router-dom"
export default function Sidebar({ close }) {

  const link =
    "flex items-center gap-3 px-4 py-2 rounded-xl text-gray-300 hover:bg-white/10 transition"

  const active =
    "flex items-center gap-3 px-4 py-2 rounded-xl bg-indigo-500/20 text-white"

  return (
    <div className="h-full flex flex-col justify-between glass">

      {/* TOP */}
      <div>
        <div className="p-5 font-bold text-xl text-white">
        <NavLink to="/" onClick={close} className=" font-bold text-xl text-white">SPITConnect</NavLink>
        </div>
     


        <nav className="space-y-2 px-3">

          <NavLink to="/" onClick={close} className={({ isActive }) => isActive ? active : link}>Home</NavLink>
          <NavLink to="/opportunities" onClick={close} className={({ isActive }) => isActive ? active : link}>Opportunities</NavLink>
          <NavLink to="/academic-help" onClick={close} className={({ isActive }) => isActive ? active : link}>Academic Help</NavLink>
          <NavLink to="/projects" onClick={close} className={({ isActive }) => isActive ? active : link}>Projects</NavLink>
          <NavLink to="/events" onClick={close} className={({ isActive }) => isActive ? active : link}>Events</NavLink>
          <NavLink to="/explore" onClick={close} className={({ isActive }) => isActive ? active : link}>Explore</NavLink>
          <NavLink to="/search" onClick={close} className={({ isActive }) => isActive ? active : link}>Search</NavLink>

        </nav>
      </div>

      {/* BOTTOM */}
      <div className="p-3 space-y-2 border-t border-white/10">

        <NavLink to="/profile" onClick={close} className={link}>Profile</NavLink>
        <NavLink to="/notifications" onClick={close} className={link}>Notifications</NavLink>
        <NavLink to="/settings" onClick={close} className={link}>Settings</NavLink>
        <NavLink to="/admin" onClick={close} className={link}>Admin Panel</NavLink>

      </div>
    </div>
  )
}