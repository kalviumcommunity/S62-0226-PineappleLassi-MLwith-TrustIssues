from pipeline.data_loader import load_session_data
from pipeline.feature_engineering import build_features
from pipeline.scoring import compute_score
from pipeline.reasoning import generate_reasons
import joblib
import os
import pandas as pd
import json
from datetime import datetime


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "..", "data", "sessions.csv")



thresholds = joblib.load(os.path.join(BASE_DIR, "..", "outputs", "artifacts", "thresholds.pkl"))

LOW_TH = thresholds["low"]
HIGH_TH = thresholds["high"]

def ensure_columns(df):
    required_cols = [
        "risk_score", "risk_level",
        "is_anomaly", "confidence", "reasons", "processed_at"
    ]

    for col in required_cols:
        if col not in df.columns:
            df[col] = pd.NA

    return df

def update_session_with_prediction(session_id, result, processed_at):
    df = pd.read_csv(DATA_PATH)

    df = ensure_columns(df)

    # Find the session row
    idx = df[df["session_id"] == session_id].index

    if len(idx) == 0:
        raise ValueError("Session not found")

    idx = idx[-1]

    # Update values
    df.loc[idx, "risk_score"] = result["risk_score"]
    df.loc[idx, "risk_level"] = result["risk_level"]
    df.loc[idx, "is_anomaly"] = result["is_anomaly"]
    df.loc[idx, "confidence"] = result["confidence"]
    df.loc[idx, "reasons"] = json.dumps(result["reasons"])
    df.loc[idx, "processed_at"] = processed_at

    # Reorder 

    DESIRED_ORDER = [
        "session_id", "user_id", "session_start", "session_end",
        "device_type", "location", "login_method", "mfa_used",
        "failed_login_attempts",
        "risk_score", "risk_level", "is_anomaly",
        "confidence", "reasons", "processed_at"
    ]

    df = df.reindex(columns=[col for col in DESIRED_ORDER if col in df.columns])

    # Save back
    temp_path = DATA_PATH + ".tmp"
    df.to_csv(temp_path, index=False)
    os.replace(temp_path, DATA_PATH)


def predict_session(session_id):

    # Step 1: Load data
    session, user, events, resources_df = load_session_data(session_id)

    # Step 2: Feature engineering
    features = build_features(session, user, events, resources_df)

    # Step 3: Get role
    role = user["role"]

    # Step 4: Score
    score = compute_score(features, role, events)

    # Step 5: Decision
    if score > HIGH_TH:
        risk = "HIGH"
        anomaly = True
    elif score > LOW_TH:
        risk = "MEDIUM"
        anomaly = True
    else:
        risk = "LOW"
        anomaly = False

    # Step 6: Reasoning
    reasons = generate_reasons(features)

    # Step 7 : Score Confidence
    mid = (LOW_TH + HIGH_TH) / 2
    max_dist = max(abs(HIGH_TH - mid), abs(LOW_TH - mid))

    confidence = abs(score - mid) / max_dist
    confidence = max(0, min(1, confidence))

    confidence_percent = round(confidence * 100, 2)

    result = {
        "session_id": session_id,
        "risk_score": float(score),
        "risk_level": risk,
        "is_anomaly": anomaly,
        "confidence": confidence_percent,
        "reasons": reasons  
    }

    print(f"[INFO] Processed session {session_id} → {risk}")

    return result

def predict_and_store_session(session_id):
    res = predict_session(session_id)
    processed_at = datetime.now().isoformat()
    update_session_with_prediction(session_id, res, processed_at)

    res['timestamp'] = processed_at

    return res


# =========================
# TEST RUN
# =========================
if __name__ == "__main__":
    res = predict_and_store_session("S_ANOM_155938")
    print(res)