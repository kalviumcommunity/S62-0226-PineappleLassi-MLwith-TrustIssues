import { useEffect, useState } from "react"
import StatCard from "../components/dashboard/StatCard"

import { fetchSessions } from "../services/api"

import { usersMock } from "../services/usersMock"
import { sessionsMock } from "../services/sessionsMock"
import { eventsMock } from "../services/eventsMock"

import {
  generateAlertTrend,
  generateRiskDistribution,
  generateTopRiskUsers
} from "../services/intelligenceEngine"

import AlertTrendChart from "../charts/AlertTrendChart"
import RiskPieChart from "../charts/RiskPieChart"
import RiskyUsersTable from "../components/dashboard/RiskyUsersTable"

function Overview() {

  const [sessions, setSessions] = useState([])

  useEffect(() => {
    fetchSessions().then(setSessions)
  }, [])

  // =========================
  // ✅ REAL (FROM BACKEND)
  // =========================

  const totalUsers =
    new Set(sessions.map(s => s.user_id)).size

  const highRiskUsers =
    new Set(
      sessions
        .filter(s => s.risk_level === "HIGH")
        .map(s => s.user_id)
    ).size

  const alertsToday =
    sessions.filter(s => s.is_anomaly).length

  const avgRisk =
    sessions.length
      ? (
          sessions.reduce((sum, s) =>
            sum + Math.abs(s.risk_score), 0
          ) / sessions.length * 100
        ).toFixed(1)
      : 0

  const dataExfiltration =
    sessions.filter(s =>
      s.reasons?.some(r =>
        r.toLowerCase().includes("data")
      )
    ).length

  // =========================
  // ⚠️ MOCK (TEMPORARY)
  // =========================

  const alertTrendData =
    generateAlertTrend(eventsMock)

  const riskDistributionData =
    generateRiskDistribution(usersMock, eventsMock, sessionsMock)

  const topRiskUsers =
    generateTopRiskUsers(usersMock, eventsMock, sessionsMock)

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <h1 className="text-3xl font-bold text-slate-700 mb-8">
        SOC Command Center
      </h1>

      {/* ✅ REAL STAT CARDS */}
      <div className="grid grid-cols-6 gap-5 mb-10">

        <StatCard title="Total Users" value={totalUsers} color="text-blue-500" />
        <StatCard title="High Risk Users" value={highRiskUsers} color="text-red-400" />
        <StatCard title="Alerts Today" value={alertsToday} color="text-orange-400" />
        <StatCard title="Active Incidents" value={alertsToday} color="text-purple-400" />
        <StatCard title="Average Risk Score" value={`${avgRisk}%`} color="text-pink-400" />
        <StatCard title="Data Exfiltration" value={dataExfiltration} color="text-rose-500" />

      </div>

      {/* ⚠️ HYBRID CHARTS */}
      <div className="grid grid-cols-2 gap-8">

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="font-semibold text-slate-600 mb-2">
            Alert Volume Trend
          </h2>

          <div className="text-xs text-orange-400 mb-3">
            Using mock data
          </div>

          <AlertTrendChart data={alertTrendData} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="font-semibold text-slate-600 mb-2">
            Risk Distribution Snapshot
          </h2>

          <div className="text-xs text-orange-400 mb-3">
            Using mock data
          </div>

          <RiskPieChart data={riskDistributionData} />
        </div>

        <div className="col-span-2">

          <div className="text-xs text-orange-400 mb-2">
            Using mock data
          </div>

          <RiskyUsersTable data={topRiskUsers} />

        </div>

      </div>

    </div>
  )
}

export default Overview