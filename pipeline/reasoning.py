import numpy as np
import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# Load training stats (we will create this)
try:
    stats = joblib.load(os.path.join(BASE_DIR,"..", "outputs", "artifacts", "feature_stats.pkl"))
except:
    stats = None


def get_severity(feature, value):
    if not stats or feature not in stats:
        return None

    mean = stats[feature]["mean"]
    std = stats[feature]["std"]

    if std == 0:
        return None

    z = (value - mean) / std

    if z > 3:
        return "HIGH"
    elif z > 2:
        return "MEDIUM"
    elif z > 1:
        return "LOW"
    else:
        return None

def is_high(feature, value, k=2):
    """Check if value is significantly high"""
    if stats and feature in stats:
        mean = stats[feature]["mean"]
        std = stats[feature]["std"]
        return value > mean + k * std
    return False


def generate_reasons(features):

    row = features.iloc[0]
    reasons = []

    feature_reason_map = {
        "file_export_ratio": "High data export activity",
        "events_per_minute": "Unusual activity burst",
        "failed_attempts_ratio": "High failed login attempts",
        "cross_dept_access_ratio": "Cross-department access",
        "global_resource_access_ratio": "Accessing global resources",
        "resource_density": "Accessing many resources quickly",
        "avg_data_per_event": "Large data transfer per event",
        "abs_login_z": "Unusual login time pattern",
        "admin_action_ratio": "High admin activity",
        "privilege_gap_mean": "Access beyond privilege level"
    }

    for feature, message in feature_reason_map.items():
        value = row.get(feature, 0)
        severity = get_severity(feature, value)

        if severity:
            emoji = {
                "HIGH": "🚨",
                "MEDIUM": "🟠",
                "LOW": "🟡"
            }[severity]

            reasons.append(f"{emoji} [{severity}] {message}")

    # Hard rules (still keep these)
    if row.get("scope_violation_ratio", 0) > 0:
        reasons.append("🚨 [HIGH] Privilege scope violation detected")

    if row.get("admin_only_resource_ratio", 0) > 0.3:
        reasons.append("🚨 [HIGH] High access to admin-only resources")

    if row.get("off_hours_admin_ratio", 0) > 0:
        reasons.append("🚨 [HIGH] Off-hours privileged activity")

    if not reasons:
        reasons.append("No strong anomaly indicators detected")

    return reasons