import { useState } from "react"
import Header from '../components/Header'
import SimForm from "../components/SimForm"
import SimList from '../components/SimList'
import SimResult from "../components/SimResult"

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000'

export default function DashboardPage({ token, user }) {
  const [simulations, setSimulations] = useState([])
  const [selectedSim, setSelectedSim] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchSimulations = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_BASE}/api/simulations`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.msg || 'Failed to load')
      }
      console.log('sim list', data)
      setSimulations(data)
    } catch (e) {
      setError(e.message || 'Error loading simulations')
    } finally {
      setLoading(false)
    }
  }

  const removeSim = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/simulations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.msg || 'Could not delete')
        return
      }
      fetchSimulations()
      if (selectedSim && selectedSim._id === id) setSelectedSim(null)
    } catch (e) {
      setError('Delete failed')
    }
  }

  return (
    <div>
      <Header user={user} />
      <div className="row" style={{ alignItems: "flex-start" }}>
        <div style={{ width: '48%' }}>
          <SimForm token={token} onCreated={fetchSimulations} />
          <div className="card">
            <button className="btn-primary" onClick={fetchSimulations}>
              {loading ? 'Loading...' : 'Load My Simulations'}
            </button>
            {error ? <p className="errorText">{error}</p> : null}
          </div>
          <SimList simulations={simulations} onSelect={setSelectedSim} onDelete={removeSim} />
        </div>
        <div style={{ width: '48%' }}>
          <SimResult simulation={selectedSim} />
        </div>
      </div>
    </div>
  )
}
