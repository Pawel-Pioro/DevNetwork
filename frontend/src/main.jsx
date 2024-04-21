import React from 'react'
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout.jsx'
import Login from './Auth/Login.jsx'
import Logout from './Auth/Logout.jsx'
import Register from './Auth/Register.jsx'
import Profile from './Profile.jsx'
import SearchResults from './SearchResults.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          <Route path="register" element={<Register />} />
          <Route path="profile/:username" element={<Profile />} />
          <Route path="search" element={<SearchResults />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
