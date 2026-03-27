# =========================
# anomaly_session_generator.py
# =========================

import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# Load data
users_df = pd.read_csv(os.path.join(BASE_DIR,"..", "data", "users.csv"))
sessions_df = pd.read_csv(os.path.join(BASE_DIR,"..", "data", "sessions.csv"), parse_dates=["session_start", "session_end"])
events_df = pd.read_csv(os.path.join(BASE_DIR,"..", "data", "events_base.csv"), parse_dates=["timestamp"])
resources_df = pd.read_csv(os.path.join(BASE_DIR,"..", "data", "resources.csv"))


# =========================
# Helper: Create new session
# =========================
def create_session(user):

    session_id = f"S_ANOM_{random.randint(100000,999999)}"

    base_date = datetime(2025, 2, 20)

    # force suspicious timing if needed
    session_start = base_date.replace(hour=random.choice([1, 2, 3, 23]))
    duration = random.randint(60, 180)

    session_end = session_start + timedelta(minutes=duration)

    # 🔥 convert to string (CSV compatible)
    session_start_str = session_start.strftime("%Y-%m-%d %H:%M:%S")
    session_end_str = session_end.strftime("%Y-%m-%d %H:%M:%S")

    return {
        "session_id": session_id,
        "user_id": user["user_id"],
        "session_start": session_start_str,
        "session_end": session_end_str,
        "device_type": "vpn",
        "location": random.choice(["Germany", "Singapore"]),
        "login_method": "password",
        "mfa_used": False,
        "failed_login_attempts": random.randint(2, 6)
    }


# =========================
# Event generator
# =========================
def generate_events(session, user, anomaly_type, n_events=20):

    events = []

    for i in range(n_events):

        start_dt = pd.to_datetime(session["session_start"])
        ts = start_dt + timedelta(minutes=i)

        ts_str = ts.strftime("%Y-%m-%d %H:%M:%S")

        # ----------------------------
        # Default normal resource
        # ----------------------------
        resource = resources_df.sample(1).iloc[0]

        # =========================
        # Apply anomaly
        # =========================

        if anomaly_type == "privilege_escalation":
            resource = resources_df[
                resources_df["required_privilege_level"] > user["privilege_level"]
            ].sample(1).iloc[0]

            access_success = True

        elif anomaly_type == "data_exfiltration":
            resource = resources_df[
                resources_df["resource_type"] == "sensitive"
            ].sample(1).iloc[0]

            access_success = True

        elif anomaly_type == "cross_department_abuse":
            resource = resources_df[
                resources_df["owner_department"] != user["department"]
            ].sample(1).iloc[0]

            access_success = True

        else:
            access_success = True

        # =========================
        # Action selection
        # =========================

        if anomaly_type == "data_exfiltration":
            action = "export"
            event_type = "file_export"
            data_volume = resource["resource_size_mb"] * random.uniform(1.0, 2.5)

        elif anomaly_type == "burst_activity":
            action = "read"
            event_type = "file_access"
            data_volume = resource["resource_size_mb"] * 0.1

        elif anomaly_type == "off_hours_admin":
            action = "config_change"
            event_type = "admin_action"
            data_volume = random.uniform(1, 5)

        else:
            action = "read"
            event_type = "file_access"
            data_volume = resource["resource_size_mb"] * 0.2

        event = {
            "event_id": f"E_ANOM_{random.randint(100000,999999)}",
            "session_id": session["session_id"],
            "user_id": user["user_id"],
            "timestamp": ts_str,
            "event_type": event_type,
            "action": action,
            "resource_id": resource["resource_id"],
            "data_volume_mb": round(data_volume, 2),
            "access_success": access_success,
            "privilege_used": user["privilege_level"] + 1,
            "admin_command_type": "config_change" if event_type == "admin_action" else None
        }

        events.append(event)

    return pd.DataFrame(events)


# =========================
# Main generator
# =========================
def generate_anomalous_session(user_id=None, anomaly_type="data_exfiltration"):

    if user_id:
        user = users_df[users_df["user_id"] == user_id].iloc[0]
    else:
        user = users_df.sample(1).iloc[0]

    print(f"\n🚨 Generating {anomaly_type} for user {user['user_id']}")

    session = create_session(user)
    events = generate_events(session, user, anomaly_type)

    return session, events


def save_generated_data(session, events):
    # Paths
    sessions_path = os.path.join(BASE_DIR, "..", "data", "sessions.csv")
    events_path = os.path.join(BASE_DIR, "..", "data", "events_base.csv")

    # Convert session dict to DataFrame
    session_df = pd.DataFrame([session])

    # Append session
    if os.path.exists(sessions_path):
        session_df.to_csv(sessions_path, mode='a', header=False, index=False)
    else:
        session_df.to_csv(sessions_path, index=False)

    # Append events
    if os.path.exists(events_path):
        events.to_csv(events_path, mode='a', header=False, index=False)
    else:
        events.to_csv(events_path, index=False)


# =========================
# Run example
# =========================
if __name__ == "__main__":

    session, events = generate_anomalous_session(
        anomaly_type="data_exfiltration"
    )

    save_generated_data(session, events)

    print("\nGenerated Session:")
    print(session)

    print("\nGenerated Events:")
    print(events.head())