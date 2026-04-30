import { useState } from "react"
import { Link } from "react-router-dom"

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000'

export default function SignupForm({ onSignup }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState("")

  const doThing = async (e) => {
    e.preventDefault()
    setErrMsg('')
    if (!name) return setErrMsg('Name required')
    if (!email.includes('@')) return setErrMsg('Email not valid')
    if (password.length < 6) return setErrMsg('Password min 6 chars')

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setErrMsg(data.msg || 'Signup failed')
        return
      }
      onSignup(data.token, data.user)
    } catch (err) {
      setErrMsg('Cannot connect to server')
    }
  }

  return (
    <form onSubmit={doThing}>
      <label>Name</label>
      <input value={name} onChange={(e)=>setName(e.target.value)} />
      <label>Email</label>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} />
      <label>Password</label>
      <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button className="btn-primary" type="submit">Signup</button>
      {errMsg ? <div className="errorText">{errMsg}</div> : null}
      <p>Have account? <Link to="/login">Login</Link></p>
    </form>
  )
}
