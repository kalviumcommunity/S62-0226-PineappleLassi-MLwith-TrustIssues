import { Outlet, useLocation } from "react-router-dom"

function DashboardLayout() {
  const location = useLocation()

  const navItems = [
    { name: "Overview", path: "/overview" },
    { name: "Users", path: "/users" },
    { name: "Alerts", path: "/alerts" },
    { name: "Analytics", path: "/analytics" },
    { name: "Intelligence", path: "/intelligence" },
    { name: "Simulation", path: "/simulation" },
  ]

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-slate-200 font-mono">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#0a0a0f] border-r border-indigo-500/10 p-6 flex flex-col">

        <h1 className="text-xl font-bold text-white mb-8 tracking-wide">
          Trust Issues
        </h1>

        <div className="flex flex-col gap-4">
          {navItems.map((item) => {
            const active = location.pathname === item.path

            return (
              <a
                key={item.name}
                href={item.path}
                className={`text-sm transition-all duration-200 ${
                  active
                    ? "text-indigo-400"
                    : "text-slate-400 hover:text-indigo-300"
                }`}
              >
                {item.name}
              </a>
            )
          })}
        </div>

        {/* Bottom status */}
        <div className="mt-auto text-xs text-slate-600">
          SYSTEM ACTIVE
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-indigo-500/10 bg-[#0a0a0f]">

          {/* SEARCH */}
          <input
            placeholder="Search user / alert / incident..."
            className="bg-[#0f0f1a] border border-indigo-500/20 text-slate-300 px-4 py-2 rounded-lg outline-none w-[420px] placeholder:text-slate-500"
          />

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">

            <div className="text-sm text-slate-400">
              Trust Score: <span className="text-indigo-400 font-semibold">72%</span>
            </div>

            <div className="relative">
              <span className="text-yellow-400">🔔</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
                5
              </span>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-4 py-1 rounded-full text-sm">
              Admin
            </div>

          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 bg-[#0a0a0f]">
          <Outlet />
        </div>

      </div>
    </div>
  )
}

export default DashboardLayout