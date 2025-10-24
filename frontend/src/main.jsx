import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App";
import "./styles/globals.css"
import "./styles/components.css"
import "./styles/layout.css"
import "./styles/page/home.css"
import "./styles/page/dashboard.css"
import "./styles/page/auth.css"
import "./styles/page/profile.css"
import "./styles/page/form.css"



const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

