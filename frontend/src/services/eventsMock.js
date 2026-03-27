export const eventsMock = [
  {
    event_id: "E001",
    session_id: "S001",
    user_id: "U001",
    timestamp: "2025-02-10T02:15:00",
    action: "export",
    data_volume_mb: 520,
    access_success: true
  },
  {
    event_id: "E002",
    session_id: "S002",
    user_id: "U002",
    timestamp: "2025-02-10T10:20:00",
    action: "read",
    data_volume_mb: 12,
    access_success: false
  },
  {
    event_id: "E003",
    session_id: "S003",
    user_id: "U003",
    timestamp: "2025-02-11T21:40:00",
    action: "export",
    data_volume_mb: 340,
    access_success: true
  },
  {
    event_id: "E004",
    session_id: "S004",
    user_id: "U004",
    timestamp: "2025-02-12T09:50:00",
    action: "write",
    data_volume_mb: 22,
    access_success: true
  }
]