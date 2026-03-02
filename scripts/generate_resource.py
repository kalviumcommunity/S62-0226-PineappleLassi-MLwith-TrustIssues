import pandas as pd
import numpy as np
import random

np.random.seed(42)
random.seed(42)

N_RESOURCES = 40

DEPARTMENTS = ["Finance", "IT", "Security", "Sales", "HR"]

# Department-specific resource distribution
DEPT_RESOURCE_PROFILE = {
    "Finance": {"public": 0.4, "sensitive": 0.5, "admin_only": 0.1},
    "IT": {"public": 0.3, "sensitive": 0.4, "admin_only": 0.3},
    "Security": {"public": 0.2, "sensitive": 0.4, "admin_only": 0.4},
    "Sales": {"public": 0.7, "sensitive": 0.25, "admin_only": 0.05},
    "HR": {"public": 0.4, "sensitive": 0.5, "admin_only": 0.1}
}

# Privilege requirement by type
REQUIRED_PRIVILEGE = {
    "public": 1,
    "sensitive": 2,
    "admin_only": 3
}

resources = []

# Ensure department balance
resources_per_dept = N_RESOURCES // len(DEPARTMENTS)

resource_counter = 0

for dept in DEPARTMENTS:
    profile = DEPT_RESOURCE_PROFILE[dept]
    resource_types = list(profile.keys())
    resource_probs = list(profile.values())

    for _ in range(resources_per_dept):
        resource_id = f"R{resource_counter:03d}"
        resource_counter += 1

        # Resource type based on department profile
        resource_type = np.random.choice(resource_types, p=resource_probs)

        # Sensitivity score (tight hierarchical bands)

        if resource_type == "public":
            sensitivity_score = np.random.normal(0.25, 0.05)
            sensitivity_score = np.clip(sensitivity_score, 0.05, 0.35)

        elif resource_type == "sensitive":
            sensitivity_score = np.random.normal(0.6, 0.08)
            sensitivity_score = np.clip(sensitivity_score, 0.35, 0.75)

        else:  # admin_only
            sensitivity_score = np.random.normal(0.9, 0.04)
            sensitivity_score = np.clip(sensitivity_score, 0.75, 1.0)

        sensitivity_score = round(float(sensitivity_score), 2)

        # Required privilege level
        # Base risk = sensitivity
        risk_score = sensitivity_score

        # Access scope adjustment
        if resource_type == "cross_department":
            risk_score += 0.10
        elif resource_type == "global":
            risk_score += 0.05

        # Department adjustment (slight tightening)
        if dept in ["IT", "Security"]:
            risk_score += 0.05

        # Small symmetric randomness
        risk_score += np.random.normal(0, 0.05)

        # Clip
        risk_score = np.clip(risk_score, 0, 1)

        # Adjusted thresholds (more permissive)
        if risk_score < 0.45:
            required_privilege_level = 1
        elif risk_score < 0.8:
            required_privilege_level = 2
        else:
            required_privilege_level = 3

        # Resource size modeling (MB)
        if resource_type == "public":
            resource_size_mb = round(np.random.uniform(1, 50), 2)
        elif resource_type == "sensitive":
            resource_size_mb = round(np.random.uniform(50, 500), 2)
        else:
            resource_size_mb = round(np.random.uniform(5, 100), 2)

        # Access scope
        if resource_type == "public":
            access_scope = np.random.choice(
                ["department_only", "cross_department", "global"],
                p=[0.1, 0.2, 0.7]
            )
        elif resource_type == "sensitive":
            access_scope = np.random.choice(
                ["department_only", "cross_department", "global"],
                p=[0.3, 0.6, 0.1]
            )
        else:  # admin_only
            access_scope = np.random.choice(
                ["department_only", "cross_department"],
                p=[0.8, 0.2]
            )

        resources.append([
            resource_id,
            resource_type,
            dept,
            sensitivity_score,
            required_privilege_level,
            resource_size_mb,
            access_scope
        ])

resources_df = pd.DataFrame(resources, columns=[
    "resource_id",
    "resource_type",
    "owner_department",
    "sensitivity_score",
    "required_privilege_level",
    "resource_size_mb",
    "access_scope"
])

resources_df.to_csv("resources2.csv", index=False)

print("resources.csv generated successfully.")