function StatCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition">

      <p className="text-sm text-slate-500 mb-2">
        {title}
      </p>

      <h2 className={`text-3xl font-bold ${color}`}>
        {value}
      </h2>

    </div>
  )
}

export default StatCard