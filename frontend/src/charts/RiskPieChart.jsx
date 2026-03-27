import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts"

function RiskPieChart({ data }) {

  const COLORS = [
    "#86efac",
    "#fde68a",
    "#fca5a5",
    "#f9a8d4"
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>

      <PieChart>

        <Pie
          data={data}
          dataKey="value"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={4}
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index]}
            />
          ))}
        </Pie>

        <Tooltip/>

      </PieChart>

    </ResponsiveContainer>
  )
}

export default RiskPieChart