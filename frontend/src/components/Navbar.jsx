"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { GraduationCap, LogOut, User, ChevronDown } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {

    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    if (userData.id) {
      setUser(userData)
    }
  }, [location])

  const handleLogout = () => {

    localStorage.removeItem("user")
    setUser(null)
    setDropdownOpen(false)

    navigate("/login")
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".user-dropdown-container")) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownOpen])

  const routes = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/add-diploma", label: "Add Diploma" },
    { href: "/add-certificate", label: "Add Certificate" },
    { href: "/profile", label: "Profile" },
  ]

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <GraduationCap className="logo-icon" />
          <span className="logo-text">CertiTrack</span>
        </Link>

        <nav className="nav-menu pt-3">
          <ul className="nav-list">
            {routes.map((route) => (
              <li key={route.href} className="nav-item">
                <Link to={route.href} className={`nav-link ${location.pathname === route.href ? "active" : ""}`}>
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <ThemeToggle />

          {user ? (
            <div className="user-dropdown-container relative">
              <button className="btn btn-outline btn-sm flex items-center gap-2" onClick={toggleDropdown}>
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{user.email}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {dropdownOpen && (
                <div
                  className="  w-48 rounded-md shadow-lg bg-card border "
                  style={{ borderColor: "var(--color-border)" , marginTop:"70px"}}
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

                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>

                    {user.role === "admin" && (
                      <Link
                      style={{marginBottom:"10px"}}
                        to="/admin-dashboard"
                        className="block px-4 py-5 text-sm hover:bg-muted"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button style={{marginTop:"10px"}}
                      className="flex w-full items-center px-4 py-2 text-sm text-left hover:bg-muted text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut  className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="btn btn-ghost btn-sm">Login</button>
              </Link>
              <Link to="/signup">
                <button className="btn btn-default btn-sm">Sign up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar

