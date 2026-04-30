import { Navigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

export default function LoginPage({ onLogin, token }) {
 if (token) return <Navigate to="/dashboard" />

 return (
  <div className="card" style={{ marginTop: '10px' }}>
    <h2>Login</h2>
    <LoginForm onLogin={onLogin} />
  </div>
 )
}
