import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useLocation } from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import RightSidebar from "./RightSidebar"
import { fadeInUp } from "../../lib/motion"

const FULL_BLEED_ROUTES = ["/academic-help"]

export default function Layout({ children }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const hideRightSidebar = ["/communities", "/academic-help", "/campus-pulse", "/admin"].includes(location.pathname)
  const isFullBleed = FULL_BLEED_ROUTES.includes(location.pathname)

  return (
    <div className={`h-screen overflow-hidden bg-transparent p-4 sm:p-6 lg:p-5 ${open ? "touch-none" : ""}`}>
      <div className="mx-auto flex h-full w-full max-w-[1600px] gap-4 lg:gap-6">

        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <Sidebar />
        </div>

        {/* MOBILE SIDEBAR */}
        <AnimatePresence>
          {open && (
            <>
              {/* OVERLAY */}
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* DRAWER */}
              <motion.div
                className="fixed top-0 left-0 h-[100dvh] w-[85%] max-w-[320px] z-50 lg:hidden"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25 }}
              >
                <div className="h-full p-3 pt-5 pb-6">
                  <Sidebar close={() => setOpen(false)} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* MAIN */}
        <div className="min-w-0 flex-1 flex flex-col">

          <Topbar openSidebar={() => setOpen(true)} />

          <div className="flex flex-1 overflow-hidden gap-4 lg:gap-6 pt-4 lg:pt-6">

            {/* CENTER */}
            <motion.main
              className={`flex-1 min-w-0 overflow-y-auto scrollbar-hide ${isFullBleed
                ? "overflow-hidden"
                : "rounded-[2rem] glass p-0 lg:p-8 space-y-8"
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