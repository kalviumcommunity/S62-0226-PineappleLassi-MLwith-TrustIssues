const BASE_URL = "http://localhost:8000/api/v1"

export async function fetchSessions() {
  try {
    const res = await fetch(`${BASE_URL}/sessions`)
    if (!res.ok) throw new Error("Failed to fetch sessions")
    return await res.json()
  } catch (err) {
    console.error("Error fetching sessions:", err)
    return []
  }
}

export async function fetchAnomalySessions() {
  try {
    const res = await fetch("http://localhost:8000/api/v1/sessions/anomaly")
    if (!res.ok) throw new Error("Failed to fetch anomalies")
    return await res.json()
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function fetchUsers() {
  try {
    const res = await fetch("http://localhost:8000/api/v1/user")
    if (!res.ok) throw new Error("Failed to fetch users")
    return await res.json()
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function fetchUserSessions(userId) {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/user/sessions?user_id=${userId}`)
    if (!res.ok) throw new Error("Failed to fetch user sessions")
    return await res.json()
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function injectAttack(user_id, anomaly_type) {
  try {
    const res = await fetch("http://localhost:8000/api/v1/inject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id,
        anomaly_type
      })
    })

    if (!res.ok) throw new Error("Injection failed")

    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}

export async function fetchAnalytics() {
  try {
    const res = await fetch("http://localhost:8000/api/v1/sessions/analytics")

    if (!res.ok) throw new Error("Failed to fetch analytics")

    return await res.json()
  } catch (err) {
    console.error("Error fetching analytics:", err)
    return null
  }
}


export async function fetchUserIntelligence(userId) {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/intelligence/${userId}`)

    if (!res.ok) throw new Error("Failed to fetch intelligence")

    return await res.json()
  } catch (err) {
    console.error(err)
    return null
  }
}