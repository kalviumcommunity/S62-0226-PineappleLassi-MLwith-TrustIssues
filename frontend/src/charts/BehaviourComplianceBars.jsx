function BehaviourComplianceBars({ data }) {

  return (
    <div>

      {data.map(d => (

        <div key={d.name} className="mb-6">

          <div className="flex justify-between text-sm mb-2">
            <span>{d.name}</span>
            <span className="font-semibold">{d.value}%</span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-3">

            <div
              className="h-3 rounded-full bg-purple-400 transition-all duration-700"
              style={{ width: `${d.value}%` }}
            />

          </div>

        </div>

      ))}

    </div>
  )
}

export default BehaviourComplianceBars