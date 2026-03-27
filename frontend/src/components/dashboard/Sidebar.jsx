import { NavLink } from "react-router-dom"

function Sidebar() {
  return (
    <div className="w-64 bg-white/70 backdrop-blur-xl shadow-xl p-6">

      <h1 className="text-2xl font-bold mb-10 text-slate-700">
        Trust Issues
      </h1>

      <nav className="flex flex-col gap-4">

        <NavLink to="/overview">Overview</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/alerts">Alerts</NavLink>
        <NavLink to="/analytics">Analytics</NavLink>
        <NavLink to="/intelligence">Intelligence</NavLink>
        <NavLink to="/simulation">Simulation</NavLink>

      </nav>

    </div>
  )
}

export default Sidebar