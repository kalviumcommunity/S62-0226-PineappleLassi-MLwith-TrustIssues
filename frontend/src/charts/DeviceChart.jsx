import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

function DeviceChart({ data }) {

  const COLORS = [
    "#93c5fd",   // pastel blue
    "#f9a8d4",   // pastel pink
    "#c4b5fd"    // pastel purple
  ]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          paddingAngle={4}
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}
        />

        <Legend />

      </PieChart>
    </ResponsiveContainer>
  )
}

export default DeviceChart