function AnomalyPanel() {

  const anomalies = [
    "Rare bulk export detected",
    "Off-hours login spike",
    "Cross-department resource access",
    "Privilege sequence anomaly"
  ]

  return (
    <div className="bg-white p-6 rounded-2xl shadow">

      <h2 className="font-semibold mb-4">
        Top Behavioural Anomalies
      </h2>

      {anomalies.map(a => (
        <div
          key={a}
          className="border-l-4 border-red-400 pl-3 mb-3 text-sm"
        >
          {a}
        </div>
      ))}

    </div>
  )
}

export default AnomalyPanel