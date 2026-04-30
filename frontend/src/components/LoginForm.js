import { useState } from 'react'
import { Link } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000'

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrMsg("")
    if (!email || !password) {
      setErrMsg('Please fill all fields')
      return
    }
    try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
      const data = await res.json()
      if (!res.ok) {
        setErrMsg(data.msg || 'Login failed')
        return
      }
      onLogin(data.token, data.user)
    } catch (err) {
      setErrMsg('network error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Email</label>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} />
      <label>Password</label>
      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button className="btn-primary" type="submit">Login</button>
      {errMsg ? <div className="errorText">{errMsg}</div> : null}
      <p>Don't have account? <Link to="/signup">Signup</Link></p>
    </form>
  )
}

export default LoginForm
