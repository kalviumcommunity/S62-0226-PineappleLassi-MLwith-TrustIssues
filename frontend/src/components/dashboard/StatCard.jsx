function StatCard({ title, value, color }) {
  return (
    <div className="bg-[#0f0f1a] border border-indigo-500/20 rounded-xl p-5">
      <div className="text-xs text-slate-500 mb-2 tracking-widest">
        {title}
      </div>
      <div className={`text-2xl font-bold ${color}`}>
        {value}
      </div>
    </div>
  )
}

export default StatCard