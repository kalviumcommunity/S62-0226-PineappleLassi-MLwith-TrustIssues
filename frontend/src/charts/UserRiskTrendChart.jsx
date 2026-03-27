import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts"

function UserRiskTrendChart({ data }) {

  return (
    <ResponsiveContainer width="100%" height={300}>

      <LineChart data={data}>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
        />

        <XAxis
          dataKey="day"
          tick={{ fill:"#64748b", fontSize:12 }}
        />

        <YAxis
          tick={{ fill:"#64748b", fontSize:12 }}
        />

        <Tooltip/>

        <Line
          type="monotone"
          dataKey="risk"
          stroke="#ef4444"
          strokeWidth={3}
          dot={false}
          activeDot={{ r:6 }}
          animationDuration={700}
        />

      </LineChart>

    </ResponsiveContainer>
  )
}

export default UserRiskTrendChart