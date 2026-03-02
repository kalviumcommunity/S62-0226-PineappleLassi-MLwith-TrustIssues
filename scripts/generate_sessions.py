import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

np.random.seed(42)
random.seed(42)

# Load users
users_df = pd.read_csv("users2.csv")

START_DATE = datetime(2025, 1, 1)
END_DATE = datetime(2025, 2, 15)

DEVICE_TYPES = ["laptop", "workstation", "vpn"]
LOCATIONS = ["India", "USA", "Germany", "Singapore"]

sessions = []
session_counter = 0


def sample_session_duration(role, variability, tenure_months):
    base = {
        "user": np.random.normal(90, 30),
        "power_user": np.random.normal(120, 40),
        "admin": np.random.normal(150, 50),
    }[role]

    # Tenure adjustment: newer users may have shorter sessions, while very long-tenured users might have more complex tasks leading to longer sessions
    if tenure_months > 36:
        base += 20
    elif tenure_months < 6:
        base -= 15

    noise = np.random.normal(0, variability * 30)
    duration = max(20, base + noise)
    return int(duration)


for _, user in users_df.iterrows():
    user_id = user["user_id"]
    role = user["role"]
    variability = user["behavior_variability_score"]
    remote_worker = user["remote_worker"]
    employment_status = user["employment_status"]
    tenure_months = user["tenure_months"]

    current_date = START_DATE

    while current_date <= END_DATE:

        weekday = current_date.weekday()

        # Base login probability
        base_prob = 0.75

        if role == "admin":
            base_prob += 0.1
        if remote_worker:
            base_prob += 0.05
        if employment_status == "on_notice":
            base_prob -= 0.1
        
        # Tenure adjustment
        if tenure_months < 6:
            base_prob -= 0.1
        elif tenure_months > 48:
            base_prob += 0.05

        # Weekend adjustment
        if weekday >= 5:
            if role == "admin":
                base_prob *= 0.6
            else:
                base_prob *= 0.3
        
        base_prob = np.clip(base_prob, 0.05, 0.95)

        login_today = np.random.rand() < base_prob

        if login_today:

            # Sessions per day influenced by variability
            sessions_today = np.random.poisson(1 + variability)
            sessions_today = max(1, min(3, sessions_today))

            last_session_end = None

            for s in range(sessions_today):

                session_counter += 1
                session_id = f"S{session_counter:05d}"

                # Login time
                after_hours_prob = 0.03

                if tenure_months > 48:
                    after_hours_prob += 0.04
                elif tenure_months < 6:
                    after_hours_prob -= 0.02
                
                if role == "admin" and tenure_months > 48:
                    after_hours_prob += 0.05
                
                if remote_worker:
                    after_hours_prob += 0.02
                
                after_hours_prob = np.clip(after_hours_prob, 0.01, 0.15)

                if np.random.rand() < after_hours_prob:
                    # rare after-hours
                    login_hour = np.random.randint(0, 6)
                else:
                    login_hour = int(np.random.normal(
                        user["typical_login_hour"],
                        user["login_hour_std"]
                    ))

                login_hour = max(6, min(20, login_hour))
                login_minute = np.random.randint(0, 60)

                if s == 0:
                    session_start = current_date.replace(
                        hour=login_hour,
                        minute=login_minute,
                        second=0
                    )
                else:
                    break_minutes = np.random.randint(20, 120)
                    session_start = last_session_end + timedelta(minutes=break_minutes)

                duration_minutes = sample_session_duration(role, variability, tenure_months)
                session_end = session_start + timedelta(minutes=duration_minutes)

                # Prevent spillover to next day
                if session_end.date() != current_date.date():
                    session_end = current_date.replace(
                        hour=23, minute=59, second=0
                    )

                last_session_end = session_end

                # Device selection by role
                if role == "admin":
                    device = np.random.choice(
                        DEVICE_TYPES, p=[0.1, 0.5, 0.4]
                    )
                elif role == "power_user":
                    device = np.random.choice(
                        DEVICE_TYPES, p=[0.5, 0.3, 0.2]
                    )
                else:
                    device = np.random.choice(
                        DEVICE_TYPES, p=[0.7, 0.2, 0.1]
                    )

                # Location logic
                if remote_worker:
                    location = np.random.choice(
                        LOCATIONS, p=[0.4, 0.2, 0.2, 0.2]
                    )
                else:
                    location = np.random.choice(
                        LOCATIONS, p=[0.85, 0.05, 0.05, 0.05]
                    )

                # Login method influenced by device
                if device == "vpn":
                    login_method = "password+token"
                else:
                    login_method = np.random.choice(
                        ["password", "password+token"],
                        p=[0.6, 0.4]
                    )

                # MFA probability
                if role == "admin":
                    mfa_used = np.random.rand() < 0.95
                else:
                    mfa_used = np.random.rand() < 0.7

                # Failed login attempts
                failed_base_prob = 0.3
                if(tenure_months < 6):
                    failed_base_prob += 0.2
                elif(tenure_months > 48):
                    failed_base_prob -= 0.1
                failed_attempts = np.random.poisson(failed_base_prob + variability)

                sessions.append([
                    session_id,
                    user_id,
                    session_start,
                    session_end,
                    device,
                    location,
                    login_method,
                    mfa_used,
                    failed_attempts
                ])

        current_date += timedelta(days=1)


sessions_df = pd.DataFrame(sessions, columns=[
    "session_id",
    "user_id",
    "session_start",
    "session_end",
    "device_type",
    "location",
    "login_method",
    "mfa_used",
    "failed_login_attempts"
])

sessions_df.to_csv("sessions2.csv", index=False)

print("sessions.csv generated successfully.")