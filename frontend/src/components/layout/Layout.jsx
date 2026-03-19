import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import RightSidebar from "./RightSidebar"

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE CONTENT */}
      <div className="flex-1 flex flex-col ml-[250px]">

        {/* TOPBAR */}
        <Topbar />

        {/* MAIN CONTENT AREA */}
        <div className="flex flex-1 overflow-hidden">

          {/* CENTER CONTENT (SCROLLABLE ONLY THIS) */}
          <main className="flex-1 max-w-[800px] mx-auto p-6 overflow-y-auto">
            {children}
          </main>

          {/* RIGHT SIDEBAR */}
          <RightSidebar />

        </div>

      </div>
    </div>
  )
}