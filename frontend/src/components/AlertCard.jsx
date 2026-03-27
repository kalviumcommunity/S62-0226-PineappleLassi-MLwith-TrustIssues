
function AlertCard({ alert}) {

  const severityStyles = {
    critical: "border-red-400 bg-red-50",
    high: "border-orange-400 bg-orange-50",
    medium: "border-amber-400 bg-amber-50",
    low: "border-slate-300 bg-slate-50"
  }

  return (
    <div className={`border-l-4 rounded-xl p-5 mb-4 shadow ${severityStyles[alert.severity]}`}>

      <div className="flex justify-between items-center mb-2">

        <div className="font-bold text-lg">
          {alert.user_id}
          <span className="text-sm text-slate-400 ml-2">
            {alert.department}
          </span>
        </div>

        <div className="text-xs text-slate-400">
          {new Date(alert.timestamp).toLocaleString()}
        </div>

      </div>

      {/* TAGS */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {alert.tags.map(t => (
          <div key={t} className="px-2 py-1 bg-white rounded-lg text-xs shadow">
            {t}
          </div>
        ))}
      </div>

      <div className="text-sm text-slate-500 mb-3">
        Risk Score: <span className="font-bold">{alert.riskScore}</span>
      </div>

    </div>
  )
}

export default AlertCard