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
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8 flex justify-between">

        <div>
          <div className="text-2xl font-bold">{id}</div>
          <div className="text-slate-400">User Behaviour Intelligence</div>
        </div>

        <div className="text-right">

          <div className="text-sm text-slate-400">
            Avg Risk
          </div>

          <div className="text-4xl font-bold text-orange-400">
            {avgRisk}%
          </div>

        </div>

      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-5 rounded-2xl shadow">
          <div className="text-slate-400 text-sm">Anomalies</div>
          <div className="text-3xl font-bold text-red-400">
            {anomalyCount}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <div className="text-slate-400 text-sm">High Risk Sessions</div>
          <div className="text-3xl font-bold text-orange-400">
            {highRiskCount}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <div className="text-slate-400 text-sm">Total Sessions</div>
          <div className="text-3xl font-bold text-purple-400">
            {sorted.length}
          </div>
        </div>

      </div>

      {/* REASONS */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">

        <h2 className="font-semibold mb-4">
          Risk Factors (Why this user is risky)
        </h2>

        {reasons.map(r => (
          <div key={r.reason} className="mb-3">

            <div className="flex justify-between text-sm mb-1">
              <span>{r.reason}</span>
              <span>{r.count}</span>
            </div>

            <div className="w-full bg-slate-200 h-2 rounded-full">
              <div
                className="bg-red-400 h-2 rounded-full"
                style={{ width: `${r.count * 10}%` }}
              />
            </div>

          </div>
        ))}

      </div>

      {/* TIMELINE */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="font-semibold mb-6 text-lg">
          Session Timeline
        </h2>

        <div className="max-h-[500px] overflow-y-auto">

          {sorted.map(s => (

            <div
              key={s.session_id}
              className={`border-l-4 pl-4 py-4 mb-4 rounded-lg
                ${s.risk_level === "HIGH"
                  ? "border-red-400 bg-red-50"
                  : s.risk_level === "MEDIUM"
                  ? "border-amber-400 bg-amber-50"
                  : "border-slate-300 bg-slate-50"
                }
              `}
            >

              <div className="flex justify-between">

                <div className="font-semibold">
                  {s.risk_level} Risk Session
                </div>

                <div className="text-sm text-slate-400">
                  {new Date(s.timestamp).toLocaleString()}
                </div>

              </div>

              <div className="text-sm mt-1 text-slate-500">
                Confidence: {s.confidence}%
              </div>

              {s.is_anomaly &&
                <div className="text-xs text-red-500 mt-1">
                  Anomaly detected
                </div>
              }

              {/* REASONS */}
              <div className="flex gap-2 mt-2 flex-wrap">
                {s.reasons?.map(r => (
                  <span key={r} className="text-xs bg-white px-2 py-1 rounded shadow">
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