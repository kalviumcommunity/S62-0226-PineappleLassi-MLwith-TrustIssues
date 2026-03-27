import StatCard from "../components/dashboard/StatCard"

import { usersMock } from "../services/usersMock"
import { sessionsMock } from "../services/sessionsMock"
import { eventsMock } from "../services/eventsMock"

import {
  generateSystemStats,
  generateAlertTrend,
  generateRiskDistribution,
  generateTopRiskUsers
} from "../services/intelligenceEngine"

import AlertTrendChart from "../charts/AlertTrendChart"
import RiskPieChart from "../charts/RiskPieChart"
import RiskyUsersTable from "../components/dashboard/RiskyUsersTable"

function Overview() {

  const stats =
    generateSystemStats(usersMock, eventsMock, sessionsMock)

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

      {/* ⭐ STAT CARDS */}
      <div className="grid grid-cols-6 gap-5 mb-10">

        <StatCard title="Total Users" value={stats.totalUsers} color="text-blue-500" />
        <StatCard title="High Risk Users" value={stats.highRiskUsers} color="text-red-400" />
        <StatCard title="Alerts Today" value={stats.alertsToday} color="text-orange-400" />
        <StatCard title="Active Incidents" value={stats.activeIncidents} color="text-purple-400" />
        <StatCard title="Average Risk Score" value={stats.avgRiskScore} color="text-pink-400" />
        <StatCard title="Data Exfiltration" value={stats.dataExfiltration} color="text-rose-500" />

      </div>

      {/* ⭐ COMMAND SNAPSHOT CHARTS */}
      <div className="grid grid-cols-2 gap-8">

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="font-semibold text-slate-600 mb-4">
            Alert Volume Trend
          </h2>
          <AlertTrendChart data={alertTrendData} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="font-semibold text-slate-600 mb-4">
            Risk Distribution Snapshot
          </h2>
          <RiskPieChart data={riskDistributionData} />
        </div>

        <div className="col-span-2">
            <RiskyUsersTable data={topRiskUsers} />
        </div>

      </div>

    </div>
  )
}

export default Overview