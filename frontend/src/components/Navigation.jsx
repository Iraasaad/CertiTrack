"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { LogOut, User, Shield } from "lucide-react"

function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {

    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    if (userData.id) {
      setUser(userData)
    }
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
  }

  return (
    <nav className="border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="container flex justify-between items-center py-4">
        <Link to="/" className="text-xl font-bold">
          CertiTrack
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-4">
                <Link to="/dashboard" className={location.pathname === "/dashboard" ? "font-medium" : ""}>
                  Dashboard
                </Link>
                <Link to="/profile" className={location.pathname === "/profile" ? "font-medium" : ""}>
                  Profile
                </Link>
                {user.role === "admin" && (
                  <Link to="/admin-dashboard" className={location.pathname === "/admin-dashboard" ? "font-medium" : ""}>
                    Admin
                  </Link>
                )}
              </div>

              <div className="relative">
                <button
                  className="flex items-center gap-2 rounded-full p-2 hover:bg-muted"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {user.role === "admin" ? (
                      <Shield className="h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />
                    ) : (
                      <User className="h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />
                    )}
                  </div>
                  <span className="hidden md:inline">{user.name}</span>
                </button>

                {isMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <div className="py-1">
                      <div
                        className="px-4 py-2 text-sm font-medium border-b"
                        style={{ borderColor: "var(--color-border)" }}
                      >
                        {user.name}
                        <p className="text-xs font-normal" style={{ color: "var(--color-muted-foreground)" }}>
                          {user.email}
                        </p>
                      </div>

                      <div className="md:hidden">
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm hover:bg-muted"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm hover:bg-muted"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        {user.role === "admin" && (
                          <>
                            <Link
                              to="/admin-dashboard"
                              className="block px-4 py-2 text-sm hover:bg-muted"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              Admin Dashboard
                            </Link>
                            <Link
                              to="/admin-validation"
                              className="block px-4 py-2 text-sm hover:bg-muted"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              Admin Validation
                            </Link>
                          </>
                        )}
                      </div>

                      <button
                        className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-muted"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/signup" className="btn btn-default btn-sm">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation

