import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer
} from "recharts"

function RadarBehaviourChart({ data }) {

  return (
    <ResponsiveContainer width="100%" height={340}>

      <RadarChart data={data}>

        <PolarGrid stroke="#e5e7eb"/>

        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill:"#64748b", fontSize:12 }}
        />

        <Radar
          dataKey="A"
          stroke="#fb7185"
          fill="#fb7185"
          fillOpacity={0.4}
          strokeWidth={3}
          animationDuration={800}
        />

      </RadarChart>

    </ResponsiveContainer>
  )
}

export default RadarBehaviourChart