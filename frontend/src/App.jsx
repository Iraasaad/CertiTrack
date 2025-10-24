"use client"

import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import AddDiploma from "./pages/AddDiploma"
import AddCertificate from "./pages/AddCertificate"
import Profile from "./pages/Profile"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Home from "./pages/Home"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminValidation from "./pages/AdminValidation"
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "system"
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const resolvedTheme = savedTheme === "system" ? systemTheme : savedTheme

    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(resolvedTheme)
  }, [])

  return (
    <div className="layout">
      <Navbar />
      <main className="main">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes - require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-diploma"
            element={
              <ProtectedRoute>
                <AddDiploma />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-certificate"
            element={
              <ProtectedRoute>
                <AddCertificate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin-only routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-validation"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminValidation />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

