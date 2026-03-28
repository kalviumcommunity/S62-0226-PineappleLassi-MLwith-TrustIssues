import { useEffect, useState } from "react"

import { fetchUsers, fetchUserIntelligence } from "../services/api"

import UserRiskTrendChart from "../charts/UserRiskTrendChart"
import LoginDistributionChart from "../charts/LoginDistributionChart"
import BehaviourComplianceBars from "../charts/BehaviourComplianceBars"
import RadarBehaviourChart from "../charts/RadarBehaviourChart"
import DataAccessChart from "../charts/DataAccessChart"

function Intelligence() {

  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // ----------------------------
  // LOAD USERS
  // ----------------------------
  useEffect(() => {
    fetchUsers().then(res => {
      setUsers(res)

      if (res.length) {
        setSelectedUser(res[0].user_id)
      }
    })
  }, [])

  // ----------------------------
  // LOAD INTELLIGENCE
  // ----------------------------
  useEffect(() => {
    if (!selectedUser) return

    fetchUserIntelligence(selectedUser).then(res => {
      setData(res)
      setLoading(false)
    })
  }, [selectedUser])

  // ----------------------------
  // LOADING STATE
  // ----------------------------
  if (loading) {
    return <div className="p-8">Loading intelligence...</div>
  }

  if (!data) {
    return <div className="p-8 text-red-500">Failed to load intelligence</div>
  }

  // ----------------------------
  // ✅ SAFE DATE HANDLING (FIX CRASH)
  // ----------------------------
  const riskTrend = data.risk_trend
    .filter(r => r.day) // remove empty
    .map(r => {
      const d = new Date(r.day)

      if (isNaN(d.getTime())) {
        console.warn("Invalid date from backend:", r.day)
        return null
      }

      return {
        day: d.toISOString().split("T")[0], // ISO format
        risk: r.risk
      }
    })
    .filter(Boolean)

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold text-slate-700">
          Behaviour Intelligence Console
        </h1>

        <select
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
          className="border p-3 rounded-xl"
        >
          {users.map(u => (
            <option key={u.user_id} value={u.user_id}>
              {u.user_id} — {u.department}
            </option>
          ))}
        </select>

      </div>

      {/* ---------------------------- */}
      {/* ✅ RISK TREND */}
      {/* ---------------------------- */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="font-semibold mb-2">
          Behaviour Risk Trend
        </h2>
        <UserRiskTrendChart data={riskTrend} />
      </div>

      {/* ---------------------------- */}
      {/* ✅ LOGIN + DATA ACCESS */}
      {/* ---------------------------- */}
      <div className="grid grid-cols-2 gap-8 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">
            Login Behaviour Pattern
          </h2>
          <LoginDistributionChart data={data.login_deviation} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">
            Data Access Behaviour
          </h2>
          <DataAccessChart data={data.data_access} />
        </div>

      </div>

      {/* ---------------------------- */}
      {/* ✅ COMPLIANCE + FEATURE */}
      {/* ---------------------------- */}
      <div className="grid grid-cols-2 gap-8 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">
            Behaviour Compliance
          </h2>
          <BehaviourComplianceBars data={data.compliance} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="font-semibold mb-4">
            Risk Contribution Factors
          </h2>

          {data.feature_importance.map(f => (

            <div key={f.feature} className="mb-3">

              <div className="flex justify-between text-sm mb-1">
                <span>{f.feature}</span>
                <span>{(f.impact * 100).toFixed(0)}%</span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-purple-400 h-2 rounded-full"
                  style={{ width: `${f.impact * 100}%` }}
                />
              </div>

            </div>

          ))}

        </div>

      </div>

      {/* ---------------------------- */}
      {/* ✅ RADAR */}
      {/* ---------------------------- */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-2">
          Behaviour Fingerprint
        </h2>
        <RadarBehaviourChart data={data.radar_profile} />
      </div>

    </div>
  )
}

export default Intelligence