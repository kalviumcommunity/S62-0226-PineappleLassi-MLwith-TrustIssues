import { useNavigate } from "react-router-dom"
import ThreatTicker from "../components/ThreatTicker"

function Login() {

  const navigate = useNavigate()

  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 flex items-center justify-center">

      <div className="w-[900px] h-[520px] rounded-3xl shadow-2xl bg-white/60 backdrop-blur-xl flex overflow-hidden">

        {/* LEFT PANEL */}
        <div className="w-1/2 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-10 flex flex-col justify-between">

          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Trust Issues
            </h1>

            <p className="mt-3 text-slate-600">
              Behavioral Insider Threat Monitoring Platform
            </p>
          </div>

          <ThreatTicker />

          <p className="text-xs text-slate-500">
            AI Surveillance Engine Active
          </p>

        </div>

        {/* RIGHT PANEL */}
        <div className="w-1/2 p-12 flex flex-col justify-center">

          <h2 className="text-2xl font-semibold text-slate-700 mb-6">
            SOC Admin Access
          </h2>

          <select className="w-full p-3 rounded-xl border border-slate-300 mb-6 bg-white">
            <option>Admin A (Security Head)</option>
            <option>Admin B (Threat Analyst)</option>
            <option>Admin C (Incident Manager)</option>
          </select>

          <button
            onClick={() => navigate("/overview")}
            className="w-full bg-gradient-to-r from-blue-300 to-purple-300 hover:scale-105 transition p-3 rounded-xl font-semibold text-slate-800 shadow-md"
          >
            Enter Command Center
          </button>

          <p className="mt-6 text-xs text-slate-400 text-center">
            System monitoring behavioral trust signals continuously
          </p>

        </div>

      </div>

    </div>
  )
}

export default Login