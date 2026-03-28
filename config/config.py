import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATA_PATH = os.path.join(BASE_DIR,"..", "data", "sessions.csv")
USERS_PATH = os.path.join(BASE_DIR,"..", "data", "users.csv")
EVENTS_PATH = os.path.join(BASE_DIR,"..", "data", "events_base.csv")