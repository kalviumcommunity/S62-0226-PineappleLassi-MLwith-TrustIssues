

function RiskyUsersTable({ data }) {
  return (
    <div className="bg-[#0a0a0f] border border-indigo-500/10 rounded-xl overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-4 border-b border-indigo-500/10">
        <h3 className="text-sm text-indigo-400 tracking-widest">
          Top Risky Users
        </h3>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">

        <thead className="text-slate-500 text-xs tracking-wider">
          <tr className="border-b border-indigo-500/10">
            <th className="text-left px-6 py-3">User</th>
            <th className="text-left px-6 py-3">Department</th>
            <th className="text-left px-6 py-3">Variability</th>
            <th className="text-left px-6 py-3">Risk Score</th>
            <th className="text-left px-6 py-3">Last Anomaly</th>
            <th className="text-left px-6 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {data.map((user, index) => (
            <tr
              key={index}
              className="border-b border-indigo-500/5 hover:bg-indigo-500/5 transition"
            >
              <td className="px-6 py-4 text-slate-300 font-medium">
                {user.user_id}
              </td>

              <td className="px-6 py-4 text-slate-400">
                {user.department}
              </td>

              <td className="px-6 py-4 text-slate-400">
                {user.variability}
              </td>

              <td className="px-6 py-4 font-semibold text-red-400">
                {user.risk_score}
              </td>

              <td className="px-6 py-4 text-slate-500">
                {user.last_anomaly}
              </td>

              <td className="px-6 py-4">
                <button className="px-3 py-1 text-xs rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition">
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