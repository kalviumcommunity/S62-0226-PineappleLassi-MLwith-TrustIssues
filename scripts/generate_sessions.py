import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

np.random.seed(42)
random.seed(42)

# Load users
users_df = pd.read_csv("users.csv")

START_DATE = datetime(2025, 1, 1)
END_DATE = datetime(2025, 2, 15)

DEVICE_TYPES = ["laptop", "workstation", "vpn"]
LOCATIONS = ["India", "USA", "Germany", "Singapore"]

sessions = []
session_counter = 0

def sample_session_duration(role):
    if role == "user":
        return np.random.randint(30, 120)
    elif role == "power_user":
        return np.random.randint(60, 180)
    else:  # admin
        return np.random.randint(90, 180)

for _, user in users_df.iterrows():
    user_id = user["user_id"]
    role = user["role"]
    
    preferred_devices = random.sample(DEVICE_TYPES, k=2)
    preferred_locations = random.sample(LOCATIONS, k=2)
    
    current_date = START_DATE
    
    while current_date <= END_DATE:
        if np.random.rand() < 0.6:
            sessions_today = np.random.randint(1, 3)
            last_session_end = None
            
            for session_idx in range(sessions_today):
                session_counter += 1
                session_id = f"S{session_counter:05d}"
                
                if session_idx == 0:
                    # First session: follow login baseline
                    login_hour = int(
                        np.random.normal(
                            user["typical_login_hour"],
                            user["login_hour_std"]
                        )
                    )
                    login_hour = max(0, min(23, login_hour))
                    
                    login_minute = np.random.randint(0, 60)
                    session_start = current_date.replace(
                        hour=login_hour,
                        minute=login_minute,
                        second=0
                    )
                else:
                    # Subsequent session: start after previous ends
                    break_minutes = np.random.randint(30, 120)
                    session_start = last_session_end + timedelta(minutes=break_minutes)
                
                duration_minutes = sample_session_duration(role)
                session_end = session_start + timedelta(minutes=duration_minutes)
                
                last_session_end = session_end
                
                device = random.choice(preferred_devices)
                location = random.choice(preferred_locations)
                
                login_method = (
                    "password+token" if role == "admin"
                    else random.choice(["password", "password+token"])
                )
                
                mfa_used = (
                    True if role == "admin"
                    else np.random.rand() < 0.6
                )
                
                sessions.append([
                    session_id,
                    user_id,
                    session_start,
                    session_end,
                    device,
                    location,
                    login_method,
                    mfa_used
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
    "mfa_used"
])

sessions_df.to_csv("sessions.csv", index=False)