import { Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, GraduationCap } from "lucide-react"

export default function Footer() {
  return (
    <footer style={{borderTop:"1px solid #6d7a74"}} className=" pt-5">
      <div className="container py-10">
        <div style={{justifyContent:"space-between"}} className="row mb-3 flex grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div style={{width: "300px"}} className="col-md-12 space-y-4 company-info">
            <div className="flex items-center gap-2">
              <GraduationCap  style={{color:"d4af37"}} className="h-6 w-6 " />
              <h2 className="text-2xl font-bold">CertiTrack</h2>
            </div>
            <p style={{color:"#9ca48d"}} className="text-muted-foreground text-sm">
              Secure management and validation of your certifications and diplomas in one place.
            </p>
            <div className="flex items-center gap-4">
              <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <div className="rounded-full text-secondary hover:text-secondary hover:bg-secondary/10">
                  <Twitter style={{color:"d4af37"}}  className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </div>
              </Link>
              <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <div className="rounded-full text-secondary hover:text-secondary hover:bg-secondary/10">
                  <Facebook style={{color:"d4af37"}}  className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </div>
              </Link>
              <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <div className="rounded-full text-secondary hover:text-secondary hover:bg-secondary/10">
                  <Instagram style={{color:"d4af37"}}  className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </div>
              </Link>
              <Link to="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <div className="rounded-full text-secondary hover:text-secondary hover:bg-secondary/10">
                  <Linkedin style={{color:"d4af37"}}  className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{width: "300px"}} className="Quick-Links" >
            <h3 style={{color:"#1a5d3a"}} className="font-medium text-lg mb-4 ">Quick Links</h3>
            <ul style={{listStyle:"none", marginLeft:"-30px", color:"#9ca48d"}} className="space-y-2 Quick-links">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-secondary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/add-diploma" className="text-muted-foreground hover:text-secondary transition-colors">
                  Add Diploma
                </Link>
              </li>
              <li>
                <Link to="/add-certificate" className="text-muted-foreground hover:text-secondary transition-colors">
                  Add Certificate
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground hover:text-secondary transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div style={{width: "300px"}} className="Contact-Info">
            <h3 style={{color:"#1a5d3a"}} className="font-medium text-lg mb-4">Contact Us</h3>
            <ul style={{color:"#9ca48d", marginLeft:"-30px"}} className="space-y-3">
              <li className="mb-2 flex items-start gap-3 text-muted-foreground">
                <MapPin style={{color:"d4af37", width:"25px", height:"25px"}} className="shrink-0 mt-0.5 " />
                <span>123 Certification Ave, Education City, EC 12345</span>
              </li>
              <li className=" mb-2 flex items-center gap-3 text-muted-foreground">
                <Phone style={{color:"d4af37"}} className="h-5 w-5 shrink-0 " />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="mb-2 flex items-center gap-3 text-muted-foreground">
                <Mail style={{color:"d4af37"}} className="h-5 w-5 shrink-0 " />
                <span>support@certitrack.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div style={{width: "300px"}} className="Newsletter">
            <h3 style={{color:"#1a5d3a"}} className="font-medium text-lg Newsletter">Subscribe to Our Newsletter</h3>
            <p style={{color:"#9ca48d", width:"350px"}} className="text-muted-foreground text-sm mb-4">
              Stay updated with the latest features and announcements.
            </p>
            <div className="flex gap-2">
              <input
                style={{paddingLeft:"10px", border:"1px solid #e3e9f0", outlineColor:"#d4af37"}}
                type="email"
                placeholder="Your email address"
                className="rounded max-w-[220px] "
              />
              <button style={{backgroundColor:"#d4af37", border:"none"}} className="text-black py-2 px-4 rounded">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="my-8 bg-primary/10" />

        <div style={{borderTop:"1px solid #e3e9f0", color:"#62776d"}} className="website-policies pt-4 mb-4 flex justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CertiTrack. All rights reserved.
          </p>
          <div className=" flex justify-between gap-4">
            <Link to="/terms" className=" text-sm text-muted-foreground hover:text-secondary transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
