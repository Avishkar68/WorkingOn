import { NavLink } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useNotifications } from "../../context/NotificationContext"
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
  User,
  Zap
} from "lucide-react"

export default function Sidebar({ close }) {
  const { user } = useContext(AuthContext)
  const { unreadCount } = useNotifications()
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
    { to: "/campus-pulse", label: "Campus Pulse", icon: Zap },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy }
  ]

  const accountLinks = [
    // { to: "/profile", label: "Profile", icon: User },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: Settings },
    ...(user?.isAdmin ? [{ to: "/admin", label: "Admin Panel", icon: ShieldCheck }] : [])
  ]

  return (
    <aside className="h-full flex flex-col justify-between glass rounded-2xl">
      <div>
        <div className="px-5 py-5 border-b border-white/10">
          <NavLink to="/" onClick={close} className="font-bold tracking-tighter text-2xl text-text-primary">
            SPITConnect
          </NavLink>
          <p className="mt-1 text-xs font-medium text-text-secondary/80 tracking-wide uppercase">Workspace</p>
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
            <div className="relative">
              <Icon size={16} />
              {label === "Notifications" && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-[#09090b]">
                   {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <span className="text-sm font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  )
}