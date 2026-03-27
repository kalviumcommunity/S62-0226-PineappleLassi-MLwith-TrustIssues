/* eslint-disable no-unused-vars */
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts"

function CustomTooltip({ active, payload, label }) {

  if (!active || !payload || !payload.length)
    return null

  return (
    <div className="bg-white border shadow-lg rounded-xl p-3">

      <div className="text-sm text-slate-400 mb-1">
        Activity Type
      </div>

      {payload.map(p => (
        <div
          key={p.name}
          className="text-sm font-semibold"
          style={{ color: p.color }}
        >
          {p.name}: {p.value}
        </div>
      ))}

    </div>
  )
}


function DataAccessChart({ data }) {

  return (
    <ResponsiveContainer width="100%" height={300}>

      <BarChart data={data}>

        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        <XAxis
          dataKey="name"
          tick={{ fill:"#64748b", fontSize:12 }}
        />

        <YAxis />

        <Tooltip content={<CustomTooltip />} />

        <Legend />

        <Bar
          dataKey="value"
          fill="#a5b4fc"
          radius={[8,8,0,0]}
          animationDuration={800}
        />

      </BarChart>

    </ResponsiveContainer>
  )
}

export default DataAccessChart