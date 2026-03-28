import pandas as pd
from config.config import DATA_PATH, USERS_PATH

def get_risky_user_ids(sessions):

    df = sessions.copy()
    df["is_anomaly"] = df["is_anomaly"].astype(str).str.lower() == "true"

    grouped = df.groupby("user_id").agg({
        "session_id": "count",
        "is_anomaly": "sum",
        "risk_level": lambda x: (x == "HIGH").sum()
    }).reset_index()

    grouped.columns = ["user_id", "total_sessions", "anomalies", "high_sessions"]

    # 🔥 metrics
    grouped["anomaly_ratio"] = grouped["anomalies"] / grouped["total_sessions"]

    # 🔥 scoring (weighted)
    grouped["risk_score"] = (
        grouped["high_sessions"] * 3 +
        grouped["anomalies"] * 1.5 +
        grouped["anomaly_ratio"] * 5
    )

    # 🔥 dynamic threshold (top 10–15%)
    threshold = grouped["risk_score"].quantile(0.85)

    risky_users = grouped[grouped["risk_score"] >= threshold]

    return risky_users["user_id"].tolist()

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
    high_risk_users = len(get_risky_user_ids(sessions))

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

def fetch_risky_users_details():

    sessions = pd.read_csv(DATA_PATH)
    users = pd.read_csv(USERS_PATH)

    risky_user_ids = get_risky_user_ids(sessions);

    df = sessions.copy()

    # normalize anomaly
    df["is_anomaly"] = df["is_anomaly"].astype(str).str.lower() == "true"

    # parse datetime safely
    df["processed_at"] = pd.to_datetime(
        df["processed_at"], errors="coerce", format="mixed"
    )

    # filter only risky users
    df = df[df["user_id"].isin(risky_user_ids)]

    # =========================
    # USER LEVEL AGGREGATION
    # =========================
    grouped = df.groupby("user_id").agg({
        "session_id": "count",
        "is_anomaly": "sum",
        "risk_score": "mean",
        "processed_at": "max"   # last anomaly timestamp (we'll refine below)
    }).reset_index()

    grouped.columns = [
        "user_id",
        "total_sessions",
        "anomalies",
        "avg_risk_score",
        "last_activity"
    ]

    # =========================
    # LAST ANOMALY TIMESTAMP (correct way)
    # =========================
    last_anomaly = (
        df[df["is_anomaly"] == True]
        .groupby("user_id")["processed_at"]
        .max()
        .reset_index()
        .rename(columns={"processed_at": "last_anomaly_timestamp"})
    )

    # =========================
    # MERGE USERS DATA
    # =========================
    result = grouped.merge(users, on="user_id", how="left")
    result = result.merge(last_anomaly, on="user_id", how="left")

    # =========================
    # FINAL FORMAT
    # =========================
    output = []

    for _, row in result.iterrows():
        output.append({
            "user_id": row["user_id"],
            "department": row.get("department", ""),
            "variability_score": float(row.get("behavior_variability_score", 0)),
            "risk_score": round(float(row["avg_risk_score"]), 2)
                if pd.notna(row["avg_risk_score"]) else 0,
            "last_anomaly_timestamp": str(row["last_anomaly_timestamp"])
                if pd.notna(row["last_anomaly_timestamp"]) else ""
        })

    return output