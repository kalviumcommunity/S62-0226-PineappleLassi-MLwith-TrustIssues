import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"

function RiskTrendChart({ data }) {

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>

        <defs>
          <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fda4af" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#fda4af" stopOpacity={0}/>
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>

        <XAxis
          dataKey="day"
          tick={{ fill: "#64748b", fontSize: 12 }}
        />

        <YAxis
          tick={{ fill: "#64748b", fontSize: 12 }}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}
        />

        <Area
          type="monotone"
          dataKey="risk"
          stroke="#fb7185"
          fill="url(#riskGradient)"
          strokeWidth={3}
        />

      </AreaChart>
    </ResponsiveContainer>
  )
}

export default RiskTrendChart