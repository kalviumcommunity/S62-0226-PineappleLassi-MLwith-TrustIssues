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

  useEffect(() => {
    fetchUsers().then(res => {
      setUsers(res)
      if (res.length) setSelectedUser(res[0].user_id)
    })
  }, [])

  useEffect(() => {
    if (!selectedUser) return

    fetchUserIntelligence(selectedUser).then(res => {
      setData(res)
      setLoading(false)
    })
  }, [selectedUser])

  if (loading) return <div className="p-8 text-slate-400">Loading...</div>
  if (!data) return <div className="p-8 text-red-400">Error loading data</div>

  const riskTrend = data.risk_trend
    .filter(r => r.day)
    .map(r => ({
      day: new Date(r.day).toISOString().split("T")[0],
      risk: r.risk
    }))

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <div className="text-xs tracking-widest text-indigo-400 mb-2">
            INTELLIGENCE
          </div>

          <h1 className="text-2xl font-bold text-white">
            Behaviour Intelligence Console
          </h1>
        </div>

        <select
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
          className="bg-[#0f0f1a] border border-indigo-500/20 text-slate-300 px-4 py-2 rounded-lg"
        >
          {users.map(u => (
            <option key={u.user_id} value={u.user_id}>
              {u.user_id}
            </option>
          ))}
        </select>

      </div>

      {/* RISK TREND */}
      <div className="bg-[#0f0f1a] border border-indigo-500/20 p-6 rounded-xl mb-8">
        <UserRiskTrendChart data={riskTrend} />
      </div>

      {/* GRIDS */}
      <div className="grid grid-cols-2 gap-8 mb-8">

        <div className="bg-[#0f0f1a] p-6 rounded-xl border border-indigo-500/20">
          <LoginDistributionChart data={data.login_deviation} />
        </div>

        <div className="bg-[#0f0f1a] p-6 rounded-xl border border-indigo-500/20">
          <DataAccessChart data={data.data_access} />
        </div>

      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">

        <div className="bg-[#0f0f1a] p-6 rounded-xl border border-indigo-500/20">
          <BehaviourComplianceBars data={data.compliance} />
        </div>

        <div className="bg-[#0f0f1a] p-6 rounded-xl border border-indigo-500/20">

          {data.feature_importance.map(f => (
            <div key={f.feature} className="mb-4">

              <div className="flex justify-between text-sm mb-1">
                <span>{f.feature}</span>
                <span>{(f.impact * 100).toFixed(0)}%</span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${f.impact * 100}%` }}
                />
              </div>

            </div>
          ))}

        </div>

      </div>

      <div className="bg-[#0f0f1a] p-6 rounded-xl border border-indigo-500/20">
        <RadarBehaviourChart data={data.radar_profile} />
      </div>

    </div>
  )
}

export default Intelligence