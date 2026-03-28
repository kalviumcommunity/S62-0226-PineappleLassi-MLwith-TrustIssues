function AlertCard({ alert, onReview, onConvert }) {

  const getSeverityColor = (sev) => {
    if (sev === "HIGH") return "text-red-400"
    if (sev === "MEDIUM") return "text-orange-400"
    return "text-yellow-400"
  }

  const getDotColor = (sev) => {
    if (sev === "HIGH") return "#ef4444"
    if (sev === "MEDIUM") return "#f97316"
    return "#facc15"
  }

  return (
    <div className="bg-[#0a0a0f] border border-indigo-500/20 rounded-xl p-5 hover:bg-indigo-500/5 transition">

      {/* TOP ROW */}
      <div className="flex justify-between items-center mb-3">

        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-white">
            {alert.user_id}
          </div>

          <div className="text-xs text-slate-500">
            {alert.department}
          </div>
        </div>

        <div className="text-xs text-slate-500">
          {alert.timestamp}
        </div>
      </div>

      {/* TAGS */}
      <div className="flex flex-wrap gap-2 mb-4">

        {alert.tags.map((tag, i) => {

          let severity = "LOW"
          if (tag.toLowerCase().includes("high")) severity = "HIGH"
          else if (tag.toLowerCase().includes("medium")) severity = "MEDIUM"

          return (
            <div
              key={i}
              className={`flex items-center gap-2 px-2 py-1 text-[10px] rounded-md border ${
                severity === "HIGH"
                  ? "bg-red-500/10 border-red-500/30 text-red-300"
                  : severity === "MEDIUM"
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-300"
                  : "bg-yellow-500/10 border-yellow-500/30 text-yellow-300"
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: getDotColor(severity) }}
              />
              {tag}
            </div>
          )
        })}

      </div>

      {/* RISK SCORE */}
      <div className="text-sm text-slate-400 mb-4">
        Risk Score:{" "}
        <span className={`font-semibold ${getSeverityColor(alert.severity)}`}>
          {alert.riskScore}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">

        <button
          onClick={() => onReview(alert.id)}
          className="px-3 py-1 text-xs rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition"
        >
          Mark Reviewed
        </button>

        <button
          onClick={() => onConvert(alert.id)}
          className="px-3 py-1 text-xs rounded-md bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition"
        >
          Create Incident
        </button>

      </div>

    </div>
  )
}

export default AlertCard