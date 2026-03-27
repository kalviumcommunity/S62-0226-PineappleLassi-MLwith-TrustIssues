// RISK SCORE
export function computeRiskScore(user, events, sessions) {

  const variability = user.behavior_variability_score || 0

  const userEvents = events.filter(e => e.user_id === user.user_id)
  const userSessions = sessions.filter(s => s.user_id === user.user_id)

  const exportEvents = userEvents.filter(e => e.action === "export").length

  const failedAccess =
    userEvents.filter(e => e.access_success === false).length

  const afterHoursSessions =
    userSessions.filter(s => {
      const hour = new Date(s.session_start).getHours()
      return hour < 6 || hour > 20
    }).length

  const risk =
    variability * 0.4 +
    (failedAccess / 10) * 0.2 +
    (exportEvents / 5) * 0.3 +
    (afterHoursSessions / 5) * 0.1

  return Math.min(1, Number(risk.toFixed(2)))
}


// SYSTEM STATS
export function generateSystemStats(users, events, sessions) {

  const totalUsers = users.length

  const highRiskUsers = users.filter(u =>
    computeRiskScore(u, events, sessions) > 0.6
  ).length

  const dataExfiltration =
    events.filter(e =>
      e.action === "export" &&
      e.data_volume_mb > 300
    ).length

  return {
    totalUsers,
    highRiskUsers,
    alertsToday: dataExfiltration,
    activeIncidents: 4,
    avgRiskScore: 0.58,
    dataExfiltration
  }
}


// ALERT TREND
export function generateAlertTrend(events) {

  const map = {}

  events.forEach(e => {

    const day = new Date(e.timestamp).toLocaleDateString()

    if (!map[day]) map[day] = 0

    if (
      e.action === "export" ||
      !e.access_success ||
      e.data_volume_mb > 300
    ) {
      map[day] += 1
    }

  })

  return Object.keys(map).map(day => ({
    day,
    alerts: map[day]
  }))
}


// RISK DISTRIBUTION
export function generateRiskDistribution(users, events, sessions) {

  let low = 0
  let medium = 0
  let high = 0
  let critical = 0

  users.forEach(u => {

    const r = computeRiskScore(u, events, sessions)

    if (r < 0.3) low++
    else if (r < 0.6) medium++
    else if (r < 0.8) high++
    else critical++

  })

  return [
    { name: "Low", value: low },
    { name: "Medium", value: medium },
    { name: "High", value: high },
    { name: "Critical", value: critical }
  ]
}


