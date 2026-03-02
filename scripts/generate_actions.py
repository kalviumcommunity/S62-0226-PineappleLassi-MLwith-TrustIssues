import pandas as pd
import numpy as np
import random
from datetime import timedelta

np.random.seed(42)
random.seed(42)

users_df = pd.read_csv("users2.csv")
sessions_df = pd.read_csv("sessions2.csv", parse_dates=["session_start", "session_end"])
resources_df = pd.read_csv("resources2.csv")

global_resources = resources_df[resources_df["access_scope"] == "global"]

EVENT_ID = 0
events = []


# ----------------------------
# Event count depends on session length
# ----------------------------
def sample_event_count(role, duration_minutes):
    base = {
        "user": np.random.normal(8, 2),
        "power_user": np.random.normal(12, 3),
        "admin": np.random.normal(14, 4),
    }[role]

    scaled = base * (duration_minutes / 120)
    return max(3, int(abs(scaled)))


# ----------------------------
# Resource Selection
# ----------------------------
def select_resource(user):
    role = user["role"]
    dept = user["department"]

    if role == "admin":
        probs = [0.45, 0.35, 0.20]
    elif role == "power_user":
        probs = [0.65, 0.25, 0.10]
    else:
        probs = [0.75, 0.15, 0.10]

    choice = np.random.choice(["own", "cross", "global"], p=probs)

    if choice == "own":
        pool = resources_df[
            (resources_df["owner_department"] == dept)
            & (resources_df["access_scope"] != "global")
        ]
    elif choice == "cross":
        pool = resources_df[
            (resources_df["owner_department"] != dept)
            & (resources_df["access_scope"] == "cross_department")
        ]
    else:
        pool = global_resources

    # 🔥 FILTER HERE
    if role != "admin":
        pool = pool[pool["resource_type"] != "admin_only"]

    if len(pool) == 0:
        pool = resources_df[resources_df["resource_type"] != "admin_only"]

    return pool.sample(1).iloc[0]


for _, session in sessions_df.iterrows():

    user = users_df[users_df["user_id"] == session["user_id"]].iloc[0]

    role = user["role"]
    tenure = user["tenure_months"]
    variability = user["behavior_variability_score"]
    max_priv = user["privilege_level"]

    session_id = session["session_id"]
    start = session["session_start"]
    end = session["session_end"]

    duration_minutes = int((end - start).total_seconds() / 60)

    if duration_minutes <= 1:
        continue

    n_events = sample_event_count(role, duration_minutes)

    offsets = sorted(
        np.random.choice(
            range(1, duration_minutes),
            size=min(n_events, duration_minutes - 1),
            replace=False
        )
    )

    for offset in offsets:

        ts = start + timedelta(minutes=int(offset))

        after_hours = ts.hour < 6 or ts.hour > 20
        device = session["device_type"]
        mfa_used = session["mfa_used"]
        location = session["location"]

        resource = select_resource(user)

        resource_type = resource["resource_type"]
        sensitivity = resource["sensitivity_score"]
        required_priv = resource["required_privilege_level"]
        resource_size = resource["resource_size_mb"]
        scope = resource["access_scope"]

        # ----------------------------
        # ACTION SELECTION
        # ----------------------------

        # Base export probability influenced by sensitivity (continuous)
        export_base = 0.02 + (sensitivity * 0.08)

        # Slight role influence (reduced determinism)
        if role == "power_user":
            export_base += 0.02
        elif role == "admin":
            export_base += 0.03

        # Slight after-hours adjustment (small, not aggressive)
        if after_hours:
            export_base *= 0.9  # mild reduction only

        export_base = np.clip(export_base, 0.01, 0.15)

        if resource_type == "public":
            action = np.random.choice(["read", "write"], p=[0.82, 0.18])

        elif resource_type == "sensitive":

            # Remaining probability after export
            remaining = 1 - export_base

            # Baseline read/write split (before export influence)
            read_ratio = 0.75
            write_ratio = 0.25

            # Normalize read/write proportions
            total_rw = read_ratio + write_ratio
            read_prob = remaining * (read_ratio / total_rw)
            write_prob = remaining * (write_ratio / total_rw)

            probs = [read_prob, write_prob, export_base]

            # Final safety normalization (avoid floating issues)
            probs = np.array(probs)
            probs = probs / probs.sum()

            action = np.random.choice(
                ["read", "write", "export"],
                p=probs
            )

        else:  # admin_only
            if role != "admin":
                continue
            action = np.random.choice(["read", "config_change"], p=[0.7, 0.3])

        # ----------------------------
        # PRIVILEGE USED (no escalation)
        # ----------------------------

        privilege_used = min(required_priv, max_priv)

        # Slight over-provision use (not escalation)
        if np.random.rand() < (0.04 + variability * 0.03):
            privilege_used = max_priv

        # ----------------------------
        # ACCESS SUCCESS
        # ----------------------------

        base_fail = 0.02

        if scope == "cross_department":
            base_fail += 0.03

        if resource_type == "admin_only":
            base_fail += 0.02

        if tenure < 6:
            base_fail += 0.02

        if not mfa_used and resource_type != "public":
            base_fail += 0.03

        base_fail = np.clip(base_fail, 0.01, 0.15)

        if privilege_used >= required_priv:
            access_success = np.random.rand() > base_fail
        else:
            access_success = False

        # ----------------------------
        # DATA VOLUME (realistic)
        # ----------------------------

        if not access_success:
            data_volume = 0

        elif action == "read":
            data_volume = resource_size * np.random.uniform(0.01, 0.08)

        elif action == "write":
            data_volume = resource_size * np.random.uniform(0.08, 0.35)

        elif action == "export":
            data_volume = resource_size * np.random.uniform(0.8, 1.05)

        else:  # config_change
            data_volume = np.random.uniform(1, 5)

        data_volume = round(float(data_volume), 2)

        # ----------------------------
        # EVENT TYPE
        # ----------------------------

        if action == "config_change":
            event_type = "admin_action"
            admin_command = "config_change"
        elif action == "export":
            event_type = "file_export"
            admin_command = None
        else:
            event_type = "file_access"
            admin_command = None

        EVENT_ID += 1
        event_id = f"E{EVENT_ID:06d}"

        events.append([
            event_id,
            session_id,
            user["user_id"],
            ts,
            event_type,
            action,
            resource["resource_id"],
            data_volume,
            access_success,
            privilege_used,
            admin_command
        ])


events_df = pd.DataFrame(events, columns=[
    "event_id",
    "session_id",
    "user_id",
    "timestamp",
    "event_type",
    "action",
    "resource_id",
    "data_volume_mb",
    "access_success",
    "privilege_used",
    "admin_command_type",
])

events_df.to_csv("events_base2.csv", index=False)

print("events_base2.csv generated successfully.")