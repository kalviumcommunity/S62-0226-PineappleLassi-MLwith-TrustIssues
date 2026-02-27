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
    
    users.append([
        user_id,
        role,
        department,
        privilege_level,
        tenure_months,
        typical_login_hour,
        round(login_hour_std, 2)
    ])

users_df = pd.DataFrame(users, columns=[
    "user_id",
    "role",
    "department",
    "privilege_level",
    "tenure_months",
    "typical_login_hour",
    "login_hour_std"
])

users_df.to_csv("users.csv", index=False)