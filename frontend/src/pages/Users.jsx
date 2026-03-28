import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchSessions, fetchUsers } from "../services/api"

function Users() {

  const [sessions, setSessions] = useState([])
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [riskFilter, setRiskFilter] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    fetchSessions().then(setSessions)
    fetchUsers().then(setUsers)
  }, [])

  // 🔥 GROUP SESSIONS BY USER
  const userMap = {}

  sessions.forEach(s => {

    if (!userMap[s.user_id]) {
      userMap[s.user_id] = {
        totalRisk: 0,
        count: 0,
        maxRiskLevel: "LOW",
        lastActivity: s.timestamp,
        anomalyCount: 0
      }
    }

    const u = userMap[s.user_id]

    u.totalRisk += Math.abs(s.risk_score)
    u.count += 1

    if (s.risk_level === "HIGH") u.maxRiskLevel = "HIGH"
    else if (s.risk_level === "MEDIUM" && u.maxRiskLevel !== "HIGH")
      u.maxRiskLevel = "MEDIUM"

    if (new Date(s.timestamp) > new Date(u.lastActivity)) {
      u.lastActivity = s.timestamp
    }

    if (s.is_anomaly) u.anomalyCount += 1
  })

  // 🔥 MERGE USERS + SESSIONS
  let rows = users.map(user => {

    const sessionData = userMap[user.user_id]

    if (!sessionData) {
      return {
        user_id: user.user_id,
        department: user.department,
        role: user.role,
        avgRisk: "0%",
        riskLevel: "LOW",
        anomalyCount: 0,
        lastActivity: "No activity"
      }
    }

    return {
      user_id: user.user_id,
      department: user.department,
      role: user.role,
      avgRisk: ((sessionData.totalRisk / sessionData.count) * 100).toFixed(1) + "%",
      riskLevel: sessionData.maxRiskLevel,
      anomalyCount: sessionData.anomalyCount,
      lastActivity: new Date(sessionData.lastActivity).toLocaleString()
    }
  })

  // 🔍 SEARCH
  rows = rows.filter(r =>
    r.user_id.toLowerCase().includes(search.toLowerCase()) ||
    r.department.toLowerCase().includes(search.toLowerCase()) ||
    r.role.toLowerCase().includes(search.toLowerCase())
  )

  // 🎯 FILTER
  if (riskFilter)
    rows = rows.filter(r => r.riskLevel === riskFilter)

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold text-slate-700 mb-6">
        Users Investigation Hub
      </h1>

      {/* SEARCH */}
      <input
        placeholder="Search User / Department / Role"
        className="border p-3 rounded-xl w-full mb-6"
        onChange={e => setSearch(e.target.value)}
      />

      {/* FILTER */}
      <div className="mb-8">
        <select
          onChange={e => setRiskFilter(e.target.value)}
          className="border p-2 rounded-xl"
        >
          <option value="">Risk Level</option>
          <option>LOW</option>
          <option>MEDIUM</option>
          <option>HIGH</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow">

        <table className="w-full text-sm">

          <thead className="text-slate-400 text-left">
            <tr>
              <th className="p-4">User</th>
              <th>Department</th>
              <th>Role</th>
              <th>Avg Risk</th>
              <th>Risk Level</th>
              <th>Anomalies</th>
              <th>Last Activity</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {rows.map(r => (
              <tr key={r.user_id} className="border-t h-14 hover:bg-slate-50">

                <td className="p-4 font-semibold">{r.user_id}</td>
                <td>{r.department}</td>
                <td>{r.role}</td>
                <td>{r.avgRisk}</td>

                <td className="text-red-400 font-semibold">
                  {r.riskLevel}
                </td>

                <td>{r.anomalyCount}</td>
                <td>{r.lastActivity}</td>

                <td>
                  <button
                    onClick={() => navigate(`/users/${r.user_id}`)}
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg"
                  >
                    View Intelligence
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Users