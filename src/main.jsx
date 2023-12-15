import React from 'react'
import ReactDOM from 'react-dom/client'
// import { BrowserRouter } from "react-router-dom"
// import App from './App.jsx'
import Auth from './auth'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <BrowserRouter>
  //   <App />
  // </BrowserRouter>
  <React.StrictMode>
  <Auth />
</React.StrictMode>
)
