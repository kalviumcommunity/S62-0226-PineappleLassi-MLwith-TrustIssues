from pydantic import BaseModel

class InjectRequest(BaseModel):
    user_id: str | None = None
    anomaly_type: str = "data_exfiltration"