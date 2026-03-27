function Header() {
  return (
    <div className="h-16 bg-white/70 backdrop-blur-xl shadow flex items-center justify-between px-6">

      <input
        placeholder="Search user / alert / incident..."
        className="w-96 p-2 rounded-xl border"
      />

      <div className="flex items-center gap-6">

        <div className="text-sm text-slate-600">
          Trust Score: <span className="font-bold text-purple-500">72%</span>
        </div>

        <div className="relative">
          🔔
          <span className="absolute -top-2 -right-2 bg-red-300 text-xs rounded-full px-1">
            5
          </span>
        </div>

        <div className="bg-purple-200 px-3 py-1 rounded-xl">
          Admin
        </div>

      </div>

    </div>
  )
}

export default Header