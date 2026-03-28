import { useState, useEffect } from "react"
import { fetchUsers, injectAttack } from "../services/api"

function AttackLab() {

  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [attackType, setAttackType] = useState("data_exfiltration")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data)
      if (data.length) setSelectedUser(data[0].user_id)
    })
  }, [])

  const handleSimulate = async () => {

    if (!selectedUser) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await injectAttack(selectedUser, attackType)

      if (!res) setError("Simulation failed")
      else setResult(res)

    } catch (err) {
      console.error(err)
      setError("Something went wrong")
    }

    setLoading(false)
  }

  const riskScore =
    result?.risk_score != null
      ? (Math.abs(result.risk_score) * 100).toFixed(1)
      : "N/A"

  const riskLevel = result?.risk_level || "Unknown"

  const confidence =
    result?.confidence != null
      ? `${result.confidence}%`
      : "N/A"

  const reasons =
    Array.isArray(result?.reasons)
      ? result.reasons
      : []

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="mb-10">
        <div className="text-xs tracking-widest text-indigo-400 mb-2">
          SIMULATION LAB
        </div>

        <h1 className="text-2xl font-bold text-white">
          Attack Simulation Console
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Test system response against simulated behavioral threats
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">

        {/* LEFT PANEL - CONTROLS */}
        <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6">

          <h2 className="text-sm tracking-widest text-indigo-400 mb-6">
            ATTACK CONFIGURATION
          </h2>

          {/* USER */}
          <div className="mb-5">
            <label className="text-xs text-slate-500">Target User</label>

            <select
              className="w-full mt-2 bg-[#0a0a0f] border border-indigo-500/20 
                         text-slate-300 px-3 py-2 rounded-lg outline-none"
              value={selectedUser}
              onChange={e => setSelectedUser(e.target.value)}
            >
              {users.map(u => (
                <option key={u.user_id} value={u.user_id}>
                  {u.user_id} — {u.department}
                </option>
              ))}
            </select>
          </div>

          {/* ATTACK TYPE */}
          <div className="mb-6">
            <label className="text-xs text-slate-500">Attack Type</label>

            <select
              className="w-full mt-2 bg-[#0a0a0f] border border-indigo-500/20 
                         text-slate-300 px-3 py-2 rounded-lg outline-none"
              value={attackType}
              onChange={e => setAttackType(e.target.value)}
            >
              <option value="data_exfiltration">Data Exfiltration</option>
              <option value="privilege_abuse">Privilege Abuse</option>
              <option value="after_hours">After-Hours Intrusion</option>
              <option value="credential_compromise">Credential Compromise</option>
            </select>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-3 rounded-lg font-semibold text-sm
                       bg-gradient-to-r from-red-500 to-red-600
                       hover:from-red-600 hover:to-red-700
                       disabled:opacity-50 transition"
          >
            {loading ? "[ SIMULATING... ]" : "[ LAUNCH ATTACK ]"}
          </button>

          {/* ERROR */}
          {error && (
            <div className="mt-4 text-xs text-red-400">
              {error}
            </div>
          )}

        </div>

        {/* RIGHT PANEL - RESULTS */}
        <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-6">

          <h2 className="text-sm tracking-widest text-indigo-400 mb-6">
            SYSTEM RESPONSE
          </h2>

          {!result && !loading && (
            <div className="text-slate-500 text-sm">
              No simulation executed yet.
            </div>
          )}

          {loading && (
            <div className="text-indigo-400 text-sm animate-pulse">
              Running simulation...
            </div>
          )}

          {result && (
            <div className="space-y-5">

              {/* METRICS */}
              <div className="grid grid-cols-3 gap-4">

                <div className="bg-[#0a0a0f] p-4 rounded-lg border border-indigo-500/10">
                  <div className="text-xs text-slate-500 mb-1">RISK</div>
                  <div className="text-lg font-bold text-red-400">
                    {riskLevel}
                  </div>
                </div>

                <div className="bg-[#0a0a0f] p-4 rounded-lg border border-indigo-500/10">
                  <div className="text-xs text-slate-500 mb-1">SCORE</div>
                  <div className="text-lg font-bold text-orange-400">
                    {riskScore}%
                  </div>
                </div>

                <div className="bg-[#0a0a0f] p-4 rounded-lg border border-indigo-500/10">
                  <div className="text-xs text-slate-500 mb-1">CONFIDENCE</div>
                  <div className="text-lg font-bold text-indigo-400">
                    {confidence}
                  </div>
                </div>

              </div>

              {/* USER */}
              <div className="text-sm text-slate-400">
                Target: <span className="text-slate-200">{result.user_id}</span>
              </div>

              {/* REASONS */}
              <div>
                <div className="text-xs text-slate-500 mb-2">
                  DETECTION SIGNALS
                </div>

                <div className="flex flex-wrap gap-2">

                  {reasons.length > 0 ? (
                    reasons.map((r, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[#0a0a0f] border border-indigo-500/20 
                                   px-2 py-1 rounded"
                      >
                        {r}
                      </span>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500">
                      No signals detected
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default AttackLab