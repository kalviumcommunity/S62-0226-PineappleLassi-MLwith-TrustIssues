import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea
} from "recharts"

function LoginDistributionChart({ data }) {

  // build full 24-hour histogram
  const freq = []

  for (let i = 0; i < 24; i++) {
    freq.push({ hour: i, sessions: 0 })
  }

  data.forEach(d => {
    const h = Number(d.hour)
    if (!isNaN(h))
      freq[h].sessions += 1
  })

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={freq}>

        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>

        {/* after hours zones */}
        <ReferenceArea x1={0} x2={6} fill="#fee2e2" fillOpacity={0.4}/>
        <ReferenceArea x1={20} x2={23} fill="#fee2e2" fillOpacity={0.4}/>

        <XAxis dataKey="hour"/>
        <YAxis allowDecimals={false}/>
        <Tooltip/>

        <Bar
          dataKey="sessions"
          fill="#60a5fa"
          radius={[6,6,0,0]}
        />

      </BarChart>
    </ResponsiveContainer>
  )
}

export default LoginDistributionChart