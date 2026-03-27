import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { usersMock } from "../services/usersMock"
import { eventsMock } from "../services/eventsMock"
import { sessionsMock } from "../services/sessionsMock"

import { generateUserInvestigationRows } from "../services/intelligenceEngine"

function Users() {

  const [search, setSearch] = useState("")
  const [riskFilter, setRiskFilter] = useState("")
  const [remoteFilter, setRemoteFilter] = useState("")
  const [privFilter, setPrivFilter] = useState("")
  const [noticeFilter, setNoticeFilter] = useState("")

  let rows =
    generateUserInvestigationRows(
      usersMock,
      eventsMock,
      sessionsMock
    )

  // SEARCH
  rows = rows.filter(r =>
    r.user_id.toLowerCase().includes(search.toLowerCase()) ||
    r.department.toLowerCase().includes(search.toLowerCase()) ||
    r.role.toLowerCase().includes(search.toLowerCase())
  )

  const navigate = useNavigate()

  // FILTERS
  if (riskFilter)
    rows = rows.filter(r => r.riskLevel === riskFilter)

  if (remoteFilter)
    rows = rows.filter(r => String(r.remote) === remoteFilter)

  if (privFilter)
    rows = rows.filter(r => String(r.privilege) === privFilter)

  if (noticeFilter)
    rows = rows.filter(r => String(r.notice) === noticeFilter)

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold text-slate-700 mb-6">
        Users Investigation Hub
      </h1>

      {/* SEARCH */}
      <input
        placeholder="Search User ID / Department / Role"
        className="border p-3 rounded-xl w-full mb-6"
        onChange={e => setSearch(e.target.value)}
      />

      {/* FILTER PANEL */}
      <div className="grid grid-cols-4 gap-4 mb-8">

        <select
          onChange={e => setRiskFilter(e.target.value)}
          className="border p-2 rounded-xl"
        >
          <option value="">Risk Level</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>

        <select
          onChange={e => setRemoteFilter(e.target.value)}
          className="border p-2 rounded-xl"
        >
          <option value="">Remote Worker</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        <select
          onChange={e => setPrivFilter(e.target.value)}
          className="border p-2 rounded-xl"
        >
          <option value="">Privilege Level</option>
          <option value="1">User</option>
          <option value="2">Power User</option>
          <option value="3">Admin</option>
        </select>

        <select
          onChange={e => setNoticeFilter(e.target.value)}
          className="border p-2 rounded-xl"
        >
          <option value="">Notice Period</option>
          <option value="true">On Notice</option>
          <option value="false">Active</option>
        </select>

      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-2xl shadow">

        <table className="w-full text-sm">

          <thead className="text-slate-400 text-left">
            <tr>
              <th className="p-4">User</th>
              <th>Role</th>
              <th>Privilege</th>
              <th>Login Hour</th>
              <th>Variability</th>
              <th>Risk</th>
              <th>Last Activity</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {rows.map(r => (
              <tr key={r.user_id} className="border-t h-14 hover:bg-slate-50">

                <td className="p-4 font-semibold">{r.user_id}</td>
                <td>{r.role}</td>
                <td>{r.privilege}</td>
                <td>{r.loginHour}</td>
                <td>{r.variability}</td>

                <td className="text-red-400 font-semibold">
                  {r.riskLevel}
                </td>

                <td>{r.lastActivity}</td>

                <td>
                  <button onClick={() => navigate(`/users/${r.user_id}`)} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg">
                    View Intelligence
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Users