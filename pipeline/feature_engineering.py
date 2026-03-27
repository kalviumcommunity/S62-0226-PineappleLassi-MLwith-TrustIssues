import pandas as pd
import numpy as np


def build_features(session, user, events, resources):

    EXPECTED_EVENT_TYPES = ["file_access", "admin_action", "file_export"]

    session = pd.DataFrame([session])
    user = pd.DataFrame([user])

    # Merging all of the data together
    df = session.merge(events, on=["session_id", 'user_id'], how = 'left')
    df = df.merge(user, on =['user_id'], how = 'left')
    df = df.merge(resources, on = ['resource_id'], how = 'left')

   # Event based features
    df["cross_department_access"] = (
    df["department"] != df["owner_department"]
).astype(int)
    
    df["global_access"] = (
    df["access_scope"] == "global"
)

    df["scope_violation"] = (
    (df["cross_department_access"] == 1) & (df["access_scope"] == "department_only")
)
    
    df["sensitive_access"] = (
    df["resource_type"] == "sensitive"
).astype(int)
    
    df['admin_only_access'] = (
    df["resource_type"] == "admin_only"
).astype(int)
    
    df["invalid_access"] = (
    df["access_success"] == False
).astype(int)
    
    # Grouping data based on each session

    sessions_df = df.groupby("session_id").agg({
    "event_id": "count",
    "data_volume_mb": "sum",
    "invalid_access": "sum",
    "cross_department_access": "sum",
    "global_access": "sum",
    "scope_violation": "sum",
    "sensitive_access": "sum",
    "admin_only_access": "sum",
    "resource_id": "nunique",
    "sensitivity_score": "mean"
}).reset_index()
    
    sessions_df = sessions_df.rename(columns={
    "event_id": "total_events",
    "data_volume_mb": "total_data_volume",
    "invalid_access": "failed_attempts",
    "cross_department_access": "cross_dept_count",
    "global_access": "global_access_count",
    "scope_violation": "scope_violation_count",
    "sensitive_access": "sensitive_resource_count",
    "admin_only_access": "admin_only_resource_count",
    "resource_id": "unique_resources",
    "sensitivity_score": "avg_sensitivity"
})

    sessions_df = sessions_df.merge(
    session,
    on=["session_id"],
    how="left"
)
    
    sessions_df = sessions_df.merge(
    user[[
        "user_id",
        "tenure_months",
        "role",
        "privilege_level",
        "typical_login_hour",
        "login_hour_std",
        "employment_status",
        "remote_worker",
        "behavior_variability_score"
    ]],
    on="user_id",
    how="left"
)
    
    sessions_df["total_events"] = sessions_df["total_events"].replace(0, 1)
    
    # Adding event type and session durations
    sessions_df["session_duration"] = ((
    pd.to_datetime(sessions_df["session_end"]) -
    pd.to_datetime(sessions_df["session_start"])
).dt.total_seconds() / 60).clip(lower=1)  # Avoid division by zero, minimum 1 minute
    
    event_type_counts = pd.crosstab(df["session_id"], df["event_type"])
    # Add missing columns with 0
    event_type_counts = event_type_counts.reindex(
        columns=EXPECTED_EVENT_TYPES,
        fill_value=0
    )

    sessions_df = sessions_df.merge(
    event_type_counts,
    on="session_id",
    how="left"
)
    
    # Calculating login hour deviation
    sessions_df["login_hour"] = pd.to_datetime(
    sessions_df["session_start"]
).dt.hour
    
    sessions_df["login_zscore"] = (
    sessions_df["login_hour"] - sessions_df["typical_login_hour"]
) / sessions_df["login_hour_std"]

    sessions_df["abs_login_z"] = abs(sessions_df["login_zscore"])

    sessions_df = sessions_df.drop(columns=["session_start", "session_end"])

    sessions_df["failed_attempts_ratio"] = (
    sessions_df["failed_attempts"] / sessions_df["total_events"]
)
    
    sessions_df["admin_action_ratio"] = (
    sessions_df["admin_action"] / sessions_df["total_events"]
)
    
    sessions_df["sensitive_resource_ratio"] = (
    sessions_df["sensitive_resource_count"] / sessions_df["total_events"]
)

    sessions_df["admin_only_resource_ratio"] = (
    sessions_df["admin_only_resource_count"] / sessions_df["total_events"]
)
    
    sessions_df["cross_dept_access_ratio"] = (
    sessions_df["cross_dept_count"] / sessions_df["total_events"]
)
    
    sessions_df['global_resource_access_ratio'] = (
    sessions_df["global_access_count"] / sessions_df["total_events"]
)
    
    sessions_df['scope_violation_ratio'] = (
    sessions_df["scope_violation_count"] / sessions_df["total_events"]
)
    
    sessions_df["sensitive_resource_access_ratio"] = (
    sessions_df["sensitive_resource_count"] / sessions_df["total_events"]
)

    sessions_df["resource_density"] = (
    sessions_df["unique_resources"] / sessions_df["total_events"]
)

    sessions_df["file_access_ratio"] = (
    sessions_df["file_access"] / sessions_df["total_events"]
)

    sessions_df["file_export_ratio"] = (
    sessions_df["file_export"] / sessions_df["total_events"]
)

    sessions_df["events_per_minute"] = (
    sessions_df["total_events"] /
    sessions_df["session_duration"]
)
    
    sessions_df["avg_data_per_event"] = (
    sessions_df["total_data_volume"] / sessions_df["total_events"]
)

    sessions_df = sessions_df.drop(columns=["cross_dept_count", "global_access_count","scope_violation_count","sensitive_resource_count","admin_only_resource_count","unique_resources","file_access","file_export", "admin_action", 'failed_attempts'])

    sessions_df = sessions_df.drop(columns=["typical_login_hour", "login_hour_std", "login_zscore"])

    sessions_df['mfa_used'] = sessions_df['mfa_used'].astype(int)
    sessions_df['remote_worker'] = sessions_df['remote_worker'].astype(int)

    # off hours
    sessions_df['off_hours'] = ((sessions_df['login_hour'] < 8) | (sessions_df['login_hour'] > 18)).astype(int)

    sessions_df['off_hours_admin_ratio'] = (
        sessions_df['admin_action_ratio'] * sessions_df['off_hours']
    )

    # entropy proxy
    sessions_df['admin_command_entropy'] = (
        sessions_df['admin_action_ratio'] * sessions_df['behavior_variability_score']
    )

    # config proxy
    sessions_df['config_change_frequency'] = (
        sessions_df['admin_action_ratio'] * sessions_df['events_per_minute']
    )

    # privilege gap proxy
    sessions_df['privilege_gap_mean'] = (
        sessions_df['admin_only_resource_ratio'] * sessions_df['privilege_level']
    )   

    # drop the session_id and user_id
    sessions_df.drop(['user_id', 'session_id'], axis=1, inplace=True)

    return sessions_df