import pandas as pd
from config.config import DATA_PATH, USERS_PATH

def generate_alert_trend(sessions):
    df = sessions.copy()

    df["processed_at"] = pd.to_datetime(sessions["processed_at"], errors="coerce", format="mixed")

    # only anomalies
    df["is_anomaly"] = df["is_anomaly"].astype(str).str.lower() == "true"
    df = df[df["is_anomaly"] == True]

    # group by day
    trend = (
        df.groupby(df["processed_at"].dt.date)
        .size()
        .reset_index(name="alerts")
    )

    # take latest 30 days
    trend = trend.sort_values(by="processed_at", ascending=False).head(30)

    return [
        {"day": str(row["processed_at"]), "alerts": int(row["alerts"])}
        for _, row in trend.iterrows()
    ]

def generate_risk_distribution(sessions):
    df = sessions.copy()

    df["risk_level"] = df["risk_level"].fillna("LOW")

    medium = (df["risk_level"] == "MEDIUM").sum()
    high = (df["risk_level"] == "HIGH").sum()

    return [
        {"name": "Medium", "value": int(medium)},
        {"name": "High", "value": int(high)}
    ]


def generate_system_stats(users, sessions):
    total_users = len(users)

    # high risk users → any HIGH session
    high_risk_users = (
        sessions[sessions["risk_level"] == "HIGH"]["user_id"]
        .nunique()
    )

    avg_risk_score = sessions["risk_score"].mean()

    alerts_today = (
        sessions[
           pd.to_datetime(sessions["processed_at"], errors="coerce", format="mixed").dt.date ==
            pd.Timestamp.today().date()
        ]["is_anomaly"]
        .astype(str).str.lower().eq("true")
        .sum()
    )

    return {
        "totalUsers": int(total_users),
        "highRiskUsers": int(high_risk_users),
        "alertsToday": int(alerts_today),
        "avgRiskScore": round(float(avg_risk_score), 2) if pd.notna(avg_risk_score) else 0
    }

def fetch_overview_charts():
    sessions = pd.read_csv(DATA_PATH)
    users = pd.read_csv(USERS_PATH)

    return {
        "alert_trend": generate_alert_trend(sessions),
        "risk_distribution": generate_risk_distribution(sessions),
        "system_stats": generate_system_stats(users, sessions)
    }