import { useEffect, useState } from "react"
import { fetchUsers, fetchSessions } from "../services/api"
import { useNavigate } from "react-router-dom"

function Users() {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([fetchUsers(), fetchSessions()])
      .then(([usersData, sessionsData]) => {

        const mapped = usersData.map(user => {

          const userSessions =
            sessionsData.filter(s => s.user_id === user.user_id)

          const anomalies =
            userSessions.filter(s => s.is_anomaly).length

          const avgRisk =
            userSessions.length
              ? (
                  userSessions.reduce((sum, s) =>
                    sum + Math.abs(s.risk_score), 0
                  ) / userSessions.length * 100
                ).toFixed(1)
              : 0

          const lastActivity =
            userSessions.length
              ? userSessions[userSessions.length - 1].timestamp
              : "-"

          return {
            user_id: user.user_id,
            department: user.department || "Unknown",
            role: user.role || "user",
            avg_risk: avgRisk,
            anomalies,
            last_activity: lastActivity
          }
        })

        setUsers(mapped)
      })
  }, [])

  const getRiskLevel = (risk) => {
    if (risk >= 15) return "HIGH"
    if (risk >= 10) return "MEDIUM"
    return "LOW"
  }

  const getRiskColor = (level) => {
    if (level === "HIGH") return "text-red-400"
    if (level === "MEDIUM") return "text-orange-400"
    return "text-green-400"
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-slate-200 font-mono p-8">

      {/* HEADER */}
      <div className="mb-8">
        <div className="text-[11px] tracking-[3px] text-indigo-400 mb-2">
          USER MONITORING
        </div>

        <h1 className="text-2xl font-bold text-white">
          Behavioral Risk Profiles
        </h1>

        <p className="text-xs text-slate-500 mt-2">
          Real-time user activity and anomaly tracking
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-8 text-xs text-slate-500 px-6 py-3 border-b border-indigo-500/10 tracking-wider">
          <div>User</div>
          <div>Department</div>
          <div>Role</div>
          <div>Avg Risk</div>
          <div>Risk Level</div>
          <div>Anomalies</div>
          <div>Last Activity</div>
          <div></div>
        </div>

        {/* ROWS */}
        {users.map((user, i) => {
          const riskValue = parseFloat(user.avg_risk)
          const riskLevel = getRiskLevel(riskValue)

          return (
            <div
              key={i}
              className="grid grid-cols-8 items-center px-6 py-4 border-b border-indigo-500/5 hover:bg-indigo-500/5 transition"
            >

              <div className="text-slate-200 font-medium">
                {user.user_id}
              </div>

              <div className="text-slate-400">
                {user.department}
              </div>

              <div className="text-slate-400">
                {user.role}
              </div>

              <div className="text-slate-300">
                {user.avg_risk}%
              </div>

              <div className={`font-semibold ${getRiskColor(riskLevel)}`}>
                {riskLevel}
              </div>

              <div className="text-slate-400">
                {user.anomalies}
              </div>

              <div className="text-slate-500 text-sm">
                {user.last_activity}
              </div>

              <div>
                <button
                  onClick={() => navigate(`${user.user_id}`)}
                  className="px-3 py-1 text-xs rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition"
                >
                  View Intelligence
                </button>
              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default Users