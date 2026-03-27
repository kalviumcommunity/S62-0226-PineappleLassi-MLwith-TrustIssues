let INCIDENTS = []

export function getIncidents() {
  return INCIDENTS
}

export function createIncidentFromAlert(alert) {

  const incident = {
    id: "INC-" + alert.id,
    alertId: alert.id,
    user_id: alert.user_id,
    severity: alert.severity,
    status: "open",
    createdAt: alert.timestamp,
    investigator: "Security Admin",
    notes: ""
  }

  INCIDENTS.unshift(incident)

  return incident
}

export function updateIncidentStatus(id, status) {

  INCIDENTS = INCIDENTS.map(i =>
    i.id === id ? { ...i, status } : i
  )
}

export function updateIncidentNotes(id, notes) {

  INCIDENTS = INCIDENTS.map(i =>
    i.id === id ? { ...i, notes } : i
  )
}