import pandas as pd
import json
import numpy as np
from datetime import timedelta

np.random.seed(42)

# -------------------------------
# Load data
# -------------------------------
events = pd.read_csv("events_base.csv", parse_dates=["timestamp"])
sessions = pd.read_csv("sessions.csv", parse_dates=["session_start", "session_end"])
users = pd.read_csv("users.csv")

with open("anomaly_config.json") as f:
    config = json.load(f)

# -------------------------------
# Select rare users
# -------------------------------
n_users = users.shape[0]
n_rare = max(1, int(n_users * config["rare_user_fraction"]))

rare_users = np.random.choice(
    users["user_id"],
    size=n_rare,
    replace=False
)

rare_admins = users[
    (users["user_id"].isin(rare_users)) &
    (users["role"] == "admin")
]["user_id"].tolist()

# Ensure at least one admin if admins exist
admins = users[users["role"] == "admin"]["user_id"].tolist()
if admins and not rare_admins:
    rare_admins = [np.random.choice(admins)]

# -------------------------------
# Time window
# -------------------------------
max_time = events["timestamp"].max()
window_start = max_time - timedelta(days=config["time_window_days"])

recent_mask = events["timestamp"] >= window_start

# ============================================================
# ADMIN ANOMALY 1: OFF-HOURS ACTIVITY (SESSION-SAFE)
# ============================================================
if config["admin_anomalies"]["off_hours_admin"]:
    for admin in rare_admins:
        admin_sessions = sessions[(sessions["user_id"] == admin) & (sessions["session_end"] >= window_start)]

        if admin_sessions.empty:
            continue
        
        # choose only a small number of sessions to modify
        n_sessions = min(2, len(admin_sessions))  # LOW severity
        selected_sessions = admin_sessions.sample(n_sessions, random_state=42)

        for _, s in selected_sessions.iterrows():
            if s["session_end"] < window_start:
                continue

            mask = (
                (events["session_id"] == s["session_id"]) &
                (events["user_id"] == admin)
            )

            if mask.sum() == 0:
                continue

            night_hour = np.random.randint(1, 4)
            shift = timedelta(hours=night_hour - s["session_start"].hour)

            new_times = events.loc[mask, "timestamp"] + shift

            # Clamp to session bounds
            upper_bound = s["session_end"] - timedelta(minutes=1)

            events.loc[mask, "timestamp"] = new_times.where(
                new_times <= upper_bound,
                upper_bound
            )

# ============================================================
# ADMIN ANOMALY 2: PRIVILEGE → EXPORT SEQUENCE (ORDER-SAFE)
# ============================================================
if config["admin_anomalies"]["privilege_then_export"]:
    admin_sessions = events[
        events["user_id"].isin(rare_admins)
    ]["session_id"].unique()

    for s_id in admin_sessions:
        session_events = events[events["session_id"] == s_id]

        admin_actions = session_events[
            session_events["event_type"] == "admin_action"
        ]

        if admin_actions.empty:
            continue

        last_admin_idx = admin_actions.index[-1]

        later_events = session_events[
            session_events.index > last_admin_idx
        ]

        if later_events.empty:
            continue

        idx = later_events.index[0]

        events.loc[idx, "event_type"] = "file_access"
        events.loc[idx, "action"] = "export"
        events.loc[idx, "data_volume_mb"] = np.random.randint(400, 700)

# ============================================================
# USER ANOMALY: ONE-TIME BULK EXPORT
# ============================================================
if config["user_anomalies"]["bulk_export"]:
    normal_users = users[
        (users["user_id"].isin(rare_users)) &
        (users["role"] == "user")
    ]["user_id"]

    for u in normal_users:
        user_events = events[
            (events["user_id"] == u) &
            recent_mask
        ]

        if user_events.empty:
            continue

        idx = user_events.sample(1).index[0]

        events.loc[idx, "event_type"] = "file_access"
        events.loc[idx, "action"] = "export"
        events.loc[idx, "data_volume_mb"] = np.random.randint(300, 600)

# -------------------------------
# Save final data
# -------------------------------
events.to_csv("events.csv", index=False)