// TOP RISK USERS
export function generateTopRiskUsers(users, events, sessions) {

  return users
    .map(u => {

      const risk = computeRiskScore(u, events, sessions)

      const lastEvent =
        events
          .filter(e => e.user_id === u.user_id)
          .sort((a,b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
          )[0]

      return {
        user_id: u.user_id,
        department: u.department,
        variability: u.behavior_variability_score,
        riskScore: risk,
        lastAnomaly:
          lastEvent
            ? new Date(lastEvent.timestamp).toLocaleDateString()
            : "None"
      }

    })
    .sort((a,b) => b.riskScore - a.riskScore)
    .slice(0,5)
}


// USER INVESTIGATION TABLE
export function generateUserInvestigationRows(users, events, sessions) {

  return users.map(u => {

    const risk = computeRiskScore(u, events, sessions)

    let riskLevel = "Low"
    if (risk > 0.8) riskLevel = "Critical"
    else if (risk > 0.6) riskLevel = "High"
    else if (risk > 0.3) riskLevel = "Medium"

    const lastEvent =
      events
        .filter(e => e.user_id === u.user_id)
        .sort((a,b) =>
          new Date(b.timestamp) - new Date(a.timestamp)
        )[0]

    return {
      user_id: u.user_id,
      role: u.role,
      department: u.department,
      privilege: u.privilege_level,
      variability: u.behavior_variability_score,
      riskScore: risk,
      riskLevel,
      lastActivity:
        lastEvent
          ? new Date(lastEvent.timestamp).toLocaleDateString()
          : "None",
      remote: u.remote_worker,
      notice: u.employment_status === "on_notice"
    }

  })
}


// USER TIMELINE (IMPORTANT)
export function generateUserTimeline(userId, events, sessions) {

  const timeline = []

  events
    .filter(e => e.user_id === userId)
    .forEach(e => {

      let type = "Normal Activity"
      let severity = "low"

      if (e.action === "export" && e.data_volume_mb > 300) {
        type = "Bulk Data Export"
        severity = "high"
      }
      else if (!e.access_success) {
        type = "Failed Access Attempt"
        severity = "medium"
      }
      else if (e.action === "export") {
        type = "File Export"
        severity = "medium"
      }
      else if (e.action === "write") {
        type = "Sensitive Write Activity"
        severity = "low"
      }

      const session =
        sessions.find(s => s.session_id === e.session_id)

      let afterHours = false

      if (session) {
        const hour =
          new Date(session.session_start).getHours()

        if (hour < 6 || hour > 20)
          afterHours = true
      }

      timeline.push({
        id: e.event_id,
        time: new Date(e.timestamp),
        type,
        severity,
        afterHours,
        volume: e.data_volume_mb
      })

    })

  return timeline.sort((a,b) => b.time - a.time)
}


// RISK TREND
export function generateUserRiskTrend(userId, events) {

  const trend = []

  // create last 7 day baseline
  for (let i = 6; i >= 0; i--) {

    const day = new Date()
    day.setDate(day.getDate() - i)

    const label = day.toLocaleDateString()

    let risk = Math.random() * 2   // baseline noise

    events
      .filter(e => e.user_id === userId)
      .forEach(e => {

        const eventDay =
          new Date(e.timestamp).toLocaleDateString()

        if (eventDay === label) {

          if (e.action === "export") risk += 3
          if (!e.access_success) risk += 2
          if (e.data_volume_mb > 300) risk += 3

        }

      })

    trend.push({
      day: label,
      risk: Number(risk.toFixed(1))
    })

  }

  return trend
}


// COMPLIANCE
export function generateBehaviourCompliance(userId, sessions, events) {

  const userSessions =
    sessions.filter(s => s.user_id === userId)

  if (userSessions.length === 0)
    return []

  const afterHours =
    userSessions.filter(s =>
      new Date(s.session_start).getHours() < 6 ||
      new Date(s.session_start).getHours() > 20
    ).length

  const compliance =
    100 - Math.round((afterHours / userSessions.length) * 100)

  const failed =
    events.filter(e =>
      e.user_id === userId &&
      !e.access_success
    ).length

  return [
    { name: "Work Hour Compliance", value: compliance },
    { name: "MFA Usage", value: 70 },
    { name: "Failed Login Ratio", value: failed * 10 }
  ]
}


// FEATURE IMPORTANCE

export function generateFeatureImportance(user) {

  return [
    { feature: "Off-hours activity", impact: 0.32 },
    { feature: "Export behaviour", impact: 0.41 },
    { feature: "Login variability", impact: user.behavior_variability_score }
  ]
}


// ===============================
// RADAR PROFILE
// ===============================
export function generateRadarProfile(user, events) {

  const exports =
    events.filter(e =>
      e.user_id === user.user_id &&
      e.action === "export"
    ).length

  return [
    { subject: "Login Discipline", A: 100 - user.behavior_variability_score * 100 },
    { subject: "File Usage", A: exports * 20 },
    { subject: "Privilege Usage", A: user.privilege_level * 30 },
    { subject: "Anomaly Exposure", A: exports * 25 }
  ]
}

export function generateDepartmentRisk(users, events) {

  const map = {}

  users.forEach(u => {
    map[u.department] = 0
  })

  events.forEach(e => {

    const user = users.find(u => u.user_id === e.user_id)
    if (!user) return

    let score = 0

    if (e.action === "export") score += 3
    if (!e.access_success) score += 2
    if (e.data_volume_mb > 300) score += 3

    map[user.department] += score
  })

  return Object.keys(map).map(d => ({
    name: d,
    risk: map[d]
  }))
}

export function generateRiskTrend(events) {

  const map = {}

  events.forEach(e => {

    const day =
      new Date(e.timestamp).toLocaleDateString()

    if (!map[day]) map[day] = 0

    if (e.action === "export") map[day] += 3
    if (!e.access_success) map[day] += 2
    if (e.data_volume_mb > 300) map[day] += 3

  })

  return Object.keys(map).map(d => ({
    day: d,
    risk: map[d]
  }))
}

export function generateDeviceRisk(sessions, events) {

  const map = {
    laptop: 0,
    workstation: 0,
    vpn: 0
  }

  sessions.forEach(s => {

    const risky =
      events.some(e =>
        e.session_id === s.session_id &&
        (e.action === "export" || !e.access_success)
      )

    if (risky)
      map[s.device_type] += 1

  })

  return Object.keys(map).map(k => ({
    name: k,
    value: map[k]
  }))
}

export function generateLoginDistribution(userId, sessions) {

  const result = []

  // simulate behaviour pattern
  for (let i = 0; i < 20; i++) {

    const base =
      sessions.find(s => s.user_id === userId)

    if (!base) continue

    const hour =
      new Date(base.session_start).getHours()

    const variation =
      Math.floor(Math.random() * 4) - 2

    result.push({
      hour: Math.max(0, Math.min(23, hour + variation))
    })

  }

  return result
}

export function generateUserDataAccess(userId, events) {

  let exports = 0
  let reads = 0
  let writes = 0

  events
    .filter(e => e.user_id === userId)
    .forEach(e => {

      if (e.action === "export") exports++
      else if (e.action === "read") reads++
      else if (e.action === "write") writes++

    })

  return [
    { name: "Read", value: reads },
    { name: "Write", value: writes },
    { name: "Export", value: exports }
  ]
}