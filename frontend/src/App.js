import './App.css'
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import SignupPage from "./pages/SignupPage"
import DashboardPage from './pages/DashboardPage'

function App() {
  const tokenFromStorage = localStorage.getItem('token')
  const userFromStorage = localStorage.getItem('user')
  const [token, setToken] = useState(tokenFromStorage || '')
  const [user, setUser] = useState(userFromStorage ? JSON.parse(userFromStorage) : null)

  const doLogin = (tok, usr) => {
    localStorage.setItem('token', tok)
    localStorage.setItem('user', JSON.stringify(usr))
    setToken(tok)
    setUser(usr)
  }

  return (
    <div className="appWrap">
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={doLogin} token={token} />} />
      <Route path="/signup" element={<SignupPage onSignup={doLogin} token={token} />} />
      <Route
        path="/dashboard"
        element={token ? <DashboardPage token={token} user={user} /> : <Navigate to="/login" />}
      />
      <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
    </Routes>
    </div>
  )
}

export default App
