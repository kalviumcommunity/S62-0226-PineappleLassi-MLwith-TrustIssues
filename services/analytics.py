import pandas as pd
from collections import defaultdict
from config.config import DATA_PATH, USERS_PATH, EVENTS_PATH
from schemas.analytics import AnalyticsResponse


def fetch_analytics():

    sessions = pd.read_csv(DATA_PATH)
    users = pd.read_csv(USERS_PATH)
    events = pd.read_csv(EVENTS_PATH)

    # =========================
    # 1. RISK OVER TIME
    # =========================

    sessions["processed_at"] = pd.to_datetime(sessions["processed_at"], errors="coerce")

    latest_sessions = sessions.sort_values(
        by="processed_at", ascending=False
    ).head(50)

    risk_over_time = [
        {
            "day": str(row["processed_at"].isoformat()),
            "risk": round(abs(row["risk_score"]) * 100, 2) if pd.notna(row["risk_score"]) else 0
        }
        for _, row in latest_sessions.iterrows()
    ]

    # =========================
    # 2. DEVICE RISK
    # =========================

    device_map = defaultdict(int)

    # ensure bool
    sessions["is_anomaly"] = sessions["is_anomaly"].astype(str).str.lower() == "true"

    for _, row in sessions.iterrows():
        if row["is_anomaly"]:
            device_map[row["device_type"]] += 1

    device_risk = [
        {"device_type": k, "count": v}
        for k, v in device_map.items()
    ]

    # =========================
    # 3. DEPARTMENT RISK
    # =========================

    dept_map = defaultdict(int)

    # 🔥 Merge sessions + users
    merged = sessions.merge(users, on="user_id", how="left")

    # 🔥 Ensure boolean
    merged["is_anomaly"] = merged["is_anomaly"].astype(str).str.lower() == "true"

    # 🔥 Filter anomaly sessions
    anomalies = merged[merged["is_anomaly"] == True]

    # 🔥 Count per department
    for _, row in anomalies.iterrows():
        dept_map[row["department"]] += 1

    # 🔥 Final format
    department_risk = [
        {"department": k, "score": v}
        for k, v in dept_map.items()
    ]
    return {
        "risk_over_time": risk_over_time,
        "device_risk": device_risk,
        "department_risk": department_risk
    }