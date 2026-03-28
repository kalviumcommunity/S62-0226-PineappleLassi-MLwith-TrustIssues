import pandas as pd
import json
from config.config import DATA_PATH, USERS_PATH, EVENTS_PATH


def fetch_user_intelligence(user_id: str):

    sessions = pd.read_csv(DATA_PATH)
    users = pd.read_csv(USERS_PATH)
    events = pd.read_csv(EVENTS_PATH)

    # filter user
    user_sessions = sessions[sessions["user_id"] == user_id]
    user_events = events[events["user_id"] == user_id]
    user = users[users["user_id"] == user_id].iloc[0]

    # =========================
    # 1. Risk Trend
    # =========================
    user_sessions["processed_at"] = pd.to_datetime(
        user_sessions["processed_at"], errors="coerce", format="mixed"
    )

    risk_trend = (
        user_sessions.sort_values(by="processed_at")
        .tail(30)
        .apply(lambda row: {
            "day": str(row["processed_at"].date()) if pd.notna(row["processed_at"]) else "",
            "risk": round(float(row["risk_score"]), 1) if pd.notna(row["risk_score"]) else 0
        }, axis=1)
        .tolist()
    )

    # =========================
    # 2. Login Deviation
    # =========================
    user_sessions["session_start"] = pd.to_datetime(
        user_sessions["session_start"], errors="coerce", format="mixed"
    )

    login_deviation = [
        {"hour": int(row["session_start"].hour)}
        for _, row in user_sessions.iterrows()
        if pd.notna(row["session_start"])
    ]

    # =========================
    # 3. Data Access
    # =========================
    reads = (user_events["action"] == "read").sum()
    writes = (user_events["action"] == "write").sum()
    exports = (user_events["action"] == "export").sum()

    data_access = [
        {"name": "Read", "value": int(reads)},
        {"name": "Write", "value": int(writes)},
        {"name": "Export", "value": int(exports)}
    ]

    # =========================
    # 4. Compliance
    # =========================
    after_hours = user_sessions[
        user_sessions["session_start"].dt.hour.isin(list(range(0,6)) + list(range(21,24)))
    ].shape[0]

    total_sessions = len(user_sessions)

    compliance = 100 if total_sessions == 0 else (
        100 - round((after_hours / total_sessions) * 100)
    )

    failed = (~user_events["access_success"]).sum()

    compliance_data = [
        {"name": "Work Hour Compliance", "value": compliance},
        {"name": "MFA Usage", "value": 70},  # placeholder
        {"name": "Failed Login Ratio", "value": int(failed * 10)}
    ]

    # =========================
    # 5. Feature Importance (mocked but realistic)
    # =========================
    feature_importance = [
        {"feature": "Off-hours activity", "impact": 0.32},
        {"feature": "Export behaviour", "impact": 0.41},
        {"feature": "Login variability", "impact": float(user.get("behavior_variability_score", 0.3))}
    ]

    # =========================
    # 6. Radar Profile
    # =========================
    exports_count = (user_events["action"] == "export").sum()

    radar_profile = [
        {"subject": "Login Discipline", "A": 100 - float(user.get("behavior_variability_score", 0.3)) * 100},
        {"subject": "File Usage", "A": int(exports_count * 20)},
        {"subject": "Privilege Usage", "A": int(user.get("privilege_level", 1) * 30)},
        {"subject": "Anomaly Exposure", "A": int(exports_count * 25)}
    ]

    return {
        "risk_trend": risk_trend,
        "login_deviation": login_deviation,
        "data_access": data_access,
        "compliance": compliance_data,
        "feature_importance": feature_importance,
        "radar_profile": radar_profile
    }