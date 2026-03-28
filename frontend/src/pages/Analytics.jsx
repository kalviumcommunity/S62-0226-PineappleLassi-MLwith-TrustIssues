import { useEffect, useState } from "react"

import { fetchAnalytics, fetchSessions } from "../services/api"

import RiskTrendChart from "../charts/RiskTrendChart"
import DeviceChart from "../charts/DeviceChart"
import DepartmentHeatmap from "../charts/Heatmap"

function Analytics() {

  const [analytics, setAnalytics] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchAnalytics(),
      fetchSessions()
    ]).then(([analyticsData, sessionsData]) => {
      setAnalytics(analyticsData)
      setSessions(sessionsData)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return <div className="p-8">Loading analytics...</div>
  }

  if (!analytics) {
    return <div className="p-8 text-red-500">Failed to load analytics</div>
  }

  // -----------------------------------
  // ✅ 1. RISK TREND (FORCE ISO DATE)
  // -----------------------------------
  const riskTrendData = analytics.risk_over_time.map(r => ({
    day: new Date(r.day).toISOString().split("T")[0], // ISO: YYYY-MM-DD
    risk: r.risk
  }))

  // -----------------------------------
  // ✅ 2. DEVICE RISK (BACKEND OR FALLBACK)
  // -----------------------------------
  let deviceData = []

  if (analytics.device_risk && analytics.device_risk.length > 0) {
    // ✅ Use backend data
    deviceData = analytics.device_risk.map(d => ({
      name: d.device_type,
      value: d.count
    }))
  } else {
    // 🔥 Fallback → derive from REAL sessions (NOT mock)
    const deviceMap = {}

    sessions.forEach(s => {
      const device = s.device_type || "Unknown"

      if (!deviceMap[device]) deviceMap[device] = 0
      deviceMap[device] += 1
    })

    deviceData = Object.keys(deviceMap).map(d => ({
      name: d,
      value: deviceMap[d]
    }))
  }

  // -----------------------------------
  // ✅ 3. DEPARTMENT RISK (FORMAT FIX)
  // -----------------------------------
  const deptData = analytics.department_risk.map(d => ({
    name: d.department,
    risk: d.score
  }))

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <h1 className="text-3xl font-bold text-slate-700 mb-8">
        SOC Analytics
      </h1>

      {/* ROW 1 */}
      <div className="grid grid-cols-2 gap-8 mb-8">

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="font-semibold text-slate-600 mb-4">
            Organizational Risk Trend
          </h2>
          <RiskTrendChart data={riskTrendData} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="font-semibold text-slate-600 mb-4">
            Device Risk Distribution
          </h2>

          {deviceData.length === 0 && (
            <div className="text-xs text-red-400 mb-2">
              No device data available
            </div>
          )}

          <DeviceChart data={deviceData} />
        </div>

      </div>

      {/* ROW 2 */}
      <div className="bg-white rounded-2xl p-6 shadow">
        <h2 className="font-semibold text-slate-600 mb-4">
          Department Risk Heatmap
        </h2>
        <DepartmentHeatmap data={deptData} />
      </div>

    </div>
  )
}

export default Analytics