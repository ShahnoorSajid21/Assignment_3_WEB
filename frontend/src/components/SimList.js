export default function SimList({ simulations, onSelect, onDelete }) {
  if (!simulations || simulations.length === 0) {
    return (
      <div className="card">
        <h4>My Simulations</h4>
        <p>No simulations yet. Create one above.</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h4>My Simulations</h4>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Initial</th>
            <th>Years</th>
            <th>Risk</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {simulations.map((sim, i) => (
            <tr key={i} onClick={() => onSelect(sim)} style={{ cursor: 'pointer' }}>
              <td>{new Date(sim.createdAt).toLocaleDateString()}</td>
              <td>{sim.initialAmount}</td>
              <td>{sim.years}</td>
              <td>{sim.riskLevel}</td>
              <td>
                <button
                  className="btn-primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(sim._id)
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
