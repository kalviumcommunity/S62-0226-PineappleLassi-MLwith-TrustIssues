# =========================
# sequence_model.py
# =========================

import pandas as pd
import numpy as np
import joblib
from collections import defaultdict

def inner_dict():
    return defaultdict(int)


class MarkovSequenceModel:
    def __init__(self):
        self.transition_counts = defaultdict(inner_dict)
        self.transition_probs = defaultdict(dict)
        self.states = set()

    # =========================
    # Train
    # =========================
    def fit(self, events_df):

        print("🚀 Training sequence model...")

        grouped = events_df.sort_values("timestamp").groupby("session_id")

        for session_id, group in grouped:

            seq = group["event_type"].tolist()

            for i in range(len(seq) - 1):
                curr = seq[i]
                nxt = seq[i + 1]

                self.transition_counts[curr][nxt] += 1
                self.states.add(curr)
                self.states.add(nxt)

        # Convert to probabilities
        for curr, transitions in self.transition_counts.items():
            total = sum(transitions.values())
            for nxt, count in transitions.items():
                self.transition_probs[curr][nxt] = count / total

        print("✅ Sequence model trained")

    # =========================
    # Score
    # =========================
    def score(self, sequence):

        if len(sequence) < 2:
            return 0

        anomaly_score = 0

        for i in range(len(sequence) - 1):
            curr = sequence[i]
            nxt = sequence[i + 1]

            prob = self.transition_probs.get(curr, {}).get(nxt, 1e-6)

            # low prob = anomaly
            anomaly_score += -np.log(prob)

        return anomaly_score / len(sequence)

    # =========================
    # Save / Load
    # =========================
    def save(self, path):
        joblib.dump(self, path)

    @staticmethod
    def load(path):
        return joblib.load(path)