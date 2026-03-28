import { useEffect, useState } from "react"

import { fetchAnomalySessions } from "../services/api"

import AlertCard from "../components/AlertCard"

function Alerts() {

  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    fetchAnomalySessions().then(data => {

      const mapped = data.map(s => ({
        id: s.session_id,
        user_id: s.user_id,
        department: "Unknown",
        severity: s.risk_level?.toUpperCase() || "LOW",
        tags: s.reasons || [],
        riskScore: (Math.abs(s.risk_score) * 100).toFixed(1) + "%",
        timestamp: s.timestamp
      }))

      setAlerts(mapped)
    })
  }, [])

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

      {/* ALERT FEED ONLY */}
      <div>

        <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm tracking-widest text-indigo-400">
              ALERT FEED
            </h2>

            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              LIVE STREAM
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-3">

            {alerts.length === 0 &&
              <div className="text-slate-500 text-sm">
                No alerts detected
              </div>
            }

            {alerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
              />
            ))}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Alerts