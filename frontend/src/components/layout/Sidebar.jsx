import { NavLink } from "react-router-dom"
import {
  Bell,
  Briefcase,
  Calendar,
  Compass,
  FolderKanban,
  GraduationCap,
  Home,
  Search,
  Settings,
  ShieldCheck,
  Trophy,
  User
} from "lucide-react"

export default function Sidebar({ close }) {
  const link =
    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all duration-200 font-medium"

  const active =
    "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-indigo-500/20 transition-all duration-200 font-medium"

  const primaryLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/opportunities", label: "Opportunities", icon: Briefcase },
    { to: "/academic-help", label: "Academic Help", icon: GraduationCap },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/events", label: "Events", icon: Calendar },
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { to: "/search", label: "Search", icon: Search }
  ]

  const accountLinks = [
    // { to: "/profile", label: "Profile", icon: User },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/admin", label: "Admin Panel", icon: ShieldCheck }
  ]

  return (
    <aside className="h-full flex flex-col justify-between glass rounded-2xl">
      <div>
        <div className="px-5 py-5 border-b border-white/10">
          <NavLink to="/" onClick={close} className="font-semibold tracking-tight text-xl text-slate-100">
            SPITConnect
          </NavLink>
          <p className="mt-1 text-xs text-slate-400">Student collaboration workspace</p>
        </div>

        <nav className="space-y-2 px-3 py-4">
          {primaryLinks.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={close} className={({ isActive }) => (isActive ? active : link)}>
              <Icon size={16} />
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-3 space-y-2 border-t border-white/10">
        {accountLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={close} className={({ isActive }) => (isActive ? active : link)}>
            <Icon size={16} />
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  )
}