"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:8000/backend/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/dashboard";
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
        <h1 className="text-2xl font-bold mb-2">Create an account</h1>
        <p className="text-sm mb-4" style={{ color: "var(--color-muted-foreground)" }}>
          Enter your information to create a CertiTrack account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="input w-full"
              placeholder="John Smith"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
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
                style={{ background: "none", border: "none", cursor: "pointer" ,  position:"relative", bottom:"33px", left:"310px"}}
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="input w-full pr-10"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ background: "none", border: "none", cursor: "pointer", position:"relative", bottom:"33px", left:"310px" }}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />
                ) : (
                  <Eye className="h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />
                )}
                <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
              </button>
            </div>
          </div>

          <div
            className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border"
            style={{ borderColor: "var(--color-border)" ,}}
          >
            <input type="checkbox" id="terms" name="terms" checked={formData.terms} onChange={handleChange} required />
            <div className="space-y-1 leading-none">
              <label htmlFor="terms" style={{paddingLeft:"10px"}} className="text-sm font-medium">
                I agree to the{" "}
                <Link to="/terms" style={{ color: "var(--color-primary)" }}>
                  terms of service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" style={{ color: "var(--color-primary)" }}>
                  privacy policy
                </Link>
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-default w-full">
            Create Account
          </button>
        </form>





        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--color-primary)" }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup

