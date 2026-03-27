import pandas as pd
from models.sequence_model import MarkovSequenceModel
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load normal events only
events_df = pd.read_csv(os.path.join(BASE_DIR, "..", "data", "events_base.csv"), parse_dates=["timestamp"])

model = MarkovSequenceModel()
model.fit(events_df)

model.save(os.path.join(BASE_DIR, "..", "outputs", "models", "sequence_model.pkl"))

print("💾 Sequence model saved!")