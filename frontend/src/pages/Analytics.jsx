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
    return (
      <div className="p-8 text-slate-400">
        Loading analytics...
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-8 text-red-400">
        Failed to load analytics
      </div>
    )
  }

  // ----------------------------
  // DATA TRANSFORM (UNCHANGED)
  // ----------------------------
  const riskTrendData = analytics.risk_over_time.map(r => ({
    day: new Date(r.day).toISOString().split("T")[0],
    risk: r.risk
  }))

  let deviceData = []

  if (analytics.device_risk && analytics.device_risk.length > 0) {
    deviceData = analytics.device_risk.map(d => ({
      name: d.device_type,
      value: d.count
    }))
  } else {
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

  const deptData = analytics.department_risk.map(d => ({
    name: d.department,
    risk: d.score
  }))

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="mb-10">

        <div className="text-xs tracking-widest text-indigo-400 mb-2">
          ANALYTICS
        </div>

        <h1 className="text-2xl font-bold text-white">
          Organizational Risk Insights
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Monitor system-wide behavioral patterns and anomalies
        </p>

      </div>

      {/* TOP GRID */}
      <div className="grid grid-cols-2 gap-8 mb-10">

        {/* RISK TREND */}
        <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6">

          <div className="mb-4">
            <h2 className="text-sm tracking-widest text-indigo-400">
              RISK TREND
            </h2>
            <p className="text-xs text-slate-500">
              Organizational risk progression over time
            </p>
          </div>

          <RiskTrendChart data={riskTrendData} />

        </div>

        {/* DEVICE DISTRIBUTION */}
        <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6">

          <div className="mb-4">
            <h2 className="text-sm tracking-widest text-indigo-400">
              DEVICE DISTRIBUTION
            </h2>
            <p className="text-xs text-slate-500">
              Risk exposure across device types
            </p>
          </div>

          {deviceData.length === 0 && (
            <div className="text-xs text-red-400 mb-2">
              No device data available
            </div>
          )}

          <DeviceChart data={deviceData} />

        </div>

      </div>

      {/* HEATMAP */}
      <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6">

        <div className="mb-5">
          <h2 className="text-sm tracking-widest text-indigo-400">
            DEPARTMENT RISK HEATMAP
          </h2>
          <p className="text-xs text-slate-500">
            Risk distribution across organizational units
          </p>
        </div>

        <DepartmentHeatmap data={deptData} />

      </div>

    </div>
  )
}

export default Analytics