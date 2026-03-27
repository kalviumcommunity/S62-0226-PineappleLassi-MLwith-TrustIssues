import { Treemap, ResponsiveContainer, Tooltip } from "recharts"

function DepartmentHeatmap({ data }) {

  return (
    <ResponsiveContainer width="100%" height={350}>
      <Treemap
        data={data}
        dataKey="risk"
        stroke="#ffffff"
        fill="#c4b5fd"
      >
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}
        />
      </Treemap>
    </ResponsiveContainer>
  )
}

export default DepartmentHeatmap