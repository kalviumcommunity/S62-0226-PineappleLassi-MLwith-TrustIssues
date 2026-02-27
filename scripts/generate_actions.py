import pandas as pd
import numpy as np
import random
from datetime import timedelta

np.random.seed(42)
random.seed(42)

users_df = pd.read_csv("users.csv")
sessions_df = pd.read_csv("sessions.csv", parse_dates=["session_start", "session_end"])
resources_df = pd.read_csv("resources.csv")

# Pre-group resources
resources_by_dept = resources_df.groupby("owner_department")
admin_resources = resources_df[resources_df["resource_type"] == "admin_only"]

EVENT_ID = 0
events = []

def sample_event_count(role):
    if role == "user":
        return np.random.randint(5, 15)
    elif role == "power_user":
        return np.random.randint(8, 20)
    else:
        return np.random.randint(6, 25)

for _, session in sessions_df.iterrows():
    user_id = session["user_id"]
    session_id = session["session_id"]
    start = session["session_start"]
    end = session["session_end"]
    
    user = users_df[users_df["user_id"] == user_id].iloc[0]
    role = user["role"]
    dept = user["department"]
    
    n_events = sample_event_count(role)
    session_duration_minutes = int((end - start).total_seconds() / 60)
    
    event_offsets = sorted(
        np.random.choice(
            range(1, session_duration_minutes),
            size=n_events,
            replace=False
        )
    )

    event_times = [
        start + timedelta(minutes=int(x)) for x in event_offsets
    ]

    admin_action_budget = 0
    admin_action_positions = set()

    if role == "admin":
        admin_action_budget = np.random.choice(
            [0, 1, 2, 3],
            p=[0.4, 0.3, 0.2, 0.1]
        )

        if admin_action_budget > 0:
            admin_action_positions = set(
                np.random.choice(
                    range(n_events),
                    size=admin_action_budget,
                    replace=False
                )
            )
    
    for idx, ts in enumerate(event_times):
        
        # Event type logic
        if role == "admin" and idx in admin_action_positions:
            event_type = "admin_action"
            action = np.random.choice(
                ["config_change", "user_mgmt", "permission_change"]
            )
            resource = admin_resources.sample(1).iloc[0]
            privilege_used = np.random.rand() < 0.9
            if not privilege_used and np.random.rand() < 0.8:
                continue
            admin_command = action
            
        else:
            event_type = random.choice(["file_access", "api_call"])
            privilege_used = False
            admin_command = None

            # -------------------------
            # NEW: session progress
            # -------------------------
            progress = idx / (n_events - 1) if n_events > 1 else 0

            if event_type == "file_access":
                resource_pool = resources_by_dept.get_group(dept)
                resource = resource_pool.sample(1).iloc[0]

                # -------------------------
                # PHASE-AWARE ACTION LOGIC
                # -------------------------

                if resource["resource_type"] == "public":
                    if role == "user":
                        if progress < 0.3:        # early
                            action = np.random.choice(["read", "write"], p=[0.85, 0.15])
                        elif progress < 0.7:      # mid
                            action = np.random.choice(
                                ["read", "write", "export"],
                                p=[0.70, 0.27, 0.03]
                            )
                        else:                     # late
                            action = np.random.choice(
                                ["read", "export"],
                                p=[0.85, 0.15]
                            )

                    elif role == "power_user":
                        if progress < 0.3:
                            action = np.random.choice(["read", "write"], p=[0.75, 0.25])
                        elif progress < 0.7:
                            action = np.random.choice(
                                ["read", "write", "export"],
                                p=[0.65, 0.28, 0.07]
                            )
                        else:
                            action = np.random.choice(
                                ["read", "export"],
                                p=[0.80, 0.20]
                            )

                    else:  # admin
                        if progress < 0.3:
                            action = np.random.choice(["read", "write"], p=[0.70, 0.30])
                        elif progress < 0.7:
                            action = np.random.choice(
                                ["read", "write", "export"],
                                p=[0.55, 0.30, 0.15]
                            )
                        else:
                            action = np.random.choice(
                                ["read", "export"],
                                p=[0.75, 0.25]
                            )

                elif resource["resource_type"] == "sensitive":
                    if role == "user":
                        action = np.random.choice(
                            ["read", "write", "export"],
                            p=[0.85, 0.13, 0.02]
                        )
                    elif role == "power_user":
                        action = np.random.choice(
                            ["read", "write", "export"],
                            p=[0.70, 0.25, 0.05]
                        )
                    else:  # admin
                        action = np.random.choice(
                            ["read", "write", "export"],
                            p=[0.60, 0.30, 0.10]
                        )

                else:  # admin_only
                    if role == "admin" and np.random.rand() < 0.2:
                        action = "read"
                    else:
                        action = None
            else:  # api_call
                action = "api_call"

                # -------------------------
                # PHASE-AWARE API CALLS
                # -------------------------
                if progress < 0.3:
                    # early: fewer API calls
                    if np.random.rand() < 0.7:
                        continue

                if np.random.rand() < 0.8:
                    resource_pool = resources_by_dept.get_group(dept)
                else:
                    resource_pool = resources_df

                # Non-admins cannot access admin_only APIs
                if role != "admin":
                    resource_pool = resource_pool[
                        resource_pool["resource_type"] != "admin_only"
                    ]

                resource = resource_pool.sample(1).iloc[0]

        if action == None:
            continue

        if event_type == "api_call":
            privilege_used = (role == "admin")



        # Access success logic
        # Determine access success probabilistically
        if resource["resource_type"] == "public":
            access_success = np.random.rand() > 0.01

        elif resource["resource_type"] == "sensitive":
            if role in ["power_user", "admin"]:
                access_success = np.random.rand() > 0.05
            else:
                access_success = np.random.rand() > 0.30

        else:  # admin_only
            if role == "admin" and privilege_used:
                access_success = np.random.rand() > 0.05
            else:
                access_success = False
        
        # Data volume logic
        if not access_success:
            data_volume = 0
        elif action == "read":
            data_volume = np.random.randint(1, 20)

        elif action == "write":
            data_volume = np.random.randint(10, 50)

        elif action == "export":
            if resource["resource_type"] == "sensitive":
                data_volume = np.random.randint(200, 600)
            else:
                data_volume = np.random.randint(100, 300)

        else:
            data_volume = np.random.randint(1, 10)

       

        EVENT_ID += 1
        event_id = f"E{EVENT_ID:06d}"
        
        events.append([
            event_id,
            session_id,
            user_id,
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
    "admin_command_type"
])

# events_df.to_csv("events.csv", index=False)
events_df.to_csv("events_base.csv", index=False)