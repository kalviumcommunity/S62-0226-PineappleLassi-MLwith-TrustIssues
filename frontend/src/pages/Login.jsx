import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"

/* ─── Animated threat ticker ────────────────────────────────── */
function ThreatTicker() {
  const messages = [
    { code: "EVT-0041", text: "Unusual login deviation detected", severity: "HIGH" },
    { code: "EVT-0078", text: "Privileged export spike observed", severity: "CRIT" },
    { code: "EVT-0023", text: "Cross-location session anomaly", severity: "MED" },
    { code: "EVT-0099", text: "Sensitive resource access surge", severity: "HIGH" },
    { code: "EVT-0055", text: "Rare behavioral pattern triggered", severity: "CRIT" },
  ]

  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((p) => (p + 1) % messages.length)
        setVisible(true)
      }, 300)
    }, 2800)
    return () => clearInterval(id)
  }, [])

  const m = messages[index]
  const sevColor = m.severity === "CRIT" ? "#ff4444" : m.severity === "HIGH" ? "#ff8800" : "#ffcc00"

  return (
    <div style={{
      background: "rgba(0,0,0,0.4)",
      border: "1px solid rgba(255,68,68,0.3)",
      borderRadius: "8px",
      padding: "12px 16px",
      fontFamily: "'Courier New', monospace",
      fontSize: "12px",
      transition: "opacity 0.3s ease",
      opacity: visible ? 1 : 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{
          background: sevColor,
          color: "#000",
          fontSize: "9px",
          fontWeight: "700",
          padding: "2px 6px",
          borderRadius: "3px",
          letterSpacing: "1px",
          flexShrink: 0,
        }}>{m.severity}</span>
        <span style={{ color: "#888", flexShrink: 0 }}>{m.code}</span>
        <span style={{ color: "#e2e8f0" }}>{m.text}</span>
        <span style={{ marginLeft: "auto", color: "#ff4444", animation: "blink 1s infinite" }}>●</span>
      </div>
    </div>
  )
}

/* ─── Animated background grid ──────────────────────────────── */
function GridBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let animId
    let t = 0

    const draw = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Scrolling grid
      const gridSize = 40
      const offsetY = (t * 0.3) % gridSize
      ctx.strokeStyle = "rgba(99,102,241,0.08)"
      ctx.lineWidth = 1

      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke()
      }
      for (let y = -gridSize + offsetY; y <= canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
      }

      // Pulsing nodes
      const nodes = [
        { x: 0.15, y: 0.2 }, { x: 0.7, y: 0.1 }, { x: 0.4, y: 0.8 },
        { x: 0.85, y: 0.6 }, { x: 0.25, y: 0.65 }, { x: 0.6, y: 0.4 },
      ]
      nodes.forEach((n, i) => {
        const px = n.x * canvas.width
        const py = n.y * canvas.height
        const r = 2 + Math.sin(t * 0.02 + i) * 1.5
        const alpha = 0.3 + Math.sin(t * 0.015 + i * 1.2) * 0.2
        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139,92,246,${alpha})`
        ctx.fill()
        // Ring
        ctx.beginPath()
        ctx.arc(px, py, r + 6 + Math.sin(t * 0.02 + i) * 3, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(139,92,246,${alpha * 0.4})`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      t++
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none"
    }} />
  )
}

/* ─── Stat badge ─────────────────────────────────────────────── */
function LiveStat({ label, value, color }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "10px",
      padding: "12px 16px",
      flex: 1,
    }}>
      <div style={{ fontSize: "11px", color: "#666", fontFamily: "monospace", marginBottom: "4px", letterSpacing: "0.5px" }}>{label}</div>
      <div style={{ fontSize: "22px", fontWeight: "700", color, fontFamily: "monospace" }}>{value}</div>
    </div>
  )
}

