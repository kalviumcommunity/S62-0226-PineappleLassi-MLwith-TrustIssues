import { useParams } from "react-router-dom"

import { usersMock } from "../services/usersMock"
import { sessionsMock } from "../services/sessionsMock"
import { eventsMock } from "../services/eventsMock"

import {
  computeRiskScore,
  generateUserTimeline
} from "../services/intelligenceEngine"


function UserIntelligence() {

  const { id } = useParams()

  const user =
    usersMock.find(u => u.user_id === id)

  if (!user)
    return <div className="p-8">User not found</div>

  const riskScore =
    computeRiskScore(user, eventsMock, sessionsMock)

  const timeline =
    generateUserTimeline(id, eventsMock, sessionsMock)

  const userEvents =
    eventsMock.filter(e => e.user_id === id)

  const exports =
    userEvents.filter(e => e.action === "export").length

  const failed =
    userEvents.filter(e => !e.access_success).length

  const afterHours =
    sessionsMock.filter(s => {
      if (s.user_id !== id) return false
      const h = new Date(s.session_start).getHours()
      return h < 6 || h > 20
    }).length


  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* ⭐ HEADER */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8 flex justify-between items-center">

        <div className="flex items-center gap-6">

          <div className="w-16 h-16 rounded-full bg-purple-500 text-white flex items-center justify-center text-xl font-bold">
            {user.user_id.slice(-2)}
          </div>

          <div>
            <div className="text-2xl font-bold">
              {user.user_id}
            </div>

            <div className="text-slate-400">
              {user.role} · {user.department}
            </div>

            <div className="text-sm text-slate-400">
              Privilege Level {user.privilege_level}
            </div>
          </div>

        </div>

        <div className="text-right">

          <div className="text-slate-400 text-sm">
            Insider Threat Score
          </div>

          <div className="text-4xl font-bold text-orange-400">
            {(riskScore * 100).toFixed(1)}
          </div>

          <div className="mt-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-xl text-sm inline-block">
            {riskScore > 0.6 ? "HIGH RISK" : riskScore > 0.3 ? "MEDIUM RISK" : "LOW RISK"}
          </div>

        </div>

      </div>


      {/* ⭐ SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="text-slate-400 text-sm mb-1">File Exports</div>
          <div className="text-3xl font-bold text-rose-400">{exports}</div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="text-slate-400 text-sm mb-1">Failed Access</div>
          <div className="text-3xl font-bold text-amber-400">{failed}</div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <div className="text-slate-400 text-sm mb-1">After-hours Sessions</div>
          <div className="text-3xl font-bold text-purple-400">{afterHours}</div>
        </div>

      </div>


      {/* ⭐ TIMELINE */}
      <div className="bg-white rounded-2xl shadow p-6">

        <h2 className="font-semibold mb-6 text-lg">
          Behaviour Activity Timeline
        </h2>

        <div className="max-h-[500px] overflow-y-auto">

          {timeline.map(t => (

            <div
              key={t.id}
              className={`border-l-4 pl-4 py-4 mb-4 rounded-lg
                ${t.severity === "high"
                  ? "border-red-400 bg-red-50"
                  : t.severity === "medium"
                  ? "border-amber-400 bg-amber-50"
                  : "border-slate-300 bg-slate-50"
                }
              `}
            >

              <div className="flex justify-between">

                <div className="font-semibold">
                  {t.type}
                </div>

                <div className="text-sm text-slate-400">
                  {t.time.toLocaleString()}
                </div>

              </div>

              <div className="text-sm text-slate-500 mt-1">
                Data Volume: {t.volume} MB
              </div>

              {t.afterHours &&
                <div className="text-xs text-red-500 mt-1">
                  After-hours activity detected
                </div>
              }

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default UserIntelligence