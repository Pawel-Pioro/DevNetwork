import React from 'react'
import ReactDOM from "react-dom/client"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Layout from './Layout.jsx'
import Login from './Auth/Login.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
