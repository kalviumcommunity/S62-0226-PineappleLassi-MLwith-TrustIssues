from pipeline.data_loader import load_session_data
from pipeline.feature_engineering import build_features
from pipeline.scoring import compute_score
from pipeline.reasoning import generate_reasons
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


thresholds = joblib.load(os.path.join(BASE_DIR, "..", "outputs", "artifacts", "thresholds.pkl"))

LOW_TH = thresholds["low"]
HIGH_TH = thresholds["high"]


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

    return result


# =========================
# TEST RUN
# =========================
if __name__ == "__main__":
    res = predict_session("S_ANOM_155938")
    print(res)