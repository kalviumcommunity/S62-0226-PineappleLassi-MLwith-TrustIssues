/* eslint-disable no-unused-vars */
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
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    fetchSessions().then(setSessions)

    const clock = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(clock)
  }, [])

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

  const alertTrendData =
    generateAlertTrend(eventsMock)

  const riskDistributionData =
    generateRiskDistribution(usersMock, eventsMock, sessionsMock)

  const topRiskUsers =
    generateTopRiskUsers(usersMock, eventsMock, sessionsMock)

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
          System Time: {time.toLocaleTimeString("en-US", { hour12: false })}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-6 gap-5 mb-10">
        <StatCard title="Total Users" value={totalUsers} color="text-indigo-400" />
        <StatCard title="High Risk Users" value={highRiskUsers} color="text-red-400" />
        <StatCard title="Alerts Today" value={alertsToday} color="text-orange-400" />
        <StatCard title="Average Risk Score" value={`${avgRisk}%`} color="text-pink-400" />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-8">

        {/* ALERT TREND */}
        <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm tracking-widest text-indigo-400">
              ALERT TREND
            </h2>
            <span className="text-[10px] text-orange-400">
              MOCK DATA
            </span>
          </div>

          <AlertTrendChart data={alertTrendData} />
        </div>

        {/* RISK DISTRIBUTION */}
        <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm tracking-widest text-indigo-400">
              RISK DISTRIBUTION
            </h2>
            <span className="text-[10px] text-orange-400">
              MOCK DATA
            </span>
          </div>

          <RiskPieChart data={riskDistributionData} />
        </div>

        {/* TABLE */}
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

            <div className="text-xs text-orange-400 mb-3">
              Using mock data
            </div>

            <RiskyUsersTable data={topRiskUsers} />
          </div>
        </div>

      </div>
    </div>
  )
}

export default Overview