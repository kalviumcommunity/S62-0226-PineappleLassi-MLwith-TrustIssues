import pandas as pd
import numpy as np
import random

# np.random.seed(42)
# random.seed(42)

N_USERS = 20

ROLES = ["user", "power_user", "admin"]
ROLE_PROBS = [0.7, 0.2, 0.1]

DEPARTMENTS = ["Finance", "IT", "Security", "Sales", "HR"]

ROLE_CONFIG = {
    "user": {
        "privilege": 1,
        "tenure_range": (3, 60),
        "login_mean": 9.5,
        "login_std_mean": 1.2,
        "dept_pool": DEPARTMENTS
    },
    "power_user": {
        "privilege": 2,
        "tenure_range": (12, 84),
        "login_mean": 9,
        "login_std_mean": 1.5,
        "dept_pool": ["IT", "Security", "Finance"]
    },
    "admin": {
        "privilege": 3,
        "tenure_range": (24, 120),
        "login_mean": 8.5,
        "login_std_mean": 2.0,
        "dept_pool": ["IT", "Security"]
    }
}

# Ensure minimum department balance
dept_cycle = (DEPARTMENTS * (N_USERS // len(DEPARTMENTS) + 1))[:N_USERS]
random.shuffle(dept_cycle)

users = []

for i in range(N_USERS):
    user_id = f"U{i:03d}"
    
    role = np.random.choice(ROLES, p=ROLE_PROBS)
    config = ROLE_CONFIG[role]

    # Deterministic privilege by role
    privilege_level = config["privilege"]

    # Tenure (overlapping distributions)
    tenure_low, tenure_high = config["tenure_range"]
    tenure_months = np.random.randint(tenure_low, tenure_high)

    # Typical login hour (normal distribution, clipped)
    typical_login_hour = np.clip(
        np.random.normal(config["login_mean"], 1.5),
        6, 13
    )

    # Behavioral login variability
    login_hour_std = abs(
        np.random.normal(config["login_std_mean"], 0.4)
    )

    # Department (balanced but role-constrained)
    if dept_cycle[i] in config["dept_pool"]:
        department = dept_cycle[i]
    else:
        department = random.choice(config["dept_pool"])

    # Employment status (small % risky)
    employment_status = np.random.choice(
        ["active", "on_notice"],
        p=[0.9, 0.1]
    )

    # Remote worker flag
    remote_worker = np.random.choice(
        [True, False],
        p=[0.3, 0.7]
    )

    # Behavioral stability score (used later for anomaly likelihood)
    behavior_variability_score = round(
        np.clip(np.random.normal(0.5, 0.15), 0.1, 0.9),
        2
    )

    users.append([
        user_id,
        role,
        department,
        privilege_level,
        tenure_months,
        round(typical_login_hour, 2),
        round(login_hour_std, 2),
        employment_status,
        remote_worker,
        behavior_variability_score
    ])

users_df = pd.DataFrame(users, columns=[
    "user_id",
    "role",
    "department",
    "privilege_level",
    "tenure_months",
    "typical_login_hour",
    "login_hour_std",
    "employment_status",
    "remote_worker",
    "behavior_variability_score"
])

users_df.to_csv("users2.csv", index=False)

print("users.csv generated successfully.")