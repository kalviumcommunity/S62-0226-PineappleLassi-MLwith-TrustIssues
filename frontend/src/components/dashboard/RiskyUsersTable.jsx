import { useNavigate } from "react-router-dom"

function RiskyUsersTable({ data }) {

  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl shadow p-6">

      <h2 className="font-semibold text-slate-600 mb-5">
        Top Risky Users
      </h2>

      <table className="w-full text-sm">

        <thead className="text-slate-400 text-left">
          <tr>
            <th className="pb-3">User</th>
            <th>Department</th>
            <th>Variability</th>
            <th>Risk Score</th>
            <th>Last Anomaly</th>
            <th></th>
          </tr>
        </thead>

        <tbody>

          {data.map(u => (
            <tr
              key={u.user_id}
              className="border-t hover:bg-slate-50 transition"
            >
              <td className="py-4 font-semibold text-slate-700">
                {u.user_id}
              </td>

              <td>{u.department}</td>

              <td>{u.variability}</td>

              <td className="text-red-400 font-semibold">
                {u.riskScore}
              </td>

              <td>{u.lastAnomaly}</td>

              <td>
                <button
                  onClick={() =>
                    navigate(`/users/${u.user_id}`)
                  }
                  className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200"
                >
                  Investigate
                </button>
              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  )
}

export default RiskyUsersTable