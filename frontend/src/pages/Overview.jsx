import { useEffect, useState } from "react"
import StatCard from "../components/dashboard/StatCard"

import { fetchOverviewCharts, fetchRiskyUsers } from "../services/api"

import AlertTrendChart from "../charts/AlertTrendChart"
import RiskPieChart from "../charts/RiskPieChart"
import RiskyUsersTable from "../components/dashboard/RiskyUsersTable"

function Overview() {

  const [data, setData] = useState(null)
  const [time, setTime] = useState(new Date())
  const [topRiskUsers, setTopRiskUsers] = useState([]) // ✅ ADDED

  useEffect(() => {

    fetchOverviewCharts().then(setData)
    fetchRiskyUsers().then(setTopRiskUsers) // ✅ ADDED

    const clock = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(clock)

  }, [])

  // ----------------------------
  // LOADING STATE
  // ----------------------------
  if (!data) {
    return <div className="p-8">Loading overview...</div>
  }

  // ----------------------------
  // ✅ SYSTEM STATS
  // ----------------------------
  const stats = data.system_stats || {
    totalUsers: 0,
    highRiskUsers: 0,
    alertsToday: 0,
    avgRiskScore: 0
  }

  // ----------------------------
  // ✅ ALERT TREND (SAFE DATE FIX)
  // ----------------------------
  const alertTrendData = (data.alert_trend || [])
    .map(a => {
      const d = new Date(a.day)

      if (isNaN(d.getTime())) {
        console.warn("Invalid date:", a.day)
        return null
      }

      return {
        day: d.toISOString().split("T")[0],
        alerts: a.alerts
      }
    })
    .filter(Boolean)

  // ----------------------------
  // ✅ RISK DISTRIBUTION
  // ----------------------------
  const riskDistributionData = (data.risk_distribution || []).map(r => ({
    name: r.name,
    value: r.value
  }))

  return (
    <div className="min-h-screen w-full bg-[#0a0a0f] text-slate-200 font-mono p-8">

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>

      {/* HEADER */}
      <div className="mb-8">
        <div className="text-[11px] tracking-[3px] text-indigo-400 mb-2">
          COMMAND OVERVIEW
        </div>

        <h1 className="text-2xl font-bold text-white">
          SOC Command Center
        </h1>

        <div className="text-xs text-slate-500 mt-2">
          System Time: {time.toISOString().split("T")[1].split(".")[0]}
        </div>
      </div>

      {/* ---------------------------- */}
      {/* STATS */}
      {/* ---------------------------- */}
      <div className="grid grid-cols-6 gap-5 mb-10">
        <StatCard title="Total Users" value={stats.totalUsers} color="text-indigo-400" />
        <StatCard title="High Risk Users" value={stats.highRiskUsers} color="text-red-400" />
        <StatCard title="Alerts Today" value={stats.alertsToday} color="text-orange-400" />
        <StatCard
          title="Average Risk Score"
          value={`${(Math.abs(-1 * stats.avgRiskScore) * 100).toFixed(3)}%`}
          color="text-pink-400"
        />
      </div>

      {/* ---------------------------- */}
      {/* GRID */}
      {/* ---------------------------- */}
      <div className="grid grid-cols-2 gap-8">

        {/* ALERT TREND */}
        <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6">
          <h2 className="text-sm tracking-widest text-indigo-400 mb-3">
            ALERT TREND
          </h2>

          {alertTrendData.length > 0 ? (
            <AlertTrendChart data={alertTrendData} />
          ) : (
            <div className="text-xs text-slate-400">
              No alert data available
            </div>
          )}

        </div>

        {/* RISK DISTRIBUTION */}
        <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6">
          <h2 className="text-sm tracking-widest text-indigo-400 mb-3">
            RISK DISTRIBUTION
          </h2>

          {riskDistributionData.length > 0 ? (
            <RiskPieChart data={riskDistributionData} />
          ) : (
            <div className="text-xs text-slate-400">
              No risk data available
            </div>
          )}

        </div>

        {/* RISKY USERS TABLE */}
        <div className="col-span-2">
          <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm tracking-widest text-indigo-400">
                HIGH RISK ENTITIES
              </h2>

              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                LIVE MONITORING
              </div>
            </div>

            <RiskyUsersTable data={topRiskUsers} />

          </div>
        </div>

      </div>
    </div>
  )
}

export default Overview