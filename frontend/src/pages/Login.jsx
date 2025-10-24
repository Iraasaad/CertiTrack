"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:8000/backend/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        
        if (data.user.role === "admin") {
          window.location.href = "/admin-dashboard";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container py-8 flex justify-center items-center" style={{ minHeight: "calc(100vh - 8rem)" }}>
      <div className="card" style={{ maxWidth: "400px", width: "100%" }}>
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        <p className="text-sm mb-4" style={{ color: "var(--color-muted-foreground)" }}>
          Enter your credentials to access your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input w-full"
              placeholder="john.smith@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs" style={{ color: "var(--color-primary)" }}>
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="input w-full pr-10"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: "none", border: "none", cursor: "pointer" , position:"relative", bottom:"33px", left:"310px"}}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />
                ) : (
                  <Eye className="h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />
                )}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-default w-full">
            Login
          </button>
        </form>

        


        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "var(--color-primary)" }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

