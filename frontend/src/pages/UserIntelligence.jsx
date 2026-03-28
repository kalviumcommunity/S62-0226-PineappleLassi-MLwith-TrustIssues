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
    return <div className="p-8">No data available</div>

  // 🔥 SORT LATEST FIRST
  const sorted =
    [...sessions].sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    )

  // 🔥 METRICS
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

  // 🔥 REASON AGGREGATION
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

  return (
    <div
  className="min-h-screen px-10 py-8"
  style={{
    background: "#0a0a0f",
    fontFamily: "'Courier New', monospace",
  }}
>
  {/* HEADER */}
  <div className="mb-8 flex justify-between items-center">

    <div>
      <div className="text-2xl font-bold text-slate-100">{id}</div>
      <div className="text-slate-500 text-sm">
        User Behaviour Intelligence
      </div>
    </div>

    <div className="text-right">
      <div className="text-xs text-slate-500">Avg Risk</div>
      <div className="text-3xl font-bold text-orange-400">
        {avgRisk}%
      </div>
    </div>

  </div>

  {/* SUMMARY CARDS */}
  <div className="grid grid-cols-3 gap-6 mb-8">

    {[{
      label: "Anomalies",
      value: anomalyCount,
      color: "text-red-400"
    },{
      label: "High Risk",
      value: highRiskCount,
      color: "text-orange-400"
    },{
      label: "Total Sessions",
      value: sorted.length,
      color: "text-purple-400"
    }].map((card, i) => (
      <div
        key={i}
        className="p-5 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="text-xs text-slate-500 mb-1">
          {card.label}
        </div>
        <div className={`text-2xl font-bold ${card.color}`}>
          {card.value}
        </div>
      </div>
    ))}

  </div>

  {/* RISK FACTORS */}
  <div
    className="p-6 rounded-xl mb-8"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >

    <h2 className="text-slate-200 mb-4 font-semibold">
      Risk Factors
    </h2>

    {reasons.map(r => (
      <div key={r.reason} className="mb-3">

        <div className="flex justify-between text-xs mb-1 text-slate-400">
          <span>{r.reason}</span>
          <span>{r.count}</span>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full">
          <div
            className="bg-red-400 h-2 rounded-full"
            style={{ width: `${r.count * 10}%` }}
          />
        </div>

      </div>
    ))}

  </div>

  {/* TIMELINE */}
  <div
    className="p-6 rounded-xl"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >

    <h2 className="text-slate-200 mb-6 font-semibold">
      Session Timeline
    </h2>

    {/* 🔥 REMOVED max-height overflow */}
    <div className="space-y-4">

      {sorted.map(s => (

        <div
          key={s.session_id}
          className="p-4 rounded-lg border-l-4"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderColor:
              s.risk_level === "HIGH"
                ? "#f87171"
                : s.risk_level === "MEDIUM"
                ? "#fbbf24"
                : "#64748b"
          }}
        >

          <div className="flex justify-between text-sm">

            <div className="text-slate-200 font-semibold">
              {s.risk_level} Risk Session
            </div>

            <div className="text-slate-500">
              {new Date(s.timestamp).toLocaleString()}
            </div>

          </div>

          <div className="text-xs text-slate-400 mt-1">
            Confidence: {s.confidence}%
          </div>

          {s.is_anomaly && (
            <div className="text-xs text-red-400 mt-1">
              Anomaly detected
            </div>
          )}

          <div className="flex gap-2 mt-2 flex-wrap">
            {s.reasons?.map(r => (
              <span
                key={r}
                className="text-xs px-2 py-1 rounded"
                style={{
                  background: "rgba(255,255,255,0.05)"
                }}
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