/* ─── Main Login ─────────────────────────────────────────────── */
function Login() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState("Admin A")
  const [scanning, setScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const handleEnter = () => {
    setScanning(true)
    setProgress(0)
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(id); navigate("/overview"); return 100 }
        return p + 4
      })
    }, 40)
  }

  const admins = [
    { id: "Admin A", label: "Admin A", role: "Security Head", clearance: "L5" },
    { id: "Admin B", label: "Admin B", role: "Threat Analyst", clearance: "L4" },
    { id: "Admin C", label: "Admin C", role: "Incident Manager", clearance: "L3" },
  ]

  const selectedAdmin = admins.find(a => a.id === selected)

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "#0a0a0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Courier New', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes scanline { 0%{top:0} 100%{top:100%} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glitch {
          0%,96%{transform:none;opacity:1}
          97%{transform:skewX(-2deg);opacity:0.8}
          98%{transform:skewX(2deg)translateX(-2px)}
          99%{transform:none;opacity:1}
        }
        .login-card { animation: fadeUp 0.6s ease both; }
        .brand-name { animation: glitch 6s infinite; }
        .admin-option { transition: all 0.15s ease; }
        .admin-option:hover { background: rgba(139,92,246,0.15) !important; border-color: rgba(139,92,246,0.5) !important; }
        .enter-btn { transition: all 0.2s ease; }
        .enter-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 0 30px rgba(139,92,246,0.4), 0 0 60px rgba(139,92,246,0.1) !important; }
        .enter-btn:active:not(:disabled) { transform: translateY(0); }
      `}</style>

      {/* Background */}
      <div style={{ position: "fixed", inset: 0 }}>
        <GridBackground />
        {/* Radial glow */}
        <div style={{
          position: "absolute", top: "30%", left: "20%",
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "15%",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Main card */}
      <div className="login-card" style={{
        width: "860px",
        maxWidth: "95vw",
        background: "rgba(10,10,20,0.92)",
        border: "1px solid rgba(99,102,241,0.2)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(139,92,246,0.05), 0 40px 80px rgba(0,0,0,0.8)",
        display: "flex",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Scanline effect */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)",
          animation: "scanline 4s linear infinite",
          pointerEvents: "none",
          zIndex: 10,
        }} />

        {/* ── LEFT PANEL ── */}
        <div style={{
          width: "44%",
          background: "linear-gradient(160deg, rgba(15,15,30,0.9) 0%, rgba(20,15,40,0.9) 100%)",
          borderRight: "1px solid rgba(99,102,241,0.15)",
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          position: "relative",
        }}>
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {["#ff5f57","#febc2e","#28c840"].map(c => (
                <div key={c} style={{ width: "8px", height: "8px", borderRadius: "50%", background: c, opacity: 0.8 }} />
              ))}
            </div>
            <div style={{ fontSize: "10px", color: "#444", letterSpacing: "2px" }}>SECURE TERMINAL</div>
          </div>

          {/* Brand */}
          <div>
            <div className="brand-name" style={{
              fontSize: "38px",
              fontWeight: "900",
              color: "#fff",
              letterSpacing: "-1px",
              lineHeight: 1,
              fontFamily: "'Courier New', monospace",
            }}>
              TRUST
              <span style={{
                display: "block",
                WebkitTextStroke: "1px rgba(139,92,246,0.8)",
                color: "transparent",
              }}>ISSUES</span>
            </div>
            <div style={{
              marginTop: "10px",
              fontSize: "11px",
              color: "#6366f1",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}>
              Behavioral Threat Intelligence
            </div>
          </div>

          {/* Live stats */}
          <div style={{ display: "flex", gap: "8px" }}>
            <LiveStat label="MONITORED" value="247" color="#a78bfa" />
            <LiveStat label="INCIDENTS" value="12" color="#f87171" />
          </div>

          {/* Clock */}
          <div style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(99,102,241,0.15)",
            borderRadius: "8px",
            padding: "10px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{ fontSize: "10px", color: "#555", letterSpacing: "1px" }}>SYSTEM TIME</span>
            <span style={{ fontSize: "13px", color: "#818cf8", fontWeight: "600" }}>
              {time.toLocaleTimeString("en-US", { hour12: false })}
            </span>
          </div>

          {/* Threat ticker */}
          <ThreatTicker />

          {/* Status */}
          <div style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <div style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#22c55e",
              animation: "blink 2s infinite",
            }} />
            <span style={{ fontSize: "10px", color: "#4b5563", letterSpacing: "1.5px" }}>
              AI SURVEILLANCE ENGINE ACTIVE
            </span>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{
          flex: 1,
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "20px",
        }}>
          {/* Header */}
          <div>
            <div style={{ fontSize: "10px", color: "#6366f1", letterSpacing: "3px", marginBottom: "6px" }}>
              ACCESS CONTROL
            </div>
            <h2 style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "700",
              color: "#f1f5f9",
              letterSpacing: "-0.3px",
            }}>
              SOC Admin Authentication
            </h2>
            <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#475569" }}>
              Select your operator profile to proceed
            </p>
          </div>

          {/* Admin selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="admin-option"
                onClick={() => setSelected(admin.id)}
                style={{
                  background: selected === admin.id
                    ? "rgba(99,102,241,0.12)"
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${selected === admin.id ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "10px",
                  padding: "12px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: "36px", height: "36px", borderRadius: "8px",
                  background: selected === admin.id
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", fontWeight: "700", color: "#fff",
                  flexShrink: 0,
                }}>
                  {admin.label.slice(-1)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: "600", color: "#e2e8f0" }}>
                    {admin.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "1px" }}>
                    {admin.role}
                  </div>
                </div>

                <div style={{
                  fontSize: "9px", fontWeight: "700",
                  color: selected === admin.id ? "#818cf8" : "#374151",
                  background: selected === admin.id ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selected === admin.id ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.05)"}`,
                  padding: "2px 7px", borderRadius: "4px", letterSpacing: "1px",
                }}>
                  CLR {admin.clearance}
                </div>

                {selected === admin.id && (
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1", flexShrink: 0 }} />
                )}
              </div>
            ))}
          </div>

          {/* Progress bar (scanning state) */}
          {scanning && (
            <div style={{ marginTop: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "10px", color: "#6366f1", letterSpacing: "1px" }}>AUTHENTICATING...</span>
                <span style={{ fontSize: "10px", color: "#6366f1" }}>{progress}%</span>
              </div>
              <div style={{
                height: "3px", background: "rgba(99,102,241,0.1)",
                borderRadius: "2px", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: `${progress}%`,
                  background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                  borderRadius: "2px",
                  transition: "width 0.04s linear",
                  boxShadow: "0 0 10px rgba(99,102,241,0.6)",
                }} />
              </div>
            </div>
          )}

          {/* CTA Button */}
          <button
            className="enter-btn"
            onClick={handleEnter}
            disabled={scanning}
            style={{
              width: "100%",
              padding: "14px",
              background: scanning
                ? "rgba(99,102,241,0.2)"
                : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              border: "1px solid rgba(139,92,246,0.4)",
              borderRadius: "10px",
              color: "#fff",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "2px",
              cursor: scanning ? "not-allowed" : "pointer",
              fontFamily: "'Courier New', monospace",
              boxShadow: scanning ? "none" : "0 0 20px rgba(99,102,241,0.2)",
            }}
          >
            {scanning ? `[ SCANNING... ${progress}% ]` : "[ ENTER COMMAND CENTER ]"}
          </button>

          {/* Footer */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "4px",
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}>
            <span style={{ fontSize: "10px", color: "#1e293b" }}>v2.4.1-stable</span>
            <span style={{ fontSize: "10px", color: "#1e293b" }}>
              {selectedAdmin?.role} · Clearance {selectedAdmin?.clearance}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
