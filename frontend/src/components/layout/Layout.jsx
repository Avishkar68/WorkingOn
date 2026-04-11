import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useLocation } from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import RightSidebar from "./RightSidebar"
import { fadeInUp } from "../../lib/motion"

const FULL_BLEED_ROUTES = ["/academic-help"]

export default function Layout({ children }) {

  const [open,setOpen] = useState(false)
  const location = useLocation()
  const hideRightSidebar = location.pathname === "/communities" || location.pathname === "/academic-help"
  const isFullBleed = FULL_BLEED_ROUTES.includes(location.pathname)

  return (
    <div className="h-screen overflow-hidden bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex h-full w-full max-w-[1600px] gap-4 lg:gap-6">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:block w-[280px] shrink-0">
        <Sidebar />
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
            />
            <motion.div
              className="fixed z-50 top-0 left-0 h-full w-[280px] p-3 lg:hidden"
              initial={{ x: -32, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -32, opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              <Sidebar close={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN */}
      <div className="min-w-0 flex-1 flex flex-col">

        <Topbar openSidebar={()=>setOpen(true)} />

        <div className="flex flex-1 overflow-hidden gap-4 lg:gap-6 pt-4 lg:pt-6">

          {/* CENTER */}
          <motion.main
            className={`flex-1 min-w-0 overflow-y-auto scrollbar-hide ${
              isFullBleed
                ? "overflow-hidden"
                : "rounded-[2rem] glass p-6 lg:p-8 space-y-8"
            }`}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            {children}
          </motion.main>

          {/* RIGHT SIDEBAR */}
          {!hideRightSidebar && (
            <div className="hidden xl:block shrink-0 min-h-0 h-full">
              <RightSidebar />
            </div>
          )}

        </div>
      </div>
      </div>
    </div>
  )
}