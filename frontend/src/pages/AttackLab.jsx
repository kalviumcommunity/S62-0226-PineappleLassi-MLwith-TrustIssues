import { useState, useEffect } from "react"
import { fetchUsers, injectAttack } from "../services/api"

function AttackLab() {

  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("")
  const [attackType, setAttackType] = useState("data_exfiltration")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  // ----------------------------
  // LOAD USERS
  // ----------------------------
  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data)
      if (data.length) setSelectedUser(data[0].user_id)
    })
  }, [])

  // ----------------------------
  // SIMULATE ATTACK
  // ----------------------------
  const handleSimulate = async () => {

    if (!selectedUser) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await injectAttack(selectedUser, attackType)

      if (!res) {
        setError("Simulation failed")
      } else {
        setResult(res)
      }

    } catch (err) {
      console.error(err)
      setError("Something went wrong")
    }

    setLoading(false)
  }

  // ----------------------------
  // SAFE DATA EXTRACTION
  // ----------------------------
  const riskScore =
    result?.risk_score != null
      ? (Math.abs(result.risk_score) * 100).toFixed(1)
      : "N/A"

  const riskLevel =
    result?.risk_level || "Unknown"

  const confidence =
    result?.confidence != null
      ? `${result.confidence}%`
      : "N/A"

  const reasons =
    Array.isArray(result?.reasons)
      ? result.reasons
      : []

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      <h1 className="text-3xl font-bold text-slate-700 mb-8">
        Attack Simulation Lab
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow max-w-xl">

        {/* USER */}
        <div className="mb-4">
          <label className="text-sm text-slate-500">Select User</label>
          <select
            className="w-full border p-3 rounded-xl mt-1"
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
          <label className="text-sm text-slate-500">Attack Type</label>
          <select
            className="w-full border p-3 rounded-xl mt-1"
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
          className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "Simulating..." : "Launch Attack Simulation"}
        </button>

      </div>

      {/* ---------------------------- */}
      {/* ERROR */}
      {/* ---------------------------- */}
      {error && (
        <div className="mt-6 text-red-500">
          {error}
        </div>
      )}

      {/* ---------------------------- */}
      {/* RESULT PANEL */}
      {/* ---------------------------- */}
      {result && (
        <div className="mt-8 bg-white p-6 rounded-2xl shadow max-w-xl">

          <h2 className="font-semibold mb-4 text-lg">
            Simulation Result
          </h2>

          <div className="text-sm mb-2">
            User: <b>{result.user_id || "Unknown"}</b>
          </div>

          <div className="text-sm mb-2">
            Risk Level: <b>{riskLevel}</b>
          </div>

          <div className="text-sm mb-2">
            Risk Score: <b>{riskScore}%</b>
          </div>

          <div className="text-sm mb-2">
            Confidence: <b>{confidence}</b>
          </div>

          <div className="mt-3">
            <div className="text-sm font-semibold mb-2">Reasons:</div>

            {reasons.length > 0 ? (
              reasons.map((r, i) => (
                <div
                  key={i}
                  className="text-xs bg-slate-100 px-2 py-1 rounded mb-1 inline-block mr-2"
                >
                  {r}
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400">
                No explanation provided
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  )
}

export default AttackLab