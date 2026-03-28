import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchUserSessions } from "../services/api"

function UserIntelligence() {

  const { id } = useParams()
  const [sessions, setSessions] = useState([])

  useEffect(() => {
    fetchUserSessions(id).then(setSessions)
  }, [id])

  if (!sessions.length)
    return <div className="p-8 text-slate-500">No data available</div>

  const sorted =
    [...sessions].sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    )

  const avgRisk =
    (
      sorted.reduce((sum, s) =>
        sum + Math.abs(s.risk_score), 0
      ) / sorted.length * 100
    ).toFixed(1)

  const anomalyCount =
    sorted.filter(s => s.is_anomaly).length

  const highRiskCount =
    sorted.filter(s => s.risk_level === "HIGH").length

  const reasonMap = {}

  sorted.forEach(s => {
    s.reasons?.forEach(r => {
      if (!reasonMap[r]) reasonMap[r] = 0
      reasonMap[r] += 1
    })
  })

  const reasons =
    Object.keys(reasonMap).map(r => ({
      reason: r,
      count: reasonMap[r]
    }))

  const sortedReasons =
    [...reasons].sort((a, b) => b.count - a.count)

  const topReasons = sortedReasons.slice(0, 3)
  const otherReasons = sortedReasons.slice(3)

  // 🧠 SIMPLE INSIGHT (UI only)
  const insightText =
    topReasons.length
      ? `User shows elevated risk primarily due to ${topReasons
          .map(r => r.reason.toLowerCase())
          .join(", ")}.`
      : "No strong behavioral risks detected."

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6 mb-8 flex justify-between">

        <div>
          <div className="text-xl font-bold text-white">{id}</div>
          <div className="text-slate-500 text-sm">
            User Behaviour Intelligence
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500">AVG RISK</div>
          <div className="text-3xl font-bold text-orange-400">
            {avgRisk}%
          </div>
        </div>

      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-[#0f0f1a] border border-indigo-500/20 p-5 rounded-xl">
          <div className="text-xs text-slate-500 mb-1">ANOMALIES</div>
          <div className="text-2xl font-bold text-red-400">
            {anomalyCount}
          </div>
        </div>

        <div className="bg-[#0f0f1a] border border-indigo-500/20 p-5 rounded-xl">
          <div className="text-xs text-slate-500 mb-1">HIGH RISK</div>
          <div className="text-2xl font-bold text-orange-400">
            {highRiskCount}
          </div>
        </div>

        <div className="bg-[#0f0f1a] border border-indigo-500/20 p-5 rounded-xl">
          <div className="text-xs text-slate-500 mb-1">SESSIONS</div>
          <div className="text-2xl font-bold text-indigo-400">
            {sorted.length}
          </div>
        </div>

      </div>

      {/* 🧠 INSIGHT SUMMARY */}
      <div className="bg-[#0f0f1a] border border-indigo-500/20 p-6 rounded-xl mb-8">

        <div className="text-sm tracking-widest text-indigo-400 mb-3">
          INSIGHT SUMMARY
        </div>

        <div className="text-slate-300 text-sm leading-relaxed">
          {insightText}
        </div>

      </div>

      {/* 🚨 PRIMARY DRIVERS */}
      <div className="mb-10">

        <div className="text-sm tracking-widest text-indigo-400 mb-4">
          PRIMARY RISK DRIVERS
        </div>

        <div className="grid grid-cols-3 gap-5">

          {topReasons.map(r => (
            <div
              key={r.reason}
              className="bg-[#0f0f1a] border border-red-500/20 p-5 rounded-xl"
            >

              <div className="text-sm text-slate-300 mb-2">
                {r.reason}
              </div>

              <div className="text-2xl font-bold text-red-400">
                {r.count}
              </div>

              <div className="text-xs text-slate-500 mt-1">
                occurrences
              </div>

            </div>
          ))}

        </div>

      </div>

      {/* 🧩 OTHER SIGNALS */}
      {otherReasons.length > 0 && (
        <div className="bg-[#0f0f1a] border border-indigo-500/20 p-6 rounded-xl mb-10">

          <div className="text-sm tracking-widest text-indigo-400 mb-4">
            OTHER SIGNALS
          </div>

          <div className="flex flex-wrap gap-3">

            {otherReasons.slice(0, 12).map(r => (
              <div
                key={r.reason}
                className="px-3 py-2 text-xs rounded-lg
                           bg-[#0a0a0f] border border-indigo-500/10
                           text-slate-300"
              >
                {r.reason} ({r.count})
              </div>
            ))}

          </div>

        </div>
      )}

      {/* TIMELINE */}
      <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6">

        <h2 className="text-sm tracking-widest text-indigo-400 mb-6">
          SESSION TIMELINE
        </h2>

        <div className="max-h-[500px] overflow-y-auto">

          {sorted.map(s => (

            <div
              key={s.session_id}
              className={`border-l-4 pl-4 py-4 mb-4 rounded-lg
                ${s.risk_level === "HIGH"
                  ? "border-red-400 bg-red-500/10"
                  : s.risk_level === "MEDIUM"
                  ? "border-orange-400 bg-orange-500/10"
                  : "border-slate-500 bg-[#0a0a0f]"
                }
              `}
            >

              <div className="flex justify-between">

                <div className="font-semibold text-slate-200">
                  {s.risk_level} Risk Session
                </div>

                <div className="text-xs text-slate-500">
                  {new Date(s.timestamp).toLocaleString()}
                </div>

              </div>

              <div className="text-sm mt-1 text-slate-400">
                Confidence: {s.confidence}%
              </div>

              {s.is_anomaly &&
                <div className="text-xs text-red-400 mt-1">
                  ⚠ Anomaly detected
                </div>
              }

              <div className="flex gap-2 mt-2 flex-wrap">
                {s.reasons?.map(r => (
                  <span
                    key={r}
                    className="text-xs bg-[#0f0f1a] border border-indigo-500/20 px-2 py-1 rounded"
                  >
                    {r}
                  </span>
                ))}
              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default UserIntelligence