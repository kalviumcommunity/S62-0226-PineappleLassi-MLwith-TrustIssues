from scripts.anomaly_injector import generate_anomalous_session, save_generated_data
from pipeline.predict import predict_and_store_session
from schemas.sessions import SessionsResponse
from typing import List

def inject_and_predict(user_id=None, anomaly_type="data_exfiltration") -> SessionsResponse:

    # 1. Generate
    session, events = generate_anomalous_session(user_id, anomaly_type)

    # 2. Save raw data
    save_generated_data(session, events)

    # 3. Predict + store
    result = predict_and_store_session(session["session_id"])

    result["user_id"] = session["user_id"]

    return result