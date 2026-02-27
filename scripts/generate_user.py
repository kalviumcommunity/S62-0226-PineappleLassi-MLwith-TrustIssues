import pandas as pd
import numpy as np
import random

np.random.seed(42)
random.seed(42)

N_USERS = 20

ROLES = ["user", "power_user", "admin"]
ROLE_PROBS = [0.7, 0.2, 0.1]

DEPARTMENTS = ["Finance", "IT", "Security", "Sales", "HR"]

users = []

for i in range(N_USERS):
    user_id = f"U{i:03d}"
    
    if i < 4:
        role = "admin"
    else:
        role = np.random.choice(ROLES, p=ROLE_PROBS)
    
    # Role-based privilege
    if role == "user":
        privilege_level = np.random.choice([1, 2])
        tenure_months = np.random.randint(3, 60)
        typical_login_hour = np.random.randint(9, 11)
        login_hour_std = np.random.uniform(0.8, 1.5)
        department = np.random.choice(DEPARTMENTS)
        
    elif role == "power_user":
        privilege_level = np.random.choice([2, 3])
        tenure_months = np.random.randint(12, 72)
        typical_login_hour = np.random.randint(8, 10)
        login_hour_std = np.random.uniform(0.7, 1.2)
        department = np.random.choice(["IT", "Security", "Finance"])
        
    else:  # admin
        privilege_level = 4
        tenure_months = np.random.randint(36, 120)
        typical_login_hour = np.random.randint(9, 12)
        login_hour_std = np.random.uniform(1.0, 2.0)
        department = np.random.choice(["IT", "Security"])


    # event type preference
    if role == "user":
        file_access_prob = np.random.uniform(0.7, 0.9)
    elif role == "power_user":
        file_access_prob = np.random.uniform(0.5, 0.7)
    else:
        file_access_prob = np.random.uniform(0.3, 0.6)

    api_call_prob = 1 - file_access_prob

    # activity level (controls number of events)
    activity_level = np.random.uniform(0.8, 1.2)

    # data intensity (controls data volume)
    data_intensity = np.random.uniform(0.8, 1.5)
    
    users.append([
        user_id,
        role,
        department,
        privilege_level,
        tenure_months,
        typical_login_hour,
        round(login_hour_std, 2),

        file_access_prob,
        api_call_prob,
        activity_level,
        data_intensity
    ])

users_df = pd.DataFrame(users, columns=[
    "user_id",
    "role",
    "department",
    "privilege_level",
    "tenure_months",
    "typical_login_hour",
    "login_hour_std",

    "file_access_prob",
    "api_call_prob",
    "activity_level",
    "data_intensity"
])

users_df.to_csv("users.csv", index=False)