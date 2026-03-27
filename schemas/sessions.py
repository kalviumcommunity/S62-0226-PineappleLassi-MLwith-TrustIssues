from pydantic import BaseModel
from typing import Literal


class SessionsResponse(BaseModel):
    session_id: str
    user_id : str
    timestamp: str
    risk_score: float
    risk_level: Literal["LOW","MEDIUM","HIGH"]
    is_anomaly : bool
    confidence: float
    reasons: object
