import { useState } from 'react'

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000"

export default function SimForm({ token, onCreated }) {
  const [initialAmount, setInitialAmount] = useState(1000)
  const [monthlyContribution, setMonthlyContribution] = useState(100)
  const [annualRate, setAnnualRate] = useState(7)
  const [years, setYears] = useState(5)
  const [riskLevel, setRiskLevel] = useState('medium')
  const [errMsg, setErrMsg] = useState("")
  var btn = 'Save Simulation'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrMsg('')
    if (Number(initialAmount) < 0 || Number(monthlyContribution) < 0 || Number(annualRate) <= 0 || Number(years) <= 0) {
      setErrMsg('Please enter valid positive numbers')
      return
    }
    if (Number(years) > 50) {
      setErrMsg('Years max is 50')
      return
    }

    try {
      const sim_payload = { initialAmount, monthlyContribution, annualRate, years, riskLevel }
      const res = await fetch(`${API_BASE}/api/simulations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(sim_payload)
      })
      const data = await res.json()
      if (!res.ok) {
        setErrMsg(data.msg || 'Failed to create simulation')
        return
      }
      setInitialAmount(1000)
      setMonthlyContribution(100)
      setAnnualRate(7)
      setYears(5)
      setRiskLevel('medium')
      alert('Simulation saved!')
      if (onCreated) onCreated()
    } catch (err) {
      setErrMsg('Server is not reachable')
    }
  }

  return (
    <div className="card simform">
      <h3>New Simulation</h3>
      <form onSubmit={handleSubmit}>
        <label>Initial Amount</label>
        <input type="number" value={initialAmount} onChange={(e)=>setInitialAmount(e.target.value)} />
        <label>Monthly Contribution</label>
        <input type="number" value={monthlyContribution} onChange={(e)=>setMonthlyContribution(e.target.value)} />
        <label>Annual Return Rate (%)</label>
        <input type="number" value={annualRate} onChange={(e)=>setAnnualRate(e.target.value)} />
        <label>Years (1-50)</label>
        <input type="number" value={years} onChange={(e)=>setYears(e.target.value)} />
        <label>Risk Level</label>
        <select value={riskLevel} onChange={(e)=>setRiskLevel(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button className="btn-primary" type="submit">{btn}</button>
        {errMsg ? <div className="errorText">{errMsg}</div> : null}
      </form>
    </div>
  )
}
