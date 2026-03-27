import { useEffect, useState } from "react"

function ThreatTicker() {

  const messages = [
    "Unusual login deviation detected",
    "Privileged export spike observed",
    "Cross-location session anomaly",
    "Sensitive resource access surge",
    "Rare behavioral pattern triggered"
  ]

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length)
    }, 2500)

    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="h-16 flex items-center text-slate-700 text-sm italic transition-all duration-500">
      ⚠ {messages[index]}
    </div>
  )
}

export default ThreatTicker