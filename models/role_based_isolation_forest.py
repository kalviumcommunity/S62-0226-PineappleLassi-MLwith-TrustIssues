# =========================
# Role-Based Isolation Forest Training
# =========================

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest


# =========================
# Paths
# =========================
DATA_PATH = "../data/processed/"
MODEL_PATH = "../outputs/models/role_iforest/"

os.makedirs(MODEL_PATH, exist_ok=True)


# =========================
# Load Data
# =========================
print("📥 Loading data...")

X_train = joblib.load(DATA_PATH + "X_train.pkl")

# If you saved feature names
feature_names = None
try:
    feature_names = joblib.load(DATA_PATH + "feature_names.pkl")
    X_train = pd.DataFrame(X_train, columns=feature_names)
    print("✅ Feature names loaded")
except:
    print("⚠️ Feature names not found, using array format")


print(f"Train shape: {X_train.shape}")


# =========================
# Identify Role Columns
# =========================
role_columns = [col for col in X_train.columns if "role_" in col]

print(f"Detected role columns: {role_columns}")


# =========================
# Train Models per Role
# =========================
models = {}

for role_col in role_columns:

    print(f"\n🚀 Training model for {role_col}...")

    # Filter rows for this role
    role_data = X_train[X_train[role_col] == 1]

    if len(role_data) < 50:
        print(f"⚠️ Skipping {role_col} (not enough data)")
        continue

    # Drop role columns to avoid leakage
    role_data_model = role_data.drop(columns=role_columns)

    print(f"Training samples: {len(role_data_model)}")

    # Initialize model
    model = IsolationForest(
        n_estimators=200,
        contamination=0.02,
        max_samples='auto',
        random_state=42,
        n_jobs=-1
    )

    # Train
    model.fit(role_data_model)

    # Save model
    role_name = role_col.replace("role_", "")
    model_file = MODEL_PATH + f"{role_name}_iforest.pkl"

    joblib.dump(model, model_file)

    print(f"💾 Saved: {model_file}")

    models[role_name] = model


print("\n🎉 All role-based models trained!")