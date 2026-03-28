import { useNavigate } from "react-router-dom"

function RiskyUsersTable({ data }) {

  const navigate = useNavigate()

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="grid grid-cols-6 text-xs text-slate-500 px-4 py-2 border-b border-indigo-500/10">
        <div>User</div>
        <div>Department</div>
        <div>Risk Score</div>
        <div>Variability</div>
        <div>Last Anomaly</div>
        <div className="text-right">Action</div>
      </div>

      {/* EMPTY STATE */}
      {data.length === 0 && (
        <div className="text-slate-500 text-sm p-4">
          No risky users detected
        </div>
      )}

      {/* ROWS */}
      {data.map((user, i) => {

        const riskPercent = (Math.abs(user.risk_score) * 100).toFixed(1)

        return (
          <div
            key={i}
            className="grid grid-cols-6 px-4 py-3 border-b border-indigo-500/5 hover:bg-indigo-500/5 transition items-center"
          >

            {/* USER */}
            <div className="text-white">
              {user.user_id}
            </div>

            {/* DEPARTMENT */}
            <div className="text-slate-400">
              {user.department || "Unknown"}
            </div>

            {/* RISK */}
            <div className="text-red-400 font-semibold">
              {riskPercent}%
            </div>

            {/* VARIABILITY */}
            <div className="text-purple-400">
              {user.variability_score.toFixed(2)}
            </div>

            {/* TIMESTAMP */}
            <div className="text-slate-500 text-xs">
              {user.last_anomaly_timestamp || "-"}
            </div>

            {/* 🔥 INVESTIGATE BUTTON */}
            <div className="text-right">
              <button
                onClick={() => navigate(`/users/${user.user_id}`)}
                className="px-3 py-1 text-xs rounded-md 
                           bg-indigo-500/10 border border-indigo-500/20 
                           text-indigo-300 hover:bg-indigo-500/20 transition"
              >
                Investigate
              </button>
            </div>

          </div>
        )
      })}

    </div>
  )
}

export default RiskyUsersTable