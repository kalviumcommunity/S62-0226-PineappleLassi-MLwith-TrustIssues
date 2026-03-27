import pandas as pd
import json
from typing import List
from config.config import DATA_PATH, USERS_PATH
from schemas.sessions import SessionsResponse
from schemas.user import UserResponse


def fetch_user_sessions(user_id: str) -> List[SessionsResponse]:
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

    # 🔥 Filter by user
    df = df[df["user_id"] == user_id]

    if df.empty:
        return []

    # 🔥 Convert types safely
    df["is_anomaly"] = df["is_anomaly"].astype(str).str.lower() == "true"
    df["processed_at"] = pd.to_datetime(df["processed_at"], errors="coerce")

    # 🔥 Sort latest first
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


def fetch_all_users() -> List[UserResponse]:
    df = pd.read_csv(USERS_PATH)

    required_cols = ["user_id", "department", "role"]

    # Ensure columns exist
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing column: {col}")

    users = []

    for _, row in df.iterrows():
        user = UserResponse(
            user_id=row["user_id"],
            department=row["department"],
            role=row["role"]
        )
        users.append(user)

    return users