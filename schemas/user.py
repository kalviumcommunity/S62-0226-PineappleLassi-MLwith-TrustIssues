from pydantic import BaseModel

class UserResponse(BaseModel):
    user_id: str
    department: str
    role: str

class RiskyUserResponse(BaseModel):
    user_id: str
    department: str
    variability_score: float
    risk_score: float
    last_anomaly_timestamp: str