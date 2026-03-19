import { BrowserRouter, Routes, Route } from "react-router-dom"

import Layout from "./components/layout/Layout"
import ProtectedRoute from "./routes/ProtectedRoute"

import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import Home from "./pages/Home"
import Opportunities from "./pages/Opportunities"
import AcademicHelp from "./pages/AcademicHelp"
import Projects from "./pages/Projects"
import Events from "./pages/Events"
import Explore from "./pages/Explore"
import Search from "./pages/Search"
import Profile from "./pages/Profile"
import Notifications from "./pages/Notifications"
import Settings from "./pages/Settings"
import AdminPanel from "./pages/AdminPanel"
import UserProfile from "./pages/UserProfile"
import EventDetail from "./pages/EventDetail"
import OpportunityDetail from "./pages/OpportunityDetail"

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* PROTECTED ROUTES */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="/opportunities" element={<Layout><Opportunities /></Layout>} />
        <Route path="/academic-help" element={<Layout><AcademicHelp /></Layout>} />
        <Route path="/projects" element={<Layout><Projects /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/explore" element={<Layout><Explore /></Layout>} />
        <Route path="/search" element={<Layout><Search /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        <Route path="/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
        <Route path="/user/:id" element={<Layout><UserProfile /></Layout>} />
        <Route path="/events/:id" element={<Layout><EventDetail /></Layout>} />
<Route path="/opportunities/:id" element={<Layout><OpportunityDetail /></Layout>} />
      </Routes>

    </BrowserRouter>
  )
}

export default App