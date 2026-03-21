import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import RightSidebar from "./RightSidebar"

export default function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0b17]">

      {/* LEFT */}
      <Sidebar />

      {/* RIGHT */}
      <div className="flex-1 flex flex-col ml-[250px]">

        {/* TOPBAR */}
        <Topbar />

        {/* CONTENT */}
        <div className="flex flex-1 overflow-hidden">

          {/* CENTER */}
          <main className="flex-1 max-w-[700px] mx-auto p-6 overflow-y-auto space-y-6">
            {children}
          </main>

          {/* RIGHT SIDEBAR */}
          <RightSidebar />

        </div>
      </div>
    </div>
  )
}