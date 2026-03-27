import os
import pandas as pd

# For now using CSVs (later replace with DB queries)

# Get current file directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def load_session_data(session_id):
    users_df = pd.read_csv(os.path.join(BASE_DIR, "..", "data", "users.csv"))
    sessions_df = pd.read_csv(os.path.join(BASE_DIR, "..", "data", "sessions.csv"))
    events_df = pd.read_csv(os.path.join(BASE_DIR, "..", "data", "events_base.csv"))
    resources_df = pd.read_csv(os.path.join(BASE_DIR, "..", "data", "resources.csv"))
    
    session = sessions_df[sessions_df["session_id"] == session_id].iloc[0]
    user = users_df[users_df["user_id"] == session["user_id"]].iloc[0]
    events = events_df[events_df["session_id"] == session_id]

    return session, user, events, resources_df