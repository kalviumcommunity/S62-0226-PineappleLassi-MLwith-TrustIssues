function RiskyUsersTable({ data }) {

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="grid grid-cols-5 text-xs text-slate-500 px-4 py-2 border-b border-indigo-500/10">
        <div>User</div>
        <div>Department</div>
        <div>Risk Score</div>
        <div>Variability</div>
        <div>Last Anomaly</div>
      </div>

      {/* ROWS */}
      {data.length === 0 && (
        <div className="text-slate-500 text-sm p-4">
          No risky users detected
        </div>
      )}

      {data.map((user, i) => {

        const riskPercent = (Math.abs(user.risk_score) * 100).toFixed(1)

        return (
          <div
            key={i}
            className="grid grid-cols-5 px-4 py-3 border-b border-indigo-500/5 hover:bg-indigo-500/5 transition"
          >

            <div className="text-white">
              {user.user_id}
            </div>

            <div className="text-slate-400">
              {user.department || "Unknown"}
            </div>

            <div className="text-red-400 font-semibold">
              {riskPercent}%
            </div>

            <div className="text-purple-400">
              {user.variability_score.toFixed(2)}
            </div>

            <div className="text-slate-500 text-xs">
              {user.last_anomaly_timestamp || "-"}
            </div>

          </div>
        )
      })}

    </div>
  )
}

export default RiskyUsersTable