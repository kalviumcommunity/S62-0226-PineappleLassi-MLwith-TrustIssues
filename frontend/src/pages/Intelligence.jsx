/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"

import { fetchSessions, fetchUsers } from "../services/api"

import { sessionsMock } from "../services/sessionsMock"
import { usersMock } from "../services/usersMock"
import { eventsMock } from "../services/eventsMock"

import {
  generateLoginDistribution,
  generateUserDataAccess,
  generateBehaviourCompliance,
  generateFeatureImportance,
  generateRadarProfile
} from "../services/intelligenceEngine"

import UserRiskTrendChart from "../charts/UserRiskTrendChart"
import LoginDistributionChart from "../charts/LoginDistributionChart"
import BehaviourComplianceBars from "../charts/BehaviourComplianceBars"
import RadarBehaviourChart from "../charts/RadarBehaviourChart"
import DataAccessChart from "../charts/DataAccessChart"

function Intelligence() {

  const [sessions, setSessions] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")

  useEffect(() => {
    fetchSessions().then(setSessions)
    fetchUsers().then(data => {
      setUsers(data)
      if (data.length) setSelectedUser(data[0].user_id)
    })
  }, [])

  const user =
    users.find(u => u.user_id === selectedUser)

  // 🔥 REAL: Risk Trend (from sessions)
  const userSessions =
    sessions.filter(s => s.user_id === selectedUser)

  const trendMap = {}

  userSessions.forEach(s => {

    const day =
      new Date(s.timestamp).toLocaleDateString()

    if (!trendMap[day]) trendMap[day] = 0

    trendMap[day] += Math.abs(s.risk_score)
  })

  const riskTrend =
    Object.keys(trendMap).map(d => ({
      day: d,
      risk: Number(trendMap[d].toFixed(1))
    }))

  // ⚠️ MOCK DATA (kept intentionally)
  const loginDist =
    generateLoginDistribution(selectedUser, sessionsMock)

  const dataAccess =
    generateUserDataAccess(selectedUser, eventsMock)

  const compliance =
    generateBehaviourCompliance(
      selectedUser,
      sessionsMock,
      eventsMock
    )

  const featureImportance =
    user ? generateFeatureImportance(user) : []

  const radar =
    user ? generateRadarProfile(user, eventsMock) : []

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


      {/* ✅ REAL RISK TREND */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="font-semibold mb-2">
          Behaviour Risk Trend
        </h2>
        <UserRiskTrendChart data={riskTrend} />
      </div>


      {/* ⚠️ MOCK LOGIN + ACCESS */}
      <div className="grid grid-cols-2 gap-8 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">
            Login Behaviour Pattern
          </h2>
          <div className="text-xs text-orange-400 mb-2">
            Using mock data
          </div>
          <LoginDistributionChart data={loginDist} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">
            Data Access Behaviour
          </h2>
          <div className="text-xs text-orange-400 mb-2">
            Using mock data
          </div>
          <DataAccessChart data={dataAccess} />
        </div>

      </div>


      {/* ⚠️ MOCK COMPLIANCE + FEATURE */}
      <div className="grid grid-cols-2 gap-8 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-2">
            Behaviour Compliance
          </h2>
          <div className="text-xs text-orange-400 mb-2">
            Using mock data
          </div>
          <BehaviourComplianceBars data={compliance} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="font-semibold mb-4">
            Risk Contribution Factors
          </h2>

          <div className="text-xs text-orange-400 mb-3">
            Using mock data
          </div>

          {featureImportance.map(f => (

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


      {/* ⚠️ MOCK RADAR */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-2">
          Behaviour Fingerprint
        </h2>
        <div className="text-xs text-orange-400 mb-2">
          Using mock data
        </div>
        <RadarBehaviourChart data={radar} />
      </div>

    </div>
  )
}

export default Intelligence