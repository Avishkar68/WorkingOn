import { NavLink } from "react-router-dom"
import {
  Home,
  Briefcase,
  BookOpen,
  Code,
  Calendar,
  Compass,
  Search,
  User,
  Bell,
  Settings,
  Shield
} from "lucide-react"

export default function Sidebar() {

  const link =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"

  const active =
    "flex items-center gap-3 px-4 py-2 rounded-lg bg-black text-white"

  return (
    <div className="w-[250px] bg-white border-r h-screen fixed left-0 top-0 flex flex-col justify-between">

      {/* TOP */}
      <div>
        <div className="p-5 font-bold text-lg">
          SPIT Connect
        </div>

        <nav className="space-y-2 px-3">

          <NavLink to="/" className={({ isActive }) => isActive ? active : link}>
            <Home size={18}/> Home
          </NavLink>

          <NavLink to="/opportunities" className={({ isActive }) => isActive ? active : link}>
            <Briefcase size={18}/> Opportunities
          </NavLink>

          <NavLink to="/academic-help" className={({ isActive }) => isActive ? active : link}>
            <BookOpen size={18}/> Academic Help
          </NavLink>

          <NavLink to="/projects" className={({ isActive }) => isActive ? active : link}>
            <Code size={18}/> Projects
          </NavLink>

          <NavLink to="/events" className={({ isActive }) => isActive ? active : link}>
            <Calendar size={18}/> Events
          </NavLink>

          <NavLink to="/explore" className={({ isActive }) => isActive ? active : link}>
            <Compass size={18}/> Explore
          </NavLink>

          <NavLink to="/search" className={({ isActive }) => isActive ? active : link}>
            <Search size={18}/> Search
          </NavLink>

        </nav>
      </div>

      {/* BOTTOM */}
      <div className="p-3 space-y-2 border-t">

        <NavLink to="/profile" className={link}>
          <User size={18}/> Profile
        </NavLink>

        <NavLink to="/notifications" className={link}>
          <Bell size={18}/> Notifications
        </NavLink>

        <NavLink to="/settings" className={link}>
          <Settings size={18}/> Settings
        </NavLink>

        <NavLink to="/admin" className={link}>
          <Shield size={18}/> Admin Panel
        </NavLink>

        {/* <button className="text-red-500 px-4 py-2 hover:opacity-80">
          Logout
        </button> */}

      </div>

    </div>
  )
}