import { useState } from "react"

import { usersMock } from "../services/usersMock"
import { sessionsMock } from "../services/sessionsMock"
import { eventsMock } from "../services/eventsMock"
import { createIncidentFromAlert } from "../services/incidentStore"
import { useNavigate } from "react-router-dom"

import { generateAlerts } from "../services/alertEngine"

import AlertCard from "../components/AlertCard"

function Alerts() {

  const [alerts, setAlerts] = useState(
    generateAlerts(usersMock, eventsMock, sessionsMock)
  )

  const navigate = useNavigate()

  
  const handleReview = (id) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === id ? { ...a, reviewed: true } : a
      )
    )
  }

  const handleConvert = (id) => {

  const alert = alerts.find(a => a.id === id)

  const incident =
    createIncidentFromAlert(alert)

  setAlerts(prev =>
    prev.map(a =>
      a.id === id ? { ...a, reviewed: true } : a
    )
  )

  navigate(`/incidents/${incident.id}`)
}

  const activeAlerts =
    alerts.filter(a => !a.reviewed)

  const reviewedAlerts =
    alerts.filter(a => a.reviewed)

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <h1 className="text-3xl font-bold text-slate-700 mb-8">
        Live Security Alerts Feed
      </h1>

      <div className="grid grid-cols-3 gap-8">

        {/* ⭐ ALERT FEED */}
        <div className="col-span-2">

          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="font-semibold mb-4">
              Active Alerts
            </h2>

            <div className="max-h-[70vh] overflow-y-auto pr-2">

              {activeAlerts.length === 0 &&
                <div className="text-slate-400">
                  No active alerts
                </div>
              }

              {activeAlerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onReview={handleReview}
                  onConvert={handleConvert}
                />
              ))}

            </div>

          </div>

        </div>

        {/* ⭐ SIDE PANEL */}
        <div className="space-y-6">

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-semibold mb-3">
              Alert Stats
            </h2>

            <div className="text-sm text-slate-500">
              Total Alerts: {alerts.length}
            </div>

            <div className="text-sm text-slate-500">
              Active: {activeAlerts.length}
            </div>

            <div className="text-sm text-slate-500">
              Reviewed: {reviewedAlerts.length}
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Alerts