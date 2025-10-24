"use client"

import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"


function ProtectedRoute({ adminOnly = false, children }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")

    if (!userData.id) {
      setAuthorized(false)
    } else if (adminOnly && userData.role !== "admin") {
      setAuthorized(false)
    } else {
      setAuthorized(true)
    }

    setLoading(false)
  }, [adminOnly])

  if (loading) {
    return <div className="container py-8">Loading...</div>
  }

  if (!authorized) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

