import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { useEffect, useState, lazy, Suspense } from "react"
import { Toaster } from "react-hot-toast"

import Layout from "./components/layout/Layout"
import ProtectedRoute from "./routes/ProtectedRoute"

// ✅ Non-lazy (public + SEO)
import LandingPage from "./pages/LandingPage"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import BlogHome from "./pages/blogs/BlogHome"
import BlogDetail from "./pages/blogs/BlogDetail"
import OurTeam from "./pages/OurTeam.jsx"

// Helper to automatically recover from chunk loading errors (like new production deployments)
const safeLazy = (importFn) => {
  return lazy(async () => {
    try {
      const module = await importFn();
      sessionStorage.removeItem("chunk-reload-retry");
      return module;
    } catch (error) {
      console.error("Failed to load component chunk, reloading page...", error);
      const hasReloaded = sessionStorage.getItem("chunk-reload-retry");
      if (!hasReloaded) {
        sessionStorage.setItem("chunk-reload-retry", "true");
        window.location.reload();
        return new Promise(() => {}); // Keep pending to halt mount
      }
      throw error;
    }
  });
};

// ✅ Lazy (heavy pages)
const Home = safeLazy(() => import("./pages/Home"))
const Opportunities = safeLazy(() => import("./pages/Opportunities"))
const AcademicHelp = safeLazy(() => import("./pages/AcademicHelp"))
const Projects = safeLazy(() => import("./pages/Projects"))
const Events = safeLazy(() => import("./pages/Events"))
const Explore = safeLazy(() => import("./pages/Explore"))
const Search = safeLazy(() => import("./pages/Search"))
const Profile = safeLazy(() => import("./pages/Profile"))
const Notifications = safeLazy(() => import("./pages/Notifications"))
const Settings = safeLazy(() => import("./pages/Settings"))
const AdminPanel = safeLazy(() => import("./pages/AdminPanel"))
const UserProfile = safeLazy(() => import("./pages/UserProfile"))
const EventDetail = safeLazy(() => import("./pages/EventDetail"))
const OpportunityDetail = safeLazy(() => import("./pages/OpportunityDetail"))
const ProjectDetail = safeLazy(() => import("./pages/ProjectDetail"))
const PostDetail = safeLazy(() => import("./pages/PostDetail"))
const Opportunity = safeLazy(() => import("./pages/try/Opportunity"))
const ChallengePage = safeLazy(() => import("./pages/ChallengePage"))
const Leaderboard = safeLazy(() => import("./pages/Leaderboard"))
const CommunityPage = safeLazy(() => import("./pages/CommunityPage"))
const CommunitiesPage = safeLazy(() => import("./pages/CommunitiesPage"))
const CampusPulse = safeLazy(() => import("./pages/CampusPulse.jsx"))

import SocketProvider from "./context/SocketContext"
import NotificationProvider from "./context/NotificationContext"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "rgba(9, 9, 11, 0.8)",
                  color: "#ededed",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(12px)",
                  padding: "16px",
                  fontSize: "14px",
                  borderRadius: "16px",
                },
              }}
            />
            <AnimatedRoutes />
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  useEffect(() => {
    console.log("[Navigation]", location.pathname)
  }, [location.pathname])

  return (
    <>
      {/* ✅ NO mode="wait" */}
      <AnimatePresence>
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#020609] flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            </div>
          }
        >
          {/* ✅ NO key={pathKey} */}
          <Routes location={location}>

            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/our-team" element={<OurTeam />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/blog" element={<BlogHome />} />
            <Route path="/blog/:id" element={<BlogDetail />} />

            {/* ================= PROTECTED ================= */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Layout><Home /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/community/:id"
              element={
                <ProtectedRoute>
                  <Layout><CommunityPage /></Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/communities"
              element={
                <ProtectedRoute>
                  <Layout><CommunitiesPage /></Layout>
                </ProtectedRoute>
              }
            />

            {[
              { path: "/opportunities", element: <Opportunities /> },
              { path: "/academic-help", element: <AcademicHelp /> },
              { path: "/projects", element: <Projects /> },
              { path: "/events", element: <Events /> },
              { path: "/explore", element: <Explore /> },
              { path: "/campus-pulse", element: <CampusPulse /> },
              { path: "/search", element: <Search /> },
              { path: "/profile", element: <Profile /> },
              { path: "/notifications", element: <Notifications /> },
              { path: "/settings", element: <Settings /> },
              { path: "/admin", element: <AdminPanel /> },
              { path: "/challenge", element: <ChallengePage /> },
              { path: "/leaderboard", element: <Leaderboard /> },
              { path: "/user/:id", element: <UserProfile /> },
              { path: "/posts/:id", element: <PostDetail /> },
              { path: "/events/:id", element: <EventDetail /> },
              { path: "/projects/:id", element: <ProjectDetail /> },
              { path: "/opportunities/:id", element: <OpportunityDetail /> },
              { path: "/opportunity", element: <Opportunity /> }
            ].map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={
                  <ProtectedRoute>
                    <Layout>{element}</Layout>
                  </ProtectedRoute>
                }
              />
            ))}

            {/* ================= FALLBACK ================= */}
            <Route path="*" element={<Navigate to="/home" replace />} />

          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  )
}

export default App