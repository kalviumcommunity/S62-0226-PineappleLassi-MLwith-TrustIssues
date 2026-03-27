import { useState } from "react"

import { usersMock } from "../services/usersMock"
import { sessionsMock } from "../services/sessionsMock"
import { eventsMock } from "../services/eventsMock"

import {
  generateUserRiskTrend,
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

  const [selectedUser, setSelectedUser] =
    useState(usersMock[0].user_id)

  const user =
    usersMock.find(u => u.user_id === selectedUser)

  const riskTrend =
    generateUserRiskTrend(selectedUser, eventsMock)

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
    generateFeatureImportance(user)

  const radar =
    generateRadarProfile(user, eventsMock)


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
          {usersMock.map(u => (
            <option key={u.user_id} value={u.user_id}>
              {u.user_id} — {u.department}
            </option>
          ))}
        </select>

      </div>


      {/* RISK TREND */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="font-semibold mb-4">
          Behaviour Risk Trend
        </h2>
        <UserRiskTrendChart data={riskTrend} />
      </div>


      {/* LOGIN + ACCESS */}
      <div className="grid grid-cols-2 gap-8 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">
            Login Behaviour Pattern
          </h2>
          <LoginDistributionChart data={loginDist} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">
            Data Access Behaviour
          </h2>
          <DataAccessChart data={dataAccess} />
        </div>

      </div>


      {/* COMPLIANCE + FEATURE */}
      <div className="grid grid-cols-2 gap-8 mb-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">
            Behaviour Compliance
          </h2>
          <BehaviourComplianceBars data={compliance} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <h2 className="font-semibold mb-4">
            Risk Contribution Factors
          </h2>

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


      {/* RADAR */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">
          Behaviour Fingerprint
        </h2>
        <RadarBehaviourChart data={radar} />
      </div>

    </div>
  )
}

export default Intelligence