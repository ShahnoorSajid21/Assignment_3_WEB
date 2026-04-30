export default function Header({ user }) {
  const doLogout = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="card row">
      <h3>Investment Simulator</h3>
      <div>
        <span style={{ marginRight: '10px' }}>Hi, {user ? user.name : 'User'}</span>
        <button className="btn-primary" onClick={doLogout}>Logout</button>
      </div>
    </div>
  )
}
