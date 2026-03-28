import pandas as pd
import json
from typing import List
from schemas.sessions import SessionsResponse
from config.config import DATA_PATH  

def fetch_all_sessions() -> List[SessionsResponse]:
    df = pd.read_csv(DATA_PATH)

    # 🧠 Ensure required columns exist
    required_cols = [
        "session_id", "user_id",
        "risk_score", "risk_level",
        "is_anomaly", "confidence",
        "reasons", "processed_at"
    ]

    for col in required_cols:
        if col not in df.columns:
            df[col] = None

    # 🔥 Convert timestamp
    df["processed_at"] = pd.to_datetime(df["processed_at"], errors="coerce")

    # 🔥 Sort latest first
    df = df.sort_values(by="processed_at", ascending=False)

    sessions = []

    for _, row in df.iterrows():
        # 🧠 Parse reasons safely
        try:
            reasons = json.loads(row["reasons"]) if pd.notna(row["reasons"]) else []
        except:
            reasons = []

        session = SessionsResponse(
            session_id=row["session_id"],
            user_id=row["user_id"],
            timestamp=str(row["processed_at"]) if pd.notna(row["processed_at"]) else "",
            risk_score=float(row["risk_score"]) if pd.notna(row["risk_score"]) else 0.0,
            risk_level=row["risk_level"] if pd.notna(row["risk_level"]) else "LOW",
            is_anomaly=bool(row["is_anomaly"]) if pd.notna(row["is_anomaly"]) else False,
            confidence=float(row["confidence"]) if pd.notna(row["confidence"]) else 0.0,
            reasons=reasons
        )

        sessions.append(session)

    return sessions


def fetch_anomaly_sessions() -> List[SessionsResponse]:
    df = pd.read_csv(DATA_PATH)

    # Ensure required columns
    required_cols = [
        "session_id", "user_id",
        "risk_score", "risk_level",
        "is_anomaly", "confidence",
        "reasons", "processed_at"
    ]

    for col in required_cols:
        if col not in df.columns:
            df[col] = None

    # 🧠 Convert anomaly column safely
    df["is_anomaly"] = df["is_anomaly"].astype(str).str.lower() == "true"

    # 🔥 Filter anomalies
    df = df[df["is_anomaly"] == True]

    # 🔥 Sort latest first

    df["processed_at"] = pd.to_datetime(df["processed_at"], errors="coerce", format="mixed")
    df = df.sort_values(by="processed_at", ascending=False)




    sessions = []

    for _, row in df.iterrows():
        try:
            reasons = json.loads(row["reasons"]) if pd.notna(row["reasons"]) else []
        except:
            reasons = []
    
        session = SessionsResponse(
            session_id=row["session_id"],
            user_id=row["user_id"],
            timestamp=str(row["processed_at"]) if pd.notna(row["processed_at"]) else "",
            risk_score=float(row["risk_score"]) if pd.notna(row["risk_score"]) else 0.0,
            risk_level=row["risk_level"] if pd.notna(row["risk_level"]) else "LOW",
            is_anomaly=bool(row["is_anomaly"]),
            confidence=float(row["confidence"]) if pd.notna(row["confidence"]) else 0.0,
            reasons=reasons
        )

        sessions.append(session)

    return sessions