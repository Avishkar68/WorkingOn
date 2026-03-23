import { useState } from "react"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import RightSidebar from "./RightSidebar"

export default function Layout({ children }) {

  const [open,setOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#0b0b17] overflow-hidden">

      {/* MOBILE SIDEBAR OVERLAY */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={()=>setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`
        fixed z-50 top-0 left-0 h-full w-[250px] transform 
        ${open ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300
        lg:translate-x-0 lg:static
      `}>
        <Sidebar close={()=>setOpen(false)} />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        <Topbar openSidebar={()=>setOpen(true)} />

        <div className="flex flex-1 overflow-hidden">

          {/* CENTER */}
          <main className="flex-1 w-full max-w-[700px] mx-auto p-4 sm:p-6 overflow-y-auto space-y-6">
            {children}
          </main>

          {/* RIGHT SIDEBAR */}
          <div className="hidden lg:block">
            <RightSidebar />
          </div>

        </div>
      </div>
    </div>
  )
}