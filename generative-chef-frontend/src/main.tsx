// src/main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./global.css"

// Import Bootstrap's CSS
import "bootstrap/dist/css/bootstrap.min.css"
// (Optional) Import Bootstrap's JS (for things like modals, dropdowns)
import "bootstrap/dist/js/bootstrap.bundle.min.js"

// Import Google Fonts
import "@fontsource/poppins"
import "@fontsource/playfair-display"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

