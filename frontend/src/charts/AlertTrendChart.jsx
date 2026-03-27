import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine
} from "recharts"

function AlertTrendChart({ data }) {

  return (
    <ResponsiveContainer width="100%" height={300}>

      <LineChart data={data}>

        <defs>
          <linearGradient id="alertGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.7}/>
            <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.1}/>
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>

        <XAxis dataKey="day"/>
        <YAxis/>

        <Tooltip/>

        <ReferenceLine y={5} stroke="#fca5a5" strokeDasharray="4 4"/>

        <Line
          type="monotone"
          dataKey="alerts"
          stroke="#60a5fa"
          strokeWidth={3}
          dot={{ r:4 }}
          activeDot={{ r:7 }}
          animationDuration={900}
        />

      </LineChart>

    </ResponsiveContainer>
  )
}

export default AlertTrendChart