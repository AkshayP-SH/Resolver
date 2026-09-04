import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Landing from './pages/Landing.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Profile from './pages/Profile.jsx'
import './App.css'
import ToastContainer from './components/Toast.jsx'


function App() {
  return (
    <ThemeProvider> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile/>} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  )
}
  
export default App
