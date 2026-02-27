import pandas as pd
import numpy as np
import random

np.random.seed(42)
random.seed(42)

N_RESOURCES = 40

DEPARTMENTS = ["Finance", "IT", "Security", "Sales", "HR"]

RESOURCE_TYPE_DISTRIBUTION = {
    "public": 0.65,
    "sensitive": 0.25,
    "admin_only": 0.10
}

SENSITIVITY_RANGES = {
    "public": (0.1, 0.3),
    "sensitive": (0.6, 0.8),
    "admin_only": (0.9, 1.0)
}

resource_types = list(RESOURCE_TYPE_DISTRIBUTION.keys())
resource_probs = list(RESOURCE_TYPE_DISTRIBUTION.values())

resources = []

for i in range(N_RESOURCES):
    resource_id = f"R{i:03d}"
    
    resource_type = np.random.choice(resource_types, p=resource_probs)
    
    owner_department = np.random.choice(DEPARTMENTS)
    
    sensitivity_min, sensitivity_max = SENSITIVITY_RANGES[resource_type]
    sensitivity_score = round(
        np.random.uniform(sensitivity_min, sensitivity_max), 2
    )
    
    resources.append([
        resource_id,
        resource_type,
        owner_department,
        sensitivity_score
    ])

resources_df = pd.DataFrame(resources, columns=[
    "resource_id",
    "resource_type",
    "owner_department",
    "sensitivity_score"
])

resources_df.to_csv("resources.csv", index=False)