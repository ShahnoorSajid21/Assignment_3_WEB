export default function SimResult({ simulation }) {
  if (!simulation) {
    return (
      <div className="card">
        <h3>Simulation Result</h3>
        <p>Select a simulation to view results</p>
      </div>
    )
  }

  const info = simulation.results || {}
  const isGain = (info.gainLoss || 0) >= 0

  return (
    <div className="card simulation-card">
      <h3>Simulation Result</h3>
      <p><strong>Total Invested:</strong> {info.totalInvested}</p>
      <p><strong>Projected Value:</strong> {info.projectedValue}</p>
      <p className={isGain ? 'gain' : 'loss'}>
        <strong>Gain/Loss:</strong> {info.gainLoss}
      </p>
      <p><strong>Risk Level:</strong> {simulation.riskLevel}</p>

      <h4>Yearly Breakdown</h4>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Value</th>
            <th>Invested</th>
          </tr>
        </thead>
        <tbody>
          {(info.yearlyBreakdown || []).map((row, index) => (
            <tr key={index}>
              <td>{row.year}</td>
              <td>{row.value}</td>
              <td>{row.invested}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
