export function generateAlerts(users, events, sessions) {

  const alerts = []

  events.forEach(e => {

    const user = users.find(u => u.user_id === e.user_id)
    const session = sessions.find(s => s.session_id === e.session_id)

    if (!user || !session) return

    const hour = new Date(session.session_start).getHours()

    let severity = "low"
    let tags = []
    let score = 0

    // ⭐ BULK EXPORT (CSV anomaly logic)
    if (e.action === "export" && e.data_volume_mb > 300) {
      severity = "critical"
      tags.push("Bulk Export")
      score += 4
    }

    // ⭐ FAILED ACCESS
    if (!e.access_success) {
      severity = severity === "critical" ? "critical" : "high"
      tags.push("Failed Access")
      score += 3
    }

    // ⭐ AFTER HOURS SESSION
    if (hour < 6 || hour > 20) {
      tags.push("After Hours")
      score += 2
    }

    // ⭐ VPN RISK
    if (session.device_type === "vpn") {
      tags.push("Remote Session")
      score += 1
    }

    if (tags.length > 0) {
      alerts.push({
        id: "AL-" + e.event_id,
        user_id: user.user_id,
        department: user.department,
        timestamp: e.timestamp,
        severity,
        tags,
        riskScore: score,
        reviewed: false
      })
    }

  })

  return alerts.sort(
    (a,b) => new Date(b.timestamp) - new Date(a.timestamp)
  )
}