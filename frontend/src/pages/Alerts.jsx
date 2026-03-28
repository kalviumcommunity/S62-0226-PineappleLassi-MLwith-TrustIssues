import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { fetchAnomalySessions } from "../services/api"
import { createIncidentFromAlert } from "../services/incidentStore"

import AlertCard from "../components/AlertCard"

function Alerts() {

  const [alerts, setAlerts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchAnomalySessions().then(data => {

      const mapped = data.map(s => ({
        id: s.session_id,
        user_id: s.user_id,
        department: "Unknown",
        severity: s.risk_level?.toUpperCase() || "LOW",
        tags: s.reasons || [],
        riskScore: (Math.abs(s.risk_score) * 100).toFixed(1) + "%",
        timestamp: s.timestamp,
        reviewed: false
      }))

      setAlerts(mapped)
    })
  }, [])

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
    <div className="min-h-screen w-full bg-[#0a0a0f] text-slate-200 font-mono p-8">

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>

      {/* HEADER */}
      <div className="mb-8">
        <div className="text-[11px] tracking-[3px] text-indigo-400 mb-2">
          ALERT SYSTEM
        </div>

        <h1 className="text-2xl font-bold text-white">
          Live Security Alerts Feed
        </h1>

        <p className="text-xs text-slate-500 mt-2">
          Real-time anomaly detection and incident tracking
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-3 gap-8">

        {/* ALERT FEED */}
        <div className="col-span-2">

          <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm tracking-widest text-indigo-400">
                ACTIVE ALERTS
              </h2>

              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                LIVE FEED
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-3">

              {activeAlerts.length === 0 &&
                <div className="text-slate-500 text-sm">
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

        {/* SIDE PANEL */}
        <div className="space-y-6">

          {/* STATS */}
          <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6">

            <h2 className="text-sm tracking-widest text-indigo-400 mb-4">
              ALERT STATS
            </h2>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between text-slate-400">
                <span>Total Alerts</span>
                <span className="text-white">{alerts.length}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Active</span>
                <span className="text-orange-400">{activeAlerts.length}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Reviewed</span>
                <span className="text-green-400">{reviewedAlerts.length}</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Alerts