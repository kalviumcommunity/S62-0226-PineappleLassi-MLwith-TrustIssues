# =========================
# Role-Based Model Training (IF + LOF + PCA)
# =========================

import os
import joblib
import numpy as np
import pandas as pd

from sklearn.neighbors import LocalOutlierFactor
from sklearn.decomposition import PCA


# =========================
# Paths
# =========================
DATA_PATH = "../data/processed/"
MODEL_PATH = "../outputs/models/"

LOF_PATH = os.path.join(MODEL_PATH, "role_lof/")
PCA_PATH = os.path.join(MODEL_PATH, "role_pca/")


os.makedirs(LOF_PATH, exist_ok=True)
os.makedirs(PCA_PATH, exist_ok=True)


# =========================
# Load Data
# =========================
print("📥 Loading data...")

X_train = joblib.load(DATA_PATH + "X_train.pkl")

# Load feature names if available
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
for role_col in role_columns:

    print(f"\n🚀 Processing {role_col}...")

    # Filter data for role
    role_data = X_train[X_train[role_col] == 1]

    if len(role_data) < 50:
        print(f"⚠️ Skipping {role_col} (not enough data)")
        continue

    # Remove role columns (no leakage)
    role_data_model = role_data.drop(columns=role_columns)

    print(f"Samples: {len(role_data_model)} | Features: {role_data_model.shape[1]}")

    role_name = role_col.replace("role_", "")

    # =========================
    # 2️⃣ PCA (for LOF only)
    # =========================
    print("🔻 Applying PCA...")

    pca = PCA(n_components=0.95)
    role_data_pca = pca.fit_transform(role_data_model)

    joblib.dump(pca, PCA_PATH + f"{role_name}_pca.pkl")
    print(f"💾 PCA saved: {role_name}_pca.pkl")


    # =========================
    # 3️⃣ LOF Model
    # =========================
    print("📍 Training LOF...")

    lof_model = LocalOutlierFactor(
        n_neighbors=20,
        contamination=0.02,
        novelty=True,   # 🔥 critical for prediction
        n_jobs=-1
    )

    lof_model.fit(role_data_pca)

    joblib.dump(lof_model, LOF_PATH + f"{role_name}_lof.pkl")
    print(f"💾 LOF saved: {role_name}_lof.pkl")


print("\n🎉 All role-based models (PCA + LOF) trained successfully!")