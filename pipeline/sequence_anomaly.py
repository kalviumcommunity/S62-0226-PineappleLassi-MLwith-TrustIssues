import joblib
import os
from models.sequence_model import MarkovSequenceModel

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

sequence_model = joblib.load(os.path.join(BASE_DIR, "..", "outputs", "models", "sequence_model.pkl"))


def compute_sequence_score(events):

    events = events.sort_values("timestamp")
    seq = events["event_type"].tolist()

    return sequence_model.score(seq)