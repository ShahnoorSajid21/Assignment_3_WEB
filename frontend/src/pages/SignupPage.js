import SignupForm from "../components/SignupForm"
import { Navigate } from "react-router-dom"

function SignupPage({ onSignup, token }) {
    if (token) {
      return <Navigate to="/dashboard" />
    }

    return (
      <div className="card">
        <h2>Create Account</h2>
        <SignupForm onSignup={onSignup} />
      </div>
    )
}

export default SignupPage
