import { useEffect, useState } from "react"

import { fetchSessions, fetchUsers } from "../services/api"

import { sessionsMock } from "../services/sessionsMock"
import { eventsMock } from "../services/eventsMock"

import {
  generateDeviceRisk
} from "../services/intelligenceEngine"

import RiskTrendChart from "../charts/RiskTrendChart"
import DeviceChart from "../charts/DeviceChart"
import DepartmentHeatmap from "../charts/Heatmap"

function Analytics() {

  const [sessions, setSessions] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchSessions().then(setSessions)
    fetchUsers().then(setUsers)
  }, [])

  // 🔥 REAL: Risk Trend (from sessions)
  const riskTrendMap = {}

  sessions.forEach(s => {

    const day =
      new Date(s.timestamp).toLocaleDateString()

    if (!riskTrendMap[day]) riskTrendMap[day] = 0

    riskTrendMap[day] += Math.abs(s.risk_score)
  })

  const riskTrendData =
    Object.keys(riskTrendMap).map(d => ({
      day: d,
      risk: Number(riskTrendMap[d].toFixed(1))
    }))


  // 🔥 MOCK: Device Risk (keep for now)
  const deviceRiskData =
    generateDeviceRisk(sessionsMock, eventsMock)


  // 🔥 REAL: Department Risk (users + sessions)
  const userDeptMap = {}

  users.forEach(u => {
    userDeptMap[u.user_id] = u.department
  })

  const deptMap = {}

  sessions.forEach(s => {

    const dept = userDeptMap[s.user_id] || "Unknown"

    if (!deptMap[dept]) deptMap[dept] = 0

    deptMap[dept] += Math.abs(s.risk_score)
  })

  const deptRiskData =
    Object.keys(deptMap).map(d => ({
      name: d,
      risk: Number(deptMap[d].toFixed(1))
    }))


  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <h1 className="text-3xl font-bold text-slate-700 mb-8">
        SOC Analytics
      </h1>

      {/* ROW 1 */}
      <div className="grid grid-cols-2 gap-8 mb-8">

        {/* ✅ REAL */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="font-semibold text-slate-600 mb-4">
            Organizational Risk Trend
          </h2>
          <RiskTrendChart data={riskTrendData} />
        </div>

        {/* ⚠️ MOCK (kept intentionally) */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="font-semibold text-slate-600 mb-4">
            Device Risk Distribution
          </h2>

          <div className="text-xs text-orange-400 mb-2">
            Using mock data (backend not integrated)
          </div>

          <DeviceChart data={deviceRiskData} />
        </div>

      </div>

      {/* ROW 2 */}
      <div className="bg-white rounded-2xl p-6 shadow">
        <h2 className="font-semibold text-slate-600 mb-4">
          Department Risk Heatmap
        </h2>
        <DepartmentHeatmap data={deptRiskData} />
      </div>

    </div>
  )
}

export default Analytics