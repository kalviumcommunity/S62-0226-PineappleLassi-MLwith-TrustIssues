import joblib
import numpy as np
import pandas as pd
import os
from pipeline.sequence_anomaly import compute_sequence_score


# Get current file directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# Load models once
encoder = joblib.load(os.path.join(BASE_DIR, "..", "outputs", "artifacts", "encoder.pkl"))
scalar = joblib.load(os.path.join(BASE_DIR, "..", "outputs", "artifacts", "scalar.pkl"))

global_if = joblib.load(os.path.join(BASE_DIR, "..", "outputs", "models", "global_iforest.pkl"))


def load_role_models(role):
    role_if = joblib.load(os.path.join(BASE_DIR, "..", "outputs", "models", "role_iforest", f"{role}_iforest.pkl"))
    role_lof = joblib.load(os.path.join(BASE_DIR, "..", "outputs", "models", "role_lof", f"{role}_lof.pkl"))
    role_pca = joblib.load(os.path.join(BASE_DIR, "..", "outputs", "models", "role_pca", f"{role}_pca.pkl"))

    return role_if, role_lof, role_pca


def compute_score(features_df, role, events):

    X = features_df.copy()

    # Preprocess
    numeric_cols = features_df.select_dtypes(include = np.number).columns.tolist()
    categorical_cols = features_df.select_dtypes(exclude = np.number).columns.tolist()
    X[numeric_cols] = scalar.transform(features_df[numeric_cols])

    encoded = encoder.transform(features_df[categorical_cols])
    encoded_df = pd.DataFrame(encoded, columns=encoder.get_feature_names_out(categorical_cols), index=X.index)

    X = X.drop(columns=categorical_cols)
    X = pd.concat([X, encoded_df], axis=1)


    # Dropping role column for role based models
    role_cols = [col for col in X.columns if "role_" in col]

    X_role = X.drop(columns=role_cols)

    # Global
    global_score = -global_if.decision_function(X)[0]

    # Role models
    role_if, role_lof, role_pca = load_role_models(role)

    role_if_score = -role_if.decision_function(X_role)[0]

    X_pca = role_pca.transform(X_role)
    role_lof_score = -role_lof.decision_function(X_pca)[0]

    role_score = 0.6 * role_if_score + 0.4 * role_lof_score

    sequence_score = compute_sequence_score(events)
    seq_score = np.tanh(sequence_score)

    final_score = 0.4 * global_score + 0.4 * role_score + 0.2 * seq_score

    return final_score