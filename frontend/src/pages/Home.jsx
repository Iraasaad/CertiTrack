import { Link } from "react-router-dom"
import { Award, CheckCircle, FileText, Shield } from "lucide-react"

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Manage Your Credentials with Confidence</h1>
            <p className="hero-description">
              CertiTrack helps you store, organize, and validate your diplomas and certificates in one secure place.
            </p>
            <div className="hero-actions">
              <Link to="/dashboard">
                <button className="btn btn-default btn-lg">View Dashboard</button>
              </Link>
              <Link to="/signup">
                <button className="btn btn-secondary btn-lg">Get Started</button>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-container">
              <div className="hero-image-bg"></div>
              <div className="hero-image-content">
                <FileText className="hero-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-header">
            <h2 className="features-title">Features</h2>
            <p className="features-description">Everything you need to manage your educational achievements</p>
          </div>
          <div className="features-grid">
            <div className="card">
              <Shield className="feature-card-icon" />
              <h3 className="text-xl font-bold mb-2">Secure Storage</h3>
              <p className="text-sm mb-2" style={{ color: "var(--color-muted-foreground)" }}>
                Keep all your important documents safe in one place
              </p>
              <p>Your diplomas and certificates are encrypted and securely stored, accessible only to you.</p>
            </div>
            <div className="card">
              <CheckCircle className="feature-card-icon" />
              <h3 className="text-xl font-bold mb-2">Easy Validation</h3>
              <p className="text-sm mb-2" style={{ color: "var(--color-muted-foreground)" }}>
                Verify the authenticity of your credentials
              </p>
              <p>Share your credentials with employers or institutions with built-in validation features.</p>
            </div>
            <div className="card">
              <Award className="feature-card-icon" />
              <h3 className="text-xl font-bold mb-2">Comprehensive Management</h3>
              <p className="text-sm mb-2" style={{ color: "var(--color-muted-foreground)" }}>
                Organize and filter your achievements
              </p>
              <p>Sort by type, field of study, date, or any other criteria to quickly find what you need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">10,000+</div>
              <div className="stat-label">Users Trust CertiTrack</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">50,000+</div>
              <div className="stat-label">Documents Managed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">99.9%</div>
              <div className="stat-label">Uptime Reliability</